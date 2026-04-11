function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const name = (body?.name || "").trim();
  const company = (body?.company || "").trim();
  const email = (body?.email || "").trim();
  const message = (body?.message || "").trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ ok: false, error: "missing_required_fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "missing_resend_api_key" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "support@yourdomain.com",
      to: "your@zoho.com",
      subject: "New inquiry from LP",
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "N/A")}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong><br>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
      `
    })
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    return new Response(JSON.stringify({ ok: false, error: "resend_failed", detail }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}

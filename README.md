# kinyacho-lp

キンヤチョの静的ランディングページ（LP）です。Cloudflare Pages での単独公開を前提に、HTML/CSS中心で実装しています。

## ローカル確認方法

1. このディレクトリで簡易サーバーを起動

```powershell
# Python がある場合
python -m http.server 8080
```

2. ブラウザで以下を開く

```text
http://localhost:8080
```

3. モバイル表示を優先確認
- ブラウザの開発者ツールで iPhone/Android 幅（320px〜430px程度）を中心に確認
- ヒーロー、価格、CTA、FAQ の視認性を重点チェック

## Cloudflare Pages 前提の補足

- 本LPは `index.html` をエントリにした静的構成です（ビルド不要）。
- GitHub に push すると Cloudflare Pages が自動デプロイされる前提で利用できます。
- OGP画像は `ogp.svg` を参照しています。
- 主要リンクは相対パス中心で実装し、Pages単体URL（`https://kinyacho-lp.pages.dev`）でそのまま表示可能です。

## `https://asb-screening.com/kinyacho/lp` へ載せる際の注意点

- 現状は Pages 単独公開向けの構成のため、将来 `/kinyacho/lp` 配下へ載せる際も相対パスのままで運用しやすい設計です。
- ただし OGP の `og:url` と `og:image` は現時点で `https://kinyacho-lp.pages.dev` を向いているため、本番ドメイン移行時は以下の更新を推奨します。
  - `og:url`
  - `og:image`
- `/kinyacho/lp` 配下で配信する際、リバースプロキシやルーティング設定側で `index.html` が正しく返ることを確認してください。

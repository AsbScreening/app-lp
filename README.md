# app-lp

## 概要

このリポジトリは、複数アプリのランディングページ（LP）を管理するための共通基盤です。  
Cloudflare Pages で公開する、静的サイト（HTML / CSS / JavaScript）として運用します。

- 目的: アプリごとのLPを同じルールで管理する
- 方針: シンプルな静的構成を維持し、追加・差し替えをしやすくする
- 想定: 今後 `photowake` を含む複数アプリのLPを段階的に追加

## ディレクトリ構成

```text
app-lp/
├─ assets/
│  ├─ common/                 # 共通資産（favicon / OGP / manifest / バッジ等）
│  │  ├─ badges/
│  │  ├─ favicon/
│  │  ├─ manifest/
│  │  └─ ogp/
│  ├─ kinyacho/               # 既存LP資産（アプリ別）
│  │  ├─ images/
│  │  └─ screens/
│  └─ photowake/              # 新規LP資産置き場（アプリ別）
│     ├─ images/
│     └─ screens/
├─ styles/
│  ├─ common.css              # 共通スタイル
│  ├─ hub.css                 # ルート一覧ページ用スタイル
│  ├─ kinyacho.css            # kinyacho LP用スタイル
│  └─ photowake.css           # photowake LP用スタイル
├─ kinyacho/
│  ├─ index.html             # /kinyacho
│  ├─ privacy/
│  │  └─ index.html          # /kinyacho/privacy
│  ├─ tokutei/
│  │  └─ index.html          # /kinyacho/tokutei
│  └─ terms/
│     └─ index.html          # /kinyacho/terms
├─ photowake/
│  └─ index.html             # /photowake
├─ functions/
│  └─ api/
│     └─ contact.js          # Cloudflare Pages Functions
├─ app-ads.txt               # AdMob app-ads.txt（/app-ads.txt で配信）
├─ index.html                # LP一覧ハブ（/）
├─ privacy.html              # /privacy.html -> /kinyacho/privacy
├─ tokutei.html              # /tokutei.html -> /kinyacho/tokutei
└─ README.md
```

## 開発方針

- 静的サイトで運用する（HTML / CSS / JavaScript）
- ビルドツールは導入しない
- 構成はシンプルに保つ
- 資産は `assets/<app-name>/` でアプリごとに分離する
- 共通資産は `assets/common/` に集約する

## デプロイ

- Cloudflare Pages を利用
- GitHub に push すると自動デプロイされる運用
- 公開URL
  - `/` : LP一覧ハブ
  - `/app-ads.txt` : AdMob app-ads.txt
  - `/kinyacho` : kinyacho LP
  - `/photowake` : photowake LP
  - `/kinyacho/privacy` : キンヤチョ プライバシーポリシー
  - `/kinyacho/tokutei` : キンヤチョ 特定商取引法に基づく表記
  - `/kinyacho/terms` : キンヤチョ 利用規約

## 新しいLPを追加する手順

1. `assets/` 配下にアプリ用ディレクトリを作成する（例: `assets/photowake/`）
2. `images/` と `screens/` に画像資産を配置する
3. HTMLページを作成する（新規作成または既存ページをベースに複製）
4. 必要なCSSを `styles/` に追加する（例: `styles/photowake.css`）
5. `meta` / OGP / favicon / manifest の参照パスを確認する
6. ローカル表示を確認して push する

## 注意事項

- favicon / manifest は `assets/common/` で共通管理する
- OGPはページごとに適切な `og:title` / `og:description` / `og:image` を設定する
- ファイル移動やディレクトリ変更時は、HTML内の参照パスを必ず更新する
- 画像やバッジを差し替えるときは、リンク切れがないかを確認する

## ローカル確認

簡易サーバーで確認できます。

```powershell
python -m http.server 8080
```

- アクセス: `http://localhost:8080`
- 確認対象: レイアウト崩れ、画像表示、リンク遷移、フォーム送信導線

## app-ads.txt 運用メモ

- `app-ads.txt` はホスト直下の `https://lp.asb-screening.com/app-ads.txt` を正とする
- `https://lp.asb-screening.com/photowake/` 配下には置かない
- Cloudflare Pages はビルドなしの静的配信のため、リポジトリルートの `app-ads.txt` がそのまま `/app-ads.txt` として公開される
- `app-ads.txt` の内容は次の1行のみとし、改変しない

```text
google.com, pub-1549455232787433, DIRECT, f08c47fec0942fa0
```

### デプロイ後の確認手順

1. ブラウザで `https://lp.asb-screening.com/app-ads.txt` に直接アクセスする
2. 表示内容が以下の1行のみであることを確認する

```text
google.com, pub-1549455232787433, DIRECT, f08c47fec0942fa0
```

3. 開発者ツールまたは `curl -i https://lp.asb-screening.com/app-ads.txt` で `200 OK` になっていることを確認する
4. HTMLではなくプレーンテキストとして取得できることを確認する
5. Cloudflare のキャッシュが残る場合はキャッシュパージ後に再確認する
6. App Store のデベロッパWebサイトが `https://lp.asb-screening.com/photowake/` であることを確認する
7. AdMob 管理画面で「アップデートを確認」を押して再検証する

## 今後の拡張メモ（任意）

- アプリごとのHTMLエントリ整理（例: `photowake.html`）
- 共通head設定のテンプレート化
- 運用ルール（命名規則・画像サイズ基準）の明文化

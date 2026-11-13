# 開発規約・運用手順

環境構築と起動方法は [README](../README.md)、共通の作業方針は [作業規約](../AGENTS.md) を参照してください。以下のパスとコマンドの実行場所はリポジトリルートを基準とします。

## 検査

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm test:build
pnpm preview
```

`test:build` は直前の `dist/` を検査します。remarkの規則を変更した際は `pnpm build --force` でAstroのContent Layerキャッシュを更新します。設定ディレクトリへ書き込めない環境では、Astroコマンドに `ASTRO_TELEMETRY_DISABLED=1` を付けてください。

## 記事と画像

原稿は `src/content/posts/{年}/{yyyyMMdd}.md` です。

```md
---
title: 記事タイトル
date: 2026-11-08
tags: [雑談]
---

本文です。

## 本文の見出し

![画像の説明](./images/20261108_example.webp)
```

- 日付は `YYYY-MM-DD` の文字列。日付から `/posts/yyyyMMdd` を決めます。ファイル名との不一致、不正日付、ID重複、未定義タグはビルドで検出します。タグの定義は `src/lib/blog.ts` にあります。
- 本文は通常のMarkdownです。本文の見出しはh2から始めます。注意が必要な内容だけ `> [!NOTE]` / `> [!WARNING]` を使えます。
- 抜粋は段落・箇条書きの先頭120 Unicodeコードポイントから自動生成し、一覧・SEO・RSSで共用します。
- 原画像は原稿の隣の `images/` に置きます。Astroが複数サイズを生成し、元画像より拡大しません。共通ロゴは固定URLで使うため `public/images/logo.webp` です。
- 移行済み11画像の `public/images/posts/` は原画像への相対シンボリックリンクです。編集元は `src/content/posts/` の1箇所で、ビルド後は従来URLに実ファイルが出力されます。リンクを維持できる環境でチェックアウトしてください。
- OGPは共通ロゴが既定です。個別画像が必要な記事だけfrontmatterに `ogImage: ./images/example.webp` を明示します。本文からは推測しません。
- RSS・OGP・JSON-LDの公開日時は、記事の日付のJST 0時です。

工程3の生成物テストは移行前の33記事・48ページを固定データとして照合します。今後、記事や本文を編集する場合は意図した変更として比較データと検査条件も更新してください。

## アイコン

アイコンはTabler Outline 3.50.0です。`src/components/Icon.astro` が公式 `@tabler/icons-astro` のSVGを表示し、サイズ・線幅・装飾アイコンの読み上げ抑制を共通化します。文字ラベルを添え、本文・操作部品は18px、見出しは20px、線幅は2です。

本文の注意書き・外部リンクは `@tabler/icons` のSVGをCSS maskとして使います。原稿やMarkdown処理へライブラリ固有の記法は入りません。SVGはビルド時にHTML・CSSへ埋め込み、追加のブラウザーJavaScriptや外部CDNを必要としません。Font Awesomeは依存関係から撤去済みです。対応する図柄と検証結果は [Tabler移行記録](astro-migration/tabler-icons.md)、ライセンスは [配布用MITライセンス](../public/licenses/tabler-icons.txt) を参照してください。

## Vercelと環境変数

`vercel.json` はAstro、`pnpm build`、出力先 `dist` を指定しています。`cleanUrls: true` と `trailingSlash: false` により、公開URLは拡張子・末尾スラッシュなしです。SSRアダプターは使用しません。

| ビルド環境                           | 検索登録              | GTM                |
| ------------------------------------ | --------------------- | ------------------ |
| `VERCEL_ENV=production`              | 有効                  | 有効。IDを必須検証 |
| `VERCEL_ENV=preview` / `development` | noindex・robotsで抑制 | 無効               |
| ローカルの通常ビルド・開発サーバー   | noindex・robotsで抑制 | 無効               |

GTMはビルド時の `GTM_ID=GTM-...` を使います。移行時は既存の `NEXT_PUBLIC_GTAGMGR_ID` もそのまま使用でき、`GTM-` 接頭辞の有無を許容します。両方ある場合は `GTM_ID` が優先です。**本番でIDが未設定・不正ならビルドを失敗させます。** Vercelのシステム環境変数をビルドへ公開する設定を有効にしてください。

ローカルで本番用HTMLだけを検査する場合は、次のように明示します。検査用IDの出力を実際に公開しないでください。`VERCEL_ENV` がある場合は `SITE_ENV` より優先します。

```sh
SITE_ENV=production GTM_ID=GTM-TEST123 pnpm build
SITE_ENV=production pnpm test:build
```

ブラウザー確認前には通常の `pnpm build` に戻します。`.env.example` は設定項目の例です。環境変数はビルドに埋め込まれるため、変更後は再ビルドが必要です。

`/rss.xml` はサイト本体から配信します。サイトマップは全公開48ページを含む `/sitemap-index.xml` と `/sitemap-0.xml` で、旧 `/sitemap.xml` はVercelの恒久転送により維持します。`robots.txt` も同じビルドで生成します。

## デプロイ後の確認

デプロイ後のHTTP検査は次のコマンドで実行できます。全48ページ、末尾スラッシュ・`.html`の転送、404、旧画像11件のハッシュ、参照アセット、RSS、サイトマップ、環境別のrobots・GTM出力を確認します。JavaScriptの実行やGTMへの送信は行いません。

```sh
node scripts/verify-deployment.mjs https://<deployment-host> preview /tmp/preview-check.json
node scripts/verify-deployment.mjs https://ponta-headphone.net production /tmp/production-check.json
```

Vercel認証で保護されたPreviewは、認証画面への転送を検査成功とは扱わず、未認証なら最初のリクエストで停止します。ログイン済みブラウザーで検査するか、承認済みの共有URLがある場合は `--share-url-stdin` を追加し、表示された入力待ちに共有URLを1行で渡してください。同じPreviewの共有URLだけを受け付け、取得したセッションCookieはそのプロセスのメモリ内で使用します。共有URL・Cookieは検査レポートに含めず、Gitへ保存しません。

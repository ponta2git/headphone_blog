# Copilot Instructions for headphone_blog

## プロジェクト概要

このプロジェクトは、Next.jsのApp Routerを利用した、ヘッドホンオーディオにまつわるブログのためのシステムです。Full Static Generationを用いて完全に静的に生成したものをデプロイしています。

プロジェクトは、コンピュータサイエンスとソフトウェアエンジニアリングの卓越した知見を元に慎重かつ丁寧に構成され、可読性・保守性・手スタビリティ・機能性などさまざまな品質を担保します。

## 記事ファイル構成

記事ファイルは、`posts/YYYY/YYYYMMDD.mdx`となっています。それぞれのファイルは、MarkdownのJSX拡張であるMDXファイル形式になっており、メタ情報をFrontmatterを持っています。ファイルは、`@mdx-js/mdx`パッケージを使用して、ビルド時に静的に読み込まれます。その際、以下のパッケージを使用します：

- `remark-frontmatter` + `remark-mdx-frontmatter` Frontmatterにあるメタデータ抽出
- `remark-gfm` GitHub Flavored Markdown利用
- `remark-images` 画像の取り扱い
- `remark-parse` 抜粋作成・OGP画像抽出用MDX ASTの生成

記事内のメタデータにはタグ情報があり、slugとのマッピングを行っています。マッピングは以下の通りです：

```json
{
  "購入": "purchase",
  "試聴": "try",
  "システム": "system",
  "評価指標": "metric",
  "雑談": "chat",
  "イベント": "event",
  "DAC": "dac",
  "ヘッドホンアンプ": "hpa",
  "ヘッドホン": "headphones"
}
```

また、記事のロード時には、記事内容の最初の100文字を抜粋して、メタデータとして追加します。さらに、記事にある最初の画像をOGP画像としてメタデータに追加します。それぞれのメタデータは、記事ページのメタデータ（Metaタグ、JSON-LD）にも使用されます。

## Next.js の具体的な設定

- Static export (`output: "export"`)
- Typed routes (`typedRoutes: true`)
- Unoptimized images (静的ホスト)
- Bundle analyzer （`@next/bundle-analyzer`を`ANALYZE`環境変数によって適用）

それぞれのページのURLは以下の通りです；

- `posts/YYYYMMDD` 各記事ページ
- `all-articles` 記事一覧ページ
- `tags` タグ一覧ページ
- `tags/[slug]` 各タグページ

## 開発、ビルドコマンド

```bash
pnpm dev              # Next.js dev with Turbopack
pnpm build            # Static export to /out
pnpm test             # Vitest unit tests (specs/**/*.test.ts)
pnpm lint             # ESLint with auto-fix
pnpm analyze          # Bundle analysis (ANALYZE=true)
```

## その他使用ライブラリ

- Luxon（時刻フォーマット）

## Metagen (Pre-build)

`metagen` workspaceでは、次のファイルを生成します：

- `public/rss.xml` RSSファイル。直近5件の記事の情報を含む
- `public/sitemap.xml` サイトマップファイル

```bash
cd metagen && pnpm start  # Builds with Vite, then runs
```

### テスト

`metagen` のテストは、Vitestで行われています。

## 自己学習したプロジェクトの知識

このプロジェクトに関して、今まで依頼した内容からAI自身が自己学習した知識は、`knowledges.md`に集約します。必要に応じて活用し、変更が入った場合は指示がなくとも都度アップデートします。

# Copilot Instructions for headphone_blog

## プロジェクト概要

このプロジェクトは、Next.jsのApp Routerを利用した、ヘッドホンオーディオにまつわるブログのためのシステムです。Full Static Generationを用いて完全に静的に生成したものをデプロイしています。

プロジェクトは、コンピュータサイエンスとソフトウェアエンジニアリングの卓越した知見を元に、慎重かつ丁寧に構成され、可読性・保守性・拡張性・テスタビリティ・機能性などさまざまな品質を担保します。

また、Webデザイン、コンテンツ制作、日本語組版などの深い技術と経験を元に、情報アーキテクチャやユーザー体験とデザインを深く統合し、デザインシステムを構築して運用します。

## 記事ファイル構成

記事ファイルは、`posts/YYYY/YYYYMMDD.mdx`となっています。それぞれのファイルは、MarkdownのJSX拡張であるMDXファイル形式になっており、メタ情報をFrontmatter、およびMDXを解析したデータから収集しています。ファイルは、`@mdx-js/mdx`パッケージを使用して、ビルド時に静的に読み込まれます。

## Next.js の具体的な設定

- Static export (`output: "export"`)
- Typed routes (`typedRoutes: true`)
- Unoptimized images (静的ホスト)
- Bundle analyzer （`@next/bundle-analyzer`を`ANALYZE`環境変数によって適用）

## 開発、ビルドコマンド

```bash
pnpm dev              # Next.js dev with Turbopack
pnpm build            # Static export to /out
pnpm test             # Vitest unit tests (specs/**/*.test.ts)
pnpm lint             # ESLint with auto-fix
pnpm analyze          # Bundle analysis (ANALYZE=true)
```

## Metagen (Pre-build)

`metagen` workspaceでは、次のファイルを生成します：

- `public/rss.xml` RSSファイル。直近5件の記事の情報を含む
- `public/sitemap.xml` サイトマップファイル

```bash
cd metagen && pnpm start  # Builds with Vite, then runs
```

### テスト

`metagen` のテストは、Vitestで行われています。

## 自己学習したプロジェクトの詳細な知識

このプロジェクトに関して、AI自身が自己学習した知識は、`knowledges/` ディレクトリに集約します。メインの索引は `knowledges/README.md` です。必要に応じて活用し、変更が入った場合は指示がなくとも都度アップデートします（新規ドキュメントは `knowledges/` 配下に追加）。

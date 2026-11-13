# pontaのヘッドホンブログ

Astroで記事・一覧・RSS・サイトマップを静的生成し、Vercelから配信するブログです。通常の閲覧にサーバー実行やReactは必要ありません。

## 開発を始める

Node.js 24、pnpm 10.8.0を使用します。Nodeのバージョンは `mise.toml`、pnpmは `package.json` で固定しています。

```sh
pnpm install --frozen-lockfile --strict-peer-dependencies
pnpm dev
```

## 主な構成

- `src/content/posts/`: 記事の原稿と原画像。
- `src/lib/blog.ts`、`src/lib/markdown.ts`: Astroから独立した記事規則・Markdown処理。
- `src/content.config.ts`、`src/lib/posts.ts`: AstroのContent Collectionsへの接続。
- `src/pages/`、`src/layouts/`、`src/components/`: 静的ページ、SEO、フィード、表示。
- `src/scripts/`、`src/styles/`: 標準DOMによる操作と標準CSS。
- `tests/unit/`、`tests/build/`: 規則と静的出力の検査。

## ドキュメント

- [開発規約・運用手順](docs/development.md): 検査、記事・画像、アイコン、公開設定とデプロイ後の確認。
- [作業規約](AGENTS.md): 並列作業、コミット、設計改善、文書・機微情報の扱い。

[工程1の比較仕様](docs/astro-migration/phase-1.md) · [工程2の記録](docs/astro-migration/phase-2.md) · [工程3の記録](docs/astro-migration/phase-3.md) · [工程4の進捗](docs/astro-migration/phase-4.md)

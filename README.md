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
- `src/domain/`、`src/application/`: Astroから独立した記事規則、カタログ、SEO。
- `src/config/`、`src/infrastructure/`: 公開設定とContent Collections・Markdownへの接続。
- `src/pages/`: URLと静的パス生成、画面・RSS・robotsの組み立て。
- `src/presentation/`: レイアウト、表示部品、標準DOM操作、標準CSS。
- `tests/unit/`、`tests/build/`: 規則・依存境界・静的出力の検査。`pnpm verify` で一括実行。

## ドキュメント

- [開発規約・運用手順](docs/development.md): 検査、記事・画像、アイコン、公開設定とデプロイ後の確認。
- [アーキテクチャと品質契約](docs/architecture.md): ISO/IEC 25010に基づく責務、依存方向、設計判断、合格条件。
- [作業規約](AGENTS.md): 並列作業、コミット、設計改善、文書・機微情報の扱い。

[工程1の比較仕様](docs/astro-migration/phase-1.md) · [工程2の記録](docs/astro-migration/phase-2.md) · [工程3の記録](docs/astro-migration/phase-3.md) · [工程4の進捗](docs/astro-migration/phase-4.md)

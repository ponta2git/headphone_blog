# Astro移行の試作

工程2の独立した静的サイト。現行のNext.jsサイトとVercel設定は引き続きリポジトリ直下にあります。公開用ではなく、代表記事で移行経路を確認するためのパッケージです。

```sh
pnpm --dir astro install --frozen-lockfile --strict-peer-dependencies
pnpm --dir astro dev
pnpm --dir astro check
pnpm --dir astro lint
pnpm --dir astro format:check
pnpm --dir astro test
pnpm --dir astro build
pnpm --dir astro test:build
pnpm --dir astro preview
```

設定ディレクトリへ書き込めない環境では、Astroコマンドに `ASTRO_TELEMETRY_DISABLED=1` を付けます。

`test:build` は直前の `dist/` を検査するため、先にビルドしてください。remarkプラグインの規則を変更した際は `pnpm --dir astro build --force` でAstroのContent Layerキャッシュを更新します。

代表5記事、トップ・記事一覧・タグ一覧・4タグページ、RSSを生成します。原稿内の `/posts/20230210` は未移行記事へのリンクのため、試作にはページがありません。RSSと前後・関連記事も代表5記事の範囲で生成します。

画像原本は `src/content/posts/*/images/` にあります。既存 `public/images/posts/` の3ファイルはそこへの相対シンボリックリンクにし、`astro/public/images` から公開画像全体を参照しています。原画像は1つで、Next.jsとAstroの静的出力には従来URLの実ファイルがコピーされます。

全ページに `noindex, nofollow`、試作用robotsに `Disallow: /` を設定しています。サイトマップ・GTMと本番切り替えは次工程以降です。

実施結果と交換可能な境界は [工程2の記録](../docs/astro-migration/phase-2.md) を参照してください。

ESLint 10と現行Next.jsのESLint 9の間接依存が混ざらないよう、工程2ではワークスペース・ロックファイルを独立させています。工程3で旧構成を撤去するときに統合します。

`@emnapi/runtime` は型検査ツールのWASMランタイムのpeer解決用です。自動解決された2.0ベータ版と1.xのcoreを組み合わせると `astro check` が起動できなかったため、互換性を検証した安定版1.11.3を明示しています。

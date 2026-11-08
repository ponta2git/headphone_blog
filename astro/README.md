# Astro移行の試作

工程2の独立した静的サイト。現行のNext.jsサイトとVercel設定は引き続きリポジトリ直下にあります。公開用ではなく、代表記事で移行経路を確認するためのパッケージです。

```sh
pnpm --dir astro install --frozen-lockfile --strict-peer-dependencies
pnpm --dir astro dev
pnpm --dir astro check
pnpm --dir astro lint
pnpm --dir astro format:check
pnpm --dir astro build
```

設定ディレクトリへ書き込めない環境では、Astroコマンドに `ASTRO_TELEMETRY_DISABLED=1` を付けます。

ESLint 10と現行Next.jsのESLint 9の間接依存が混ざらないよう、工程2ではワークスペース・ロックファイルを独立させています。工程3で旧構成を撤去するときに統合します。

`@emnapi/runtime` は型検査ツールのWASMランタイムのpeer解決用です。自動解決された2.0ベータ版と1.xのcoreを組み合わせると `astro check` が起動できなかったため、互換性を検証した安定版1.11.3を明示しています。

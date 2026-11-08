# Tabler Iconsへの移行

2026-11-08に実施。第三工程の追加作業として、第四工程のVercel Preview検証前にTablerへ統一した。

- `0c840b5`: Tablerの導入と表示変更。
- 本記録と同じコミット: Font Awesomeの残存依存の撤去と検証記録。

## 構成

公式の `@tabler/icons-astro` とSVG素材の `@tabler/icons` を3.50.0で固定した。どちらもMITライセンス。配布物に [ライセンス本文](../../public/licenses/tabler-icons.txt) を含める。

`src/components/Icon.astro` は使用する15種類の公式Astroコンポーネントをまとめ、`aria-hidden="true"`、`focusable="false"`、線幅2を共通化する。通常18px、見出し20pxで、既存の文字色を継承する。すべて文字ラベルに添える装飾として表示し、操作名をアイコンだけに依存させない。

注意・情報・外部リンクの3種類は `src/styles/global.css` で公式SVGをCSS maskとして読み込む。パッケージの公開パスは `@tabler/icons/outline/*.svg`。ビルド後はCSS内のdata URLとなり、SVGの追加リクエストは発生しない。Markdown原稿と `src/lib/markdown.ts` は変更していない。

React、アイコン用のクライアントJavaScript、CDN、Webフォントは使用しない。サイトが配信する既存JavaScriptのSHA-256は導入前と一致した。

## 図柄の対応

移行前の18種類に対応する図柄を使用する。Twitterの鳥ロゴはTablerにも `brand-twitter` として存在するが、今回は既存Astro版の「X」表記に合わせて `brand-x` を選んだ。

| 旧Font Awesome       | Tabler          | 主な使用箇所                           |
| -------------------- | --------------- | -------------------------------------- |
| `bolt`               | `bolt`          | 新着記事                               |
| `headphones-simple`  | `headphones`    | 感想                                   |
| `comment-dots`       | `message-dots`  | 考察                                   |
| `magnifying-glass`   | `search`        | タグを探す                             |
| `newspaper`          | `news`          | 記事一覧・関連記事                     |
| `tag`                | `tag`           | タグ別一覧の見出し                     |
| `radio`              | `radio`         | システム紹介                           |
| `sitemap`            | `sitemap`       | 全記事への導線                         |
| `envelope`           | `mail`          | メール                                 |
| `rss`                | `rss`           | RSS                                    |
| `twitter`            | `brand-x`       | Xのプロフィール・共有                  |
| `clipboard`          | `clipboard`     | URLコピー                              |
| `arrow-up`           | `arrow-up`      | 先頭へ移動                             |
| `chevron-left`       | `chevron-left`  | 前の記事                               |
| `chevron-right`      | `chevron-right` | 次の記事                               |
| `info-circle`        | `info-circle`   | NOTEのラベル                           |
| `circle-exclamation` | `alert-circle`  | WARNINGのラベル                        |
| `external-link`      | `external-link` | 本文・プライバシーポリシーの外部リンク |

既存の余白・整列中心のデザインに合わせ、タグの各項目や記事本文の各見出しへ一律に追加することはしていない。URL・記事情報・本文・RSS・SEOの仕様は第三工程と同じ。

## 検証

- `astro check`: 30ファイル、エラー・警告・ヒント0。
- ESLint・Prettier・frozen/strictインストールが成功。
- 既存の単体29件・生成物40件が成功。全33記事の本文と一覧・前後/関連記事・画像・RSS・サイトマップの互換性を継続確認。
- 全49HTMLのインラインSVG669個で、読み上げ抑制・フォーカス抑制・線幅2を確認。15図柄とCSS内の3図柄で合計18種類。
- Chromiumの1280px・390px・320px幅で、トップ、記事一覧、感想、考察、タグ別一覧、代表2記事の21表示を確認。横はみ出し・インラインアイコンの欠落・ページ実行エラーなし。
- 本文用SVGのパスを公式の公開パスへ修正後、注意・情報・外部リンクがdata URLで表示され、HTTPエラーがないことを再確認。
- コピー成功／拒否時の通知、Enter／Space操作、先頭へのフォーカス移動、表の矢印キーによる横スクロールを確認。
- JavaScript無効でもナビゲーション・本文・注意書き・共有・先頭リンクとアイコンが表示され、コピーbuttonは非表示。
- Font Awesomeの3直接依存と、関連するロックファイルの項目を撤去。

第四工程は、この変更を含むブランチからVercel Previewへ展開して進める。本追加工程ではデプロイを行っていない。

# Content Style — Frontmatter/執筆/リンク作法

最終更新: 2025-11-02 (JST)

## Frontmatter 規約（MDX）

必須:

- title: string（記事タイトル）
- date: yyyy-MM-dd（JST）
- tags: string[]（`src/site/tags.ts` に定義済み）
- description: 120±20 文字で本文要約（meta/OG 兼用）
- hero.src: 先頭アイキャッチ画像パス
- hero.alt: 代替テキスト（内容を要約）

任意:

- tldr: string[]（要点）
- canonical: string
- updated: yyyy-MM-dd
- relations.manual: string[]（関連の手動補助）
- seo.noindex: boolean

## 執筆スタイル（日本語）

- 行長 65–72ch、段落は 3–5 文でチャンク化
- h2: セクション大見出し、h3: 小見出し。レベル飛び禁止
- 強調は太字/引用で。色相による強調は禁止（意味と混線するため）
- 画像は `figure>img + figcaption`、本文幅に合わせる
- コードブロックはハイライトのみ、JS不要。行番号は任意

## 内部リンクと回遊

- 本文中の内部リンクは 2 箇所以上（該当時）
- 記事末: 隣接（prev/next）→ 関連（≤4）→ タグの順
- リンクテキストは目的が分かる語（2.4.4/2.4.9）

## SEO/メタ

- Metadata API で title/description/canonical/OG/Twitter を提供
- JSON-LD: BlogPosting（headline/datePublished/dateModified/author/keywords/image/url）
- 画像は 1200×630 を推奨（OG）

## チェックリスト

- [ ] description が 120±20 文字
- [ ] hero.alt が内容を適切に記述
- [ ] 見出しレベルに飛びなし、h≥3 で TOC が表示
- [ ] 本文内の内部リンク ≥ 2（該当時）

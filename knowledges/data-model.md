# Data Model (Posts, Tags)

Last Updated: 2025-11-02 (JST)

## Filesystem

- Path: `posts/YYYY/YYYYMMDD.mdx`
- Filename is the canonical postdate (JST)

## Types (see `src/posts/types.ts`)

- `Postdate`: Luxon `DateTime<true>` fixed to JST
- `Tag`: `{ name: TagName; slug: TagSlug }`
- `PostFrontmatter`: `{ date: Postdate; title: string; tags: Tag[]; tldr?: string[] }`
- `Post`:
  - `frontmatter: PostFrontmatter`
  - `excerpt: string`
  - `body: MDXContent`
  - `rawContent: string`
  - `ogImage?: string`
  - `readTime?: number`
  - `headings?: { id: string; text: string; level: 2|3|4|5|6 }[]`

## Tag Definitions

- Defined in `src/site/tags.ts` (JP name → slug)
- Mapping example:
  `{ "購入": "purchase", "試聴": "try", "システム": "system", "評価指標": "metric", "雑談": "chat", "イベント": "event", "DAC": "dac", "ヘッドホンアンプ": "hpa", "ヘッドホン": "headphones" }`

## Derived Fields

- `excerpt`: first N chars (`CONTENT_CONSTANTS.EXCERPT_LENGTH`)
- `ogImage`: first image in MDX body
- `headings`: h2–h6 with stable ids (renderer/extractor parity)
- `readTime`: based on character count heuristic

## Relationships

- Related posts: shared tag count → descending score
- Neighbours: chronological prev/next based on PostIndex order

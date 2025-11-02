# System Architecture

Last Updated: 2025-11-02 (JST)

## Overview

- Runtime: Next.js 16 (App Router) with Full Static Generation (`output: "export"`)
- Language: TypeScript (strict)
- Rendering: MDX v3 compiled at build time
- Timezone/Locale: `Asia/Tokyo`, `ja-JP` (Luxon)

## Layered Structure and Rules

Allowed import direction (no cycles):

```
app/  →  posts/api.ts  →  posts/{files,parse,meta}
                       ↘  site/, utils/, errors/, lib/
lib/tag depends on posts/api (NOT vice versa)
```

- `app/`: routes and UI composition only (no direct file I/O or parsing)
- `posts/api.ts`: single façade for all post-related operations
- `posts/files/`: disk access, scanning, PostIndex singleton
- `posts/parse/`: MDX compilation, AST extraction (excerpt/og/headings), read-time
- `posts/meta/`: Metadata API and JSON-LD
- `site/`: site config, constants, tag definitions
- `utils/`: logger, performance tracking
- `errors/`: typed domain errors

## Key Modules

- `src/posts/api.ts`
  - `getPostByDate(date)` (cached)
  - `getAllPosts()` (desc by date)
  - `getAllPostDates()` (for static params)
  - `getPostsByTag(tag)`
  - `getRelatedPosts(post, limit)` (tag overlap)
  - `getNeighbourPosts(date)` (prev/next)
  - `getTagStats()`

- `src/posts/files/index.ts` (PostIndex)
  - Scans `posts/` once, then provides O(1) lookups

- `src/posts/parse/compile.ts`
  - Validates frontmatter and compiles MDX → component

- `src/posts/parse/extract.ts`
  - Excerpt, first image (OGP), headings, readTime
  - Heading ID algorithm mirrors renderer

- `src/posts/meta/generate.ts`
  - Next Metadata for posts/archives/static pages

## App Router Contracts

- Dynamic page: `src/app/posts/[postdate]/page.tsx`
  - `export const dynamicParams = false`
  - `export async function generateStaticParams()` returns all postdates
  - `generateMetadata({ params })` and `Page({ params })`: `const { postdate } = await params`

## Caching Strategy

- `CacheManager<string, Post>` caches compiled posts (key: `yyyyMMdd`)
- `CacheManager<string, Error>` caches load/compile failures for 30s to avoid repeated disk hits in dev

## Build & Export

- Full static export: all routes must be resolvable at build time
- No server runtime assumptions (no dynamic DB/file access at request time)

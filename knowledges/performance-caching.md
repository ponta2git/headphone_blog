# Performance & Caching

Last Updated: 2025-11-02 (JST)

## Indexing

- PostIndex scans `posts/` once and caches mapping: date → filepath
- Provides `getAllDates()` and tag stats derivation

## Compilation Cache

- Compiled `Post` cached by key `yyyyMMdd`
- Error cache (TTL 30s) prevents repeated disk/parsing errors during dev

## Static Export

- All routes are pre-rendered
- Expensive work must happen at build time (AST parsing, image detection)

## Optional Profiling

- `utils/performance.ts` can time critical sections during dev

## Rendering Efficiency

- ArticleCard compact variant in grids
- Avoid oversized images; MDX images are unoptimized due to static hosting

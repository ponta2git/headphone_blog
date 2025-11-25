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

## Field Web Vitals Measurement

- A lightweight client component (`src/components/analytics/WebVitalsReporter.tsx`) emits Core Web Vitals (LCP/CLS/INP).
- Emission targets:
  - If `window.dataLayer` exists (e.g., when GTM is enabled via `ENABLE_GTM=true`), it pushes `{ event: "web_vitals", metric, value, rating, delta, id, navigationType }`.
  - Otherwise, it logs to the console with the `[web-vitals]` prefix for local inspection.
- Mount point: added globally in `src/app/layout.tsx` so every page reports once per navigation.
- Notes:
  - CLS is multiplied by 1000 and rounded to align with common analytics dashboards.
  - For accurate LCP in production, prefer real-user data; lab numbers can differ from field due to CDN and device variance.

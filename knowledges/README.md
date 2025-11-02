# Knowledge Base — headphone_blog (Architecture, IA, Design, UX)

This document is a compact, AI-friendly guide to the blog’s architecture and UX. It captures implementation contracts, allowed dependencies, and practical checklists to safely evolve the system.

Last Updated: 2025-11-02 (JST)

## Index

- Architecture: `knowledges/architecture.md`
- Information Architecture: `knowledges/information-architecture.md`
- Design System: `knowledges/design-system.md`
- Design Tokens: `knowledges/design-tokens.md`
- Rendering & Pipeline: `knowledges/rendering-pipeline.md`
- Data Model: `knowledges/data-model.md`
- SEO & Metadata: `knowledges/seo-metadata.md`
- Performance & Caching: `knowledges/performance-caching.md`
- Performance & Images (LCP): `knowledges/performance-images.md`
- Error Handling: `knowledges/error-handling.md`
- Testing & Quality: `knowledges/testing-quality.md`
- Operations: `knowledges/operations.md`
- AI Playbook: `knowledges/ai-playbook.md`
- Renewal Plan: `knowledges/renewal-plan.md`
- Accessibility: `knowledges/accessibility.md`
- Content Style: `knowledges/content-style.md`

## 1) Executive Summary

- Tech: Next.js 16 (App Router), React 19, TypeScript strict, MDX v3, Luxon.
- Output: Full Static Generation (output: "export"). No runtime servers or ISR.
- Data: Posts are MDX files under `posts/YYYY/YYYYMMDD.mdx` with strict date naming.
- UX: 80ch reading column, Japanese typography settings, compact footer, accessible nav.
- Pages: Home (latest posts, tags), All Articles, Tags (/tags, /tags/[slug]), Article (/posts/YYYYMMDD), Discussions, Impressions, Privacy.

Non‑negotiables (invariants):

- Static export must succeed without Node runtime. All data must be build-time discoverable.
- App Router: `generateStaticParams()` for dynamic pages, `dynamicParams = false`.
- Params in App Router may be promises; always `await params` inside `Page` and `generateMetadata`.
- Typed routes only; no string concatenation to unknown paths.
- CSS Modules with design tokens; avoid global style leakage.
- Dark mode is not required; only light theme is in scope.

## 2) System Architecture

Layers (allowed import direction):

- app/ → posts/api → posts/{files,parse,meta} → site/, utils/, errors/, lib/
- lib/tag depends on posts/api (not vice versa)

Key directories:

- src/posts/ (blog core)
  - files/: scan/load/index (PostIndex singleton)
  - parse/: compile (MDX), extract (excerpt/OGP/headings/readTime), images
  - meta/: Next Metadata + JSON-LD, plus compatibility exports
  - api.ts: public API for app/
- src/site/: site constants (TIMEZONE, LOCALE, paths, social) and tag definitions
- src/components/: ui primitives, features, layouts (CSS Modules)
- metagen/: build-time RSS and sitemap generators (Vite + Vitest)

Data flow (build-time):

1. files/scan builds list of MDX files → files/index constructs PostIndex
2. app/ uses posts/api to fetch data; api calls files/load and parse/compile
3. parse/extract produces: excerpt, first image (OGP), headings, readTime
4. meta/generate derives Metadata and JSON-LD

Caching:

- In-memory CacheManager caches compiled posts and last errors (TTL=30s) to speed local dev and tests.

## 3) Content Model (Contracts)

MDX location: `posts/YYYY/YYYYMMDD.mdx`

Frontmatter schema:

- title: string
- date: yyyy-MM-dd (JST)
- tags: TagName[] (must exist in `site/tags.ts`)
- tldr?: string[] (optional)

Derived fields (parse/extract):

- excerpt: first N characters (see `CONTENT_CONSTANTS.EXCERPT_LENGTH`)
- ogImage?: first image URL discovered in body
- headings?: array of { id, text, level: 2|3|4|5|6 }
- readTime?: minutes (approx. chars per minute heuristic)

Tag mapping (Japanese → slug):
{ "購入": "purchase", "試聴": "try", "システム": "system", "評価指標": "metric", "雑談": "chat", "イベント": "event", "DAC": "dac", "ヘッドホンアンプ": "hpa", "ヘッドホン": "headphones" }

Type highlights (`src/posts/types.ts`):

- Post: { frontmatter, excerpt, body, rawContent, ogImage?, readTime?, headings? }
- PostFrontmatter: { date: DateTime<JST>, title, tags, tldr? }

## 4) Information Architecture (IA)

Canonical routes:

- Home: `/` — latest posts grid (≤6), top tags (≤9) with counts, quick links (collections).
- Articles: `/posts/[postdate]` — single article (TL;DR, TOC≥3, content, share, related, neighbours).
- All: `/all-articles` — all posts list.
- Tags:
  - `/tags` — tag index with counts
  - `/tags/[slug]` — tag detail page (posts filtered)
- Collections: `/discussions`, `/impressions` — curated lists.
- Static: `/privacy`.

Nav & Identity:

- SiteHeader shows the logo as the primary identity on all pages.
- Home avoids a large PageHeader title to prevent duplication with the logo; a short lead paragraph is used instead.
- SiteFooter is compact with email/Twitter/RSS and privacy link.

## 5) Rendering Pipeline (App Router specifics)

- Dynamic posts route uses `generateStaticParams()` and `dynamicParams=false`.
- In both `generateMetadata` and the page component, destructure via `const { postdate } = await params`.
- Parse postdate using Luxon with `TIMEZONE` and `LOCALE`; reject invalid dates.
- Heading IDs are generated consistently in two places:
  - Renderer (MDX components) assigns ids to h2–h6 using recursive text extraction, fallback slug "section" if empty, and duplicate suffixes.
  - TOC extractor mirrors the same logic for a stable match between anchors and TOC.

## 6) Design System & Components

Tokens & layout:

- Container widths: `--container-max: 80ch`, `--container-narrow: 60ch`.
- Spacing scale: `--spacing-*` (4px base). Avoid `--space-*`.
- Typography tuned for Japanese: `font-feature-settings: "palt" 1, "pkna" 1`.

Primary components:

- ui/: Stack, Link (internal/external with icon), Badge (outlined variant available)
- features/: SiteHeader, SiteFooter, ArticleCard (full/compact), ArticleContent (MDX), ShareWith, PageHeader (not used on `/`)
- layouts/: PageLayout (narrow/normal/wide)

Key page templates:

- Home: compact ArticleCard grid, top tags cloud (gap uses `--spacing-2`), collections list; lead paragraph under logo.
- Article: centered container; header shows h1, date, read time, tags. Inside content: optional TL;DR list; TOC appears when ≥3 headings; ShareWith, Related (by tag overlap), and Neighbours nav.
- Tags: index with counts, detail per tag.

Accessibility notes:

- Links have discernible text and proper aria labels; external links open in new tab with `rel="noopener noreferrer"`.
- Neighbours links increase tap area and add pseudo-element arrows with ARIA labels.
- TOC uses details/summary; deeper levels show subtle visual prefixes.

## 7) SEO & Metadata

- Next Metadata API is used for all routes; canonical URLs are generated for posts.
- JSON-LD: Website and BlogPosting schemas generated under `posts/meta/schema.ts`.
- OGP: Prefer first in-article image if available; fallback by page context.

## 8) Performance & Caching

- PostIndex builds once and provides O(1) lookups from date → filepath.
- Compiled posts are cached per date; error results are cached for 30s to avoid repeated disk/parsing.
- Static export only; expensive operations must happen at build time.

## 9) Error Handling (essentials)

- Specific error classes for file I/O, compilation, and frontmatter validation.
- API caches and rethrows previous errors during TTL to stabilize dev feedback loops.

## 10) Testing & Quality Gates

- Vitest: `validation/posts.test.ts` validates presence/compilation and key invariants (date format, tags, excerpt, OG path validity).
- Quality gates (expected PASS before merge):
  - Type-check
  - ESLint
  - Unit tests

## 11) Operational Notes

Add a new post:

1. Create `posts/YYYY/YYYYMMDD.mdx`
2. Fill frontmatter (title, date, tags). Tags must exist in `site/tags.ts`.
3. Optional: TL;DR list in frontmatter.
4. Validate and preview (`pnpm test`, then `pnpm dev`).

Metagen pre-build:

- `metagen/` generates `public/rss.xml` and `public/sitemap.xml`.
- Run: `cd metagen && pnpm start` (Vite build then run).

## 12) AI Playbook (How to change things safely)

When adding features:

- Keep all app-layer data access via `posts/api.ts` only.
- Maintain heading ID sync between renderer and extractor.
- Prefer compact UI, 80ch reading width; preserve Japanese typography flags.
- Respect typed routes; wrap paths with `as Route` only when type-safe.

Examples:

- New list page: add route under `app/`, render with PageLayout + PageHeader; fetch via `posts/api`.
- New metadata: add to `posts/meta/generate.ts`, wire to page’s `generateMetadata`.
- New content field: update `posts/types.ts` → `parse/extract.ts` and `parse/compile.ts` → renderers.

## 13) Known Constraints

1. Postdate must be 8 digits (YYYYMMDD).
2. Files must live under `posts/YYYY/` with filename `YYYYMMDD.mdx`.
3. Tags restricted to definitions in `site/tags.ts`.
4. TZ: Asia/Tokyo; LOCALE: ja-JP.
5. Static export only (no server runtime).

## 14) Backlog & Future Work

- Full-text search
- Related posts scoring upgrade (TF‑IDF)
- Draft posts (`draft: true` in frontmatter)

## 15) Glossary

- IA: Information Architecture
- OGP: Open Graph Protocol image (social preview)
- TOC: Table of Contents (h2–h6)
- TL;DR: 要点の短いリスト（frontmatter `tldr`）

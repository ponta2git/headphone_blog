# Rendering & Pipeline (App Router)

Last Updated: 2025-11-02 (JST)

## App Router Contracts

- Dynamic route: `src/app/posts/[postdate]/page.tsx`
  - `export const dynamicParams = false`
  - `export async function generateStaticParams()` → all postdates
  - `export async function generateMetadata({ params })` → `const { postdate } = await params`
  - `export default async function Page({ params })` → `const { postdate } = await params`

## Postdate Parsing

- Parse with Luxon `DateTime.fromFormat(postdate, "yyyyMMdd", { zone: TIMEZONE, locale: LOCALE })`
- Invalid → throw (stops build for incorrect filenames)

## MDX Compilation

- `src/posts/parse/compile.ts` validates frontmatter and compiles MDX to React component
- `extract.ts` performs excerpt, OGP discovery, headings, readTime

## Heading IDs: One Source of Truth

- Renderer: recursive text extraction; fallback slug `section` if empty; duplicate suffixing
- Extractor (TOC): same algorithm to ensure IDs match anchors 1:1

## Metadata & JSON-LD

- `src/posts/meta/generate.ts` produces Next Metadata for posts/archives/static pages
- `schema.ts` emits Website and BlogPosting schemas

## Static Export

- No runtime: all data must be available at build time
- No ISR; changes require rebuild

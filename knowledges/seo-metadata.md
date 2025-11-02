# SEO & Metadata

Last Updated: 2025-11-02 (JST)

## Next Metadata API

- Posts: canonical URL `/posts/YYYYMMDD`
- Archives/Tags: explicit titles and descriptions
- Static pages: `generateStaticMetadata`

## JSON-LD

- `schema.ts` provides generators:
  - Website
  - BlogPosting (post)
  - CollectionPage (archives, tags)

## Open Graph & Twitter

- OGP image: first MDX image if present; otherwise page-specific fallback
- Title: Japanese typography; avoid truncation where possible

## Sitemap & RSS

- `metagen/` produces `public/sitemap.xml` and `public/rss.xml` (recent N posts)

## Accessibility and SEO

- Headings hierarchy h1 → h2 → … h6 in ArticleContent
- Links with descriptive labels and proper `rel` on external
- 80ch content width for readability, aiding dwell time and SEO

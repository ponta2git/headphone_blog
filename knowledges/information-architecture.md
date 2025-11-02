# Information Architecture (IA)

Last Updated: 2025-11-02 (JST)

## Routes

- Home `/`
  - Latest posts grid (≤6)
  - Top tags (≤9) with counts
  - Collections links (Discussions, Impressions, All Articles)
  - Lead paragraph below the logo (no big title to avoid duplication)

- Article `/posts/[postdate]` (YYYYMMDD)
  - TL;DR (frontmatter `tldr?: string[]`)
  - TOC (when ≥3 headings) with level prefixes
  - MDX content
  - Share, Related, Neighbours

- All Articles `/all-articles`

- Tags
  - Index `/tags` (counts)
  - Detail `/tags/[slug]` (filtered posts)

- Collections `/discussions`, `/impressions`

- Static `/privacy`

## Navigation

- SiteHeader logo anchors identity; avoid duplicate page titles on Home
- Compact SiteFooter with Email, Twitter, RSS, Privacy link

## Content Widths

- Page layout max width: 80ch (reading focus)
- Article content width: ~70ch (centered)

## Accessibility

- Clear link text; external links open in new tab with `rel="noopener noreferrer"`
- Neighbours: larger tap area and pseudo-element chevrons with ARIA labels
- TOC via `<details><summary>` for progressive disclosure

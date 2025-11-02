# Design System

Last Updated: 2025-11-02 (JST)

## Tokens

- Spacing: `--spacing-1..20` (4px base). Avoid legacy `--space-*`.
- Widths: `--container-max: 80ch`, `--container-narrow: 60ch`
- Colors: Primary teal, neutral grays, accent blue (HSL-based)
- Typography: `font-feature-settings: "palt" 1, "pkna" 1`
- Line heights: headings 1.4, body 1.8

## Components

- UI
  - Stack: layout spacing (vertical/horizontal)
  - Link: internal/external with external-icon and a11y
  - Badge: default/outlined variants (tag chips)

- Features
  - SiteHeader: logo banner (avoid duplicate H1 on Home)
  - SiteFooter: compact footer (reduced paddings, 1.75rem icons)
  - ArticleCard: full/compact variants, subtle hover grid option
  - ArticleContent: MDX renderer with h2–h6, Info/Warning blocks, nested lists
  - ShareWith: X share + clipboard
  - PageHeader: page-level title (do not use on Home)

- Layouts
  - PageLayout: max width variants `narrow|normal|wide`

## Patterns

- Home: grid of ArticleCards (compact + subtle hover), tag cloud with `gap: var(--spacing-2)`
- Article: 70ch centered content; TL;DR and TOC are optional blocks above content
- Related: tag-overlap ranking; show ArticleCards (compact)
- Neighbours: prev/next with larger tap targets

## CSS Modules

- All components use `*.module.css` for scoped styles
- Prefer tokens; avoid hard-coded sizes
- Mobile: reduce header height/padding and grid columns via auto-fit

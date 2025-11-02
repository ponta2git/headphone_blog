# Operations (Dev, Build, Content)

Last Updated: 2025-11-02 (JST)

## Developer Commands

```bash
pnpm dev     # Next.js dev (Turbopack)
pnpm build   # Static export to /out
pnpm test    # Vitest
pnpm lint    # ESLint
pnpm analyze # Bundle analysis (ANALYZE=true)
```

## Adding Content

1. Create `posts/YYYY/YYYYMMDD.mdx`
2. Frontmatter: `title`, `date (YYYY-MM-DD JST)`, `tags` (defined in `site/tags.ts`), optional `tldr`
3. Run tests, preview locally, then build

## Metagen (Pre-build)

- Location: `metagen/`
- Output: `public/rss.xml`, `public/sitemap.xml`
- Run: `cd metagen && pnpm start`

## Troubleshooting

- If an article route fails at runtime: ensure `await params` and valid postdate (8 digits)
- If TOC links don’t match anchors: check heading ID sync between renderer and extractor
- If styles look off: verify `--spacing-*` tokens (no `--space-*`)

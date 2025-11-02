# AI Playbook (Safe Changes)

Last Updated: 2025-11-02 (JST)

## Ground Rules

- Never bypass `posts/api.ts` from `app/`
- Keep heading ID generation in sync (renderer ↔ extractor)
- Respect static export: do not introduce runtime-only dependencies
- Use CSS Modules and design tokens; avoid global overrides
- Uphold typed routes (Route types) and explicit imports

## Common Tasks

- New list page:
  - Add route under `app/`
  - Use `PageLayout` + optional `PageHeader`
  - Fetch via `posts/api`

- New metadata type:
  - Add generator in `posts/meta/generate.ts`
  - Wire in page’s `generateMetadata`

- New frontmatter field:
  - Update types (`posts/types.ts`)
  - Extract in `parse/extract.ts`
  - Validate in `parse/compile.ts`
  - Render in relevant components

## UI Guidance

- Keep content to ~70–80ch width for readability
- Prefer compact, subtle interactions (reduced motion by default)
- Ensure external links have icon and `rel` attributes

## Checklists

- Build must pass static export
- Lint, type-check, tests all green
- For article route: verify `/posts/YYYYMMDD` renders and TOC anchors work

# Testing & Quality Gates

Last Updated: 2025-11-02 (JST)

## Tests (Vitest)

- File: `validation/posts.test.ts`
- Checks:
  - At least one post is found
  - All posts compile successfully
  - Frontmatter date/tag validity
  - Excerpt and OG image paths (if present)

## Quality Gates

- Type-check: must pass
- ESLint: must pass
- Unit tests: must pass

## Recommendations

- Add integration test to assert `generateStaticParams()` contains all dates
- Add test to validate heading IDs and TOC extraction parity on a synthetic MDX

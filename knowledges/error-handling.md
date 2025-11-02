# Error Handling

Last Updated: 2025-11-02 (JST)

## Error Types

- File errors: missing files, read errors (`src/errors/file-errors.ts`)
- Post errors: invalid frontmatter, compile failures (`src/errors/post-errors.ts`)

## API Behavior

- `getPostByDate()` caches success and caches thrown errors for 30s
- Errors bubble up to fail the relevant build step (static export must remain truthful)

## Frontmatter Validation

- Strict schema; missing fields or unknown tags throw typed errors
- Prefer catching issues in tests (`validation/posts.test.ts`) before build

## Diagnostics

- Logger outputs (namespace `posts/*`) can be increased via `LOG_LEVEL`
- Performance tracker available for timing hot paths

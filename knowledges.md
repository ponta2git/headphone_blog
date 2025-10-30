# Project Knowledge Base - headphone_blog

## Architecture Overview (Updated 2025-10-30)

### Project Type

- Next.js 16 App Router
- Full Static Generation (`output: "export"`)
- TypeScript strict mode
- Typed routes enabled
- MDX-based blog system with AST-based parsing

### New Directory Structure (Post-Refactoring)

```
src/
  site/              # Site configuration (renamed from config/)
    index.ts         # Central export
    constants.ts     # Constants (TIMEZONE, LOCALE, etc.)
    site.ts          # Site metadata (siteConfig)
    tags.ts          # Tag definitions (TAG_DEFINITIONS)

  posts/             # Core post management layer (NEW - replaces lib/post/)
    types.ts         # Post/Tag/Frontmatter types
    files/           # File system operations
      scan.ts        # MDX file scanning
      load.ts        # Raw file loading
      index.ts       # PostIndex singleton
    parse/           # MDX parsing & validation
      extract.ts     # AST-based excerpt/image extraction
      images.ts      # Image size detection (WebP/JPEG/PNG)
      compile.ts     # MDX compilation with frontmatter validation
    meta/            # Metadata generation (replaces metadata/)
      base.ts        # Base metadata
      schema.ts      # JSON-LD schemas
      generate.ts    # Page metadata generators
      index.ts       # MetaInfo compatibility layer
    api.ts           # Public API layer

  utils/             # Utilities (NEW)
    logger.ts        # Logger with LogLevel control
    debug.ts         # Debug utilities
    performance.ts   # PerformanceTracker

  errors/            # Error handling (ENHANCED)
    base.ts          # AppError base class
    file-errors.ts   # File operation errors
    post-errors.ts   # Post-specific errors + PostErrorCode enum

  lib/               # Other business logic
    cache/           # Generic caching (CacheManager)
    tag/             # Tag utilities (depends on posts/)

  app/               # Next.js app routes
  components/        # React components

metagen/             # Pre-build scripts (RSS, Sitemap)
posts/YYYY/          # MDX article files (YYYYMMDD.mdx)
validation/             # Maintenance scripts
  post.test.ts  # Post validation script (NEW)
```

**Major Architecture Changes (Phase 0-4 Complete)**:

1. **src/config/ → src/site/**
   - Renamed for clarity (site-level configuration)

2. **src/types/ → src/posts/types.ts**
   - Unified post/tag types in single file
   - Co-located with post logic

3. **src/lib/post/ → src/posts/**
   - Complete rewrite with layered architecture:
     - `files/`: File system operations (scan, load, index)
     - `parse/`: MDX parsing (extract, images, compile)
     - `api.ts`: Public API surface
   - PostIndex singleton pattern for O(1) lookups
   - AST-based extraction using unified + remark-parse

4. **src/metadata/ → src/posts/meta/**
   - Simplified metadata generation
   - MetaInfo compatibility layer for gradual migration

5. **New Infrastructure**:
   - Logger with LOG_LEVEL environment variable
   - PerformanceTracker for debugging
   - PostErrorCode enum for structured error handling
   - Frontmatter validation with detailed error messages

## Configuration System (src/site/)

### site.ts

- `siteConfig` constant with `as const`
- Properties:
  - `name`: string (site title)
  - `description`: string
  - `url`: string (base URL)
  - `author`: object (name, email)
  - `social`: object (twitter, etc.)

### tags.ts

- `TAG_DEFINITIONS`: Mapping of Japanese tag names to slugs
  ```typescript
  {
    "購入": "purchase",
    "試聴": "try",
    // ...
  }
  ```
- Exports: `TagName`, `TagSlug`, `TagDefinitions` types

### constants.ts

- `TIMEZONE`: "Asia/Tokyo"
- `LOCALE`: "ja-JP"
- `IMAGE_CONSTANTS`: Default OG image sizes (width: 1200, height: 630)

## Post Management Layer (src/posts/)

### Data Flow Architecture

```
┌─────────────┐
│   app/      │  (Next.js pages)
│   routes    │
└──────┬──────┘
       │ imports
       ▼
┌─────────────────────────────────────┐
│  posts/api.ts (Public API)          │
│  - getPostByDate()                  │
│  - getAllPosts()                    │
│  - getPostsByTag()                  │
│  - getRelatedPosts()                │
│  - getTagStats()                    │
│  - CacheManager integration         │
└──────┬──────────────────────────────┘
       │ uses
       ▼
┌─────────────────────────────────────┐
│  posts/files/ (File System)         │
│  - scan.ts: scanMdxFiles()          │
│  - load.ts: loadPost()              │
│  - index.ts: PostIndex singleton    │
└──────┬──────────────────────────────┘
       │ provides raw data to
       ▼
┌─────────────────────────────────────┐
│  posts/parse/ (Parsing)             │
│  - compile.ts: compileMdx()         │
│  - extract.ts: extractExcerpt()     │
│  - images.ts: detectImageSize()     │
│  - Frontmatter validation           │
└─────────────────────────────────────┘
```

### posts/types.ts

**Core Types**:

- `Tag`: { name: TagName, slug: TagSlug }
- `Postdate`: DateTime<true> (JST-fixed Luxon DateTime)
- `PostFrontmatter`: { date, title, tags }
- `Post`: { frontmatter, excerpt, ogImage, rawContent, Content }
- `TagStats`: { tag, count }

### posts/files/

**scan.ts**:

- `scanMdxFiles(): Promise<string[]>` - Recursively scans posts/ directory for .mdx files

**load.ts**:

- `loadPost(filePath): Promise<{ frontmatter, rawContent }>` - Loads raw MDX file
- `loadFrontmatterOnly(filePath)` - Loads only frontmatter (for indexing)
- `extractDateFromPath(filePath): Postdate` - Parses YYYYMMDD from filename

**index.ts (PostIndex Singleton)**:

- `getPostIndex(): PostIndex` - Returns singleton instance
- `clearPostIndex()` - Clears cache (for testing)
- PostIndex class:
  - `initialize()` - Scans all posts and builds index
  - `getAllPostdates()` - Returns all postdates
  - `getFilePath(postdate)` - O(1) lookup for file path

### posts/parse/

**compile.ts**:

- `compileMdx(rawContent, filePath): Promise<Post>` - Full MDX compilation
  - Validates frontmatter (throws InvalidFrontmatterError)
  - Compiles MDX to React component
  - Extracts excerpt and OG image
- `parseFrontmatterOnly(rawContent)` - Fast frontmatter parsing
- `validateAndParseFrontmatter(frontmatter, filePath)` - Strict validation

**extract.ts (AST-based)**:

- `extractExcerpt(rawContent): string` - Extracts first 100 characters from text nodes
- `extractFirstImage(rawContent): string | null` - Finds first image URL in AST

**images.ts**:

- `detectImageSize(imagePath): { width, height }` - Detects WebP/JPEG/PNG sizes

### posts/api.ts (Public API)

**Post Queries**:

- `getPostByDate(postdate): Promise<Post>` - Get single post (cached)
- `getAllPosts(): Promise<Post[]>` - Get all posts, sorted by date desc
- `getAllPostDates(): Promise<Postdate[]>` - Get all postdates for static generation
- `getPostsByTag(tagName): Promise<Post[]>` - Filter posts by tag

**Relationships**:

- `getRelatedPosts(post, limit): Promise<Post[]>` - Find posts with overlapping tags
- `getNeighbourPosts(postdate): Promise<{ prev, next }>` - Get chronological neighbors

**Tag Queries**:

- `getTagStats(): Promise<TagStats[]>` - Get all tags with post counts

**Cache Management**:

- Uses `CacheManager<Postdate, Post>` for compiled posts
- Uses `CacheManager<Postdate, PostCacheError>` for error caching
- `clearCache()` - Manual cache invalidation

### posts/meta/ (Metadata Generation)

**base.ts**:

- `baseMetadata: Metadata` - Default Next.js metadata for all pages

**schema.ts (JSON-LD)**:

- `generateBlogPostingSchema(post)` - Article structured data
- `generateWebsiteSchema()` - Website structured data
- `generateCollectionPageSchema(title, description, url)` - Collection pages

**generate.ts**:

- `generatePostMetadata(post, canonical?)` - Post page metadata
- `generateArchiveMetadata(title, path, description)` - Archive pages
- `generateTagMetadata(tagName, slug)` - Tag pages
- `generateStaticMetadata(title, path, description)` - Static pages

**index.ts (MetaInfo Compatibility)**:

- Exports `MetaInfo` object for backward compatibility:
  ```typescript
  MetaInfo.baseMetadata
  MetaInfo.siteConfig
  MetaInfo.schemaOrg.website()
  MetaInfo.schemaOrg.blogPosting(post)
  MetaInfo.schemaOrg.collectionPage(...)
  MetaInfo.generateMetadata.post(post, canonical)
  MetaInfo.generateMetadata.archive(...)
  MetaInfo.generateMetadata.tag(...)
  MetaInfo.generateMetadata.static(...)
  ```

## Dependency Rules

**Strict Layer Hierarchy** (no circular dependencies):

```
app/ ─────→ posts/api.ts ─────→ posts/files/
                │                posts/parse/
                │                posts/meta/
                │
                └────→ site/ (config)
                       utils/ (logger, etc.)
                       errors/
```

**Import Rules**:

1. `app/` can only import from `posts/api.ts` (never direct from files/parse/meta/)
2. `posts/api.ts` orchestrates files/, parse/, meta/
3. `posts/files/`, `posts/parse/`, `posts/meta/` are independent layers
4. All layers can import from `site/`, `utils/`, `errors/`
5. `lib/tag/` depends on `posts/api.ts` (NOT vice versa)

## Error Handling (src/errors/)

### PostErrorCode Enum

```typescript
enum PostErrorCode {
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
  LOAD_ERROR = "LOAD_ERROR",
  COMPILE_ERROR = "COMPILE_ERROR",
  INVALID_FRONTMATTER = "INVALID_FRONTMATTER",
  MISSING_FRONTMATTER_FIELD = "MISSING_FRONTMATTER_FIELD",
  INVALID_TAG = "INVALID_TAG",
}
```

### Error Classes

- `PostNotFoundError` - Post file not found (404-like)
- `PostLoadError` - File system read error
- `PostCompileError` - MDX compilation failure
- `InvalidFrontmatterError` - Frontmatter schema validation failure
- `MissingFrontmatterFieldError` - Required field missing (title, date, tags)
- `InvalidTagError` - Unknown tag in frontmatter

### Error Caching

- Errors are cached in `CacheManager<Postdate, PostCacheError>`
- TTL: 30 seconds (prevents repeated disk access for missing files)
- `PostCacheError` contains: `errorCode`, `message`, `timestamp`

## Logging & Debugging (src/utils/)

### Logger (logger.ts)

**LogLevel Control**:

```bash
LOG_LEVEL=DEBUG pnpm dev    # Show all logs
LOG_LEVEL=INFO pnpm build   # Show info and above (default)
LOG_LEVEL=WARN pnpm build   # Show warnings and errors only
LOG_LEVEL=ERROR pnpm build  # Show errors only
```

**Levels**: DEBUG < INFO < WARN < ERROR

**Usage**:

```typescript
import { createLogger } from "../utils/logger";
const logger = createLogger("posts/api");

logger.debug("Loading post", { postdate });
logger.info("Post compiled successfully");
logger.warn("Image not found", { path });
logger.error("Compilation failed", new Error("..."));
```

### PerformanceTracker (performance.ts)

```typescript
import { PerformanceTracker } from "../utils/performance";

const perf = new PerformanceTracker();
perf.start("compile");
// ... work ...
const duration = perf.end("compile");
const all = perf.getAll(); // Get all measurements
perf.reset(); // Clear all measurements
```

## Validation & Maintenance (scripts/)

### validate-posts.ts

**Run**: `pnpm validate`

**Checks**:

1. Frontmatter validation (title, date, tags present)
2. Tag validation (all tags exist in TAG_DEFINITIONS)
3. OG image existence (if specified)
4. Excerpt generation (warns if empty)
5. Compilation success (catches MDX errors)

**Output**:

- ✅ Success: Exit code 0
- ❌ Failure: Exit code 1, grouped errors by type

## Package.json Scripts

```bash
pnpm dev          # Next.js dev server with Turbopack
pnpm build        # Static export to /out
pnpm test         # Vitest unit tests
pnpm type-check   # TypeScript validation
pnpm lint         # ESLint with auto-fix
pnpm validate     # Run post validation script (NEW)
pnpm clean        # Remove build artifacts
pnpm rebuild      # clean + install + build (NEW)
pnpm analyze      # Bundle analysis
```

## Operational Workflows

### Adding a New Post

1. Create `posts/YYYY/YYYYMMDD.mdx`
2. Add frontmatter:
   ```yaml
   ---
   title: "記事タイトル"
   date: YYYY-MM-DD
   tags:
     - 購入
     - ヘッドホン
   ---
   ```
3. Run `pnpm validate` to check
4. Run `pnpm dev` to preview
5. Build with `pnpm build`

### Debugging Build Issues

1. **Enable DEBUG logs**: `LOG_LEVEL=DEBUG pnpm build`
2. **Check specific post**: Logs show postdate on errors
3. **Validate all posts**: `pnpm validate`
4. **Type check**: `pnpm type-check`
5. **Clear cache**: `pnpm clean && pnpm build`

### Performance Optimization

- **PostIndex singleton**: O(1) file path lookups
- **CacheManager**: Compiled posts cached in memory
- **Error caching**: Failed loads cached to prevent retries
- **AST-based extraction**: Single-pass parsing for excerpt + images
- **Static generation**: All routes pre-rendered at build time

## Testing Strategy

### Unit Tests (specs/)

- **File**: `specs/**/*.test.ts`
- **Runner**: Vitest
- **Focus**:
  - Frontmatter validation logic
  - Tag utilities
  - Error handling
  - Cache management

### Integration Testing

- **Method**: `pnpm build` - Full static generation
- **Validates**:
  - All routes generate successfully
  - All posts compile without errors
  - Metadata generates correctly
  - No circular dependencies

## Migration Notes

### Old → New Import Paths

```typescript
// OLD (deleted)
import { getPostByDate } from "../lib/post/queries";
import { Post } from "../types/post";
import { MetaInfo } from "../MetaInfo";

// NEW
import { getPostByDate } from "../posts/api";
import type { Post } from "../posts/types";
import { MetaInfo } from "../posts/meta";
```

### MetaInfo Compatibility Layer

The `MetaInfo` object in `posts/meta/index.ts` provides backward compatibility.
Gradual migration to direct imports is recommended:

```typescript
// Compatibility (current)
import { MetaInfo } from "../posts/meta";
MetaInfo.generateMetadata.post(post);

// Direct (recommended)
import { generatePostMetadata } from "../posts/meta";
generatePostMetadata(post);
```

## Known Constraints

1. **Postdate format**: Must be YYYYMMDD (8 digits)
2. **File location**: `posts/YYYY/YYYYMMDD.mdx` strictly enforced
3. **Tags**: Must be defined in `site/tags.ts` TAG_DEFINITIONS
4. **Timezone**: All dates are JST (Asia/Tokyo)
5. **Static export**: No server-side runtime available

## Future Improvements

- [ ] Incremental Static Regeneration (requires non-static deployment)
- [ ] Full-text search indexing
- [ ] Related posts algorithm enhancement (TF-IDF scoring)
- [ ] Image optimization with next/image (requires image server)
- [ ] Draft posts support (frontmatter `draft: true`)

---

**Last Updated**: 2025-10-30 (Post-Refactoring Phase 0-5 Complete)

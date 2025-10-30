import { AppError } from "./base";
import type { Postdate } from "../posts/types";

/**
 * MDXコンパイルエラー
 */
export class MdxCompileError extends AppError {
  readonly code = "MDX_COMPILE_ERROR" as const;

  constructor(filePath?: string, cause?: Error) {
    super(
      "Failed to compile MDX content",
      filePath ? { filePath } : undefined,
      cause,
    );
  }
}

/**
 * Frontmatterパースエラー
 */
export class FrontmatterParseError extends AppError {
  readonly code = "FRONTMATTER_PARSE_ERROR" as const;

  constructor(fieldName: string, expectedType: string, actualValue?: unknown) {
    super(
      `Invalid frontmatter field: ${fieldName} (expected ${expectedType})`,
      { fieldName, expectedType, actualValue },
    );
  }
}

/**
 * 記事読み込みエラー
 */
export class PostLoadError extends AppError {
  readonly code = "POST_LOAD_ERROR" as const;

  constructor(postdate: string | Postdate, cause?: Error) {
    const dateStr =
      typeof postdate === "string" ? postdate : postdate.toFormat("yyyyMMdd");

    super(`Failed to load post: ${dateStr}`, { postdate: dateStr }, cause);
  }
}

/**
 * 日付パースエラー
 */
export class DateParseError extends AppError {
  readonly code = "DATE_PARSE_ERROR" as const;

  constructor(dateString: string, format: string) {
    super(`Invalid date format: ${dateString} (expected ${format})`, {
      dateString,
      format,
    });
  }
}

/**
 * タグ未定義エラー
 */
export class TagNotFoundError extends AppError {
  readonly code = "TAG_NOT_FOUND" as const;

  constructor(tagIdentifier: string, searchType: "name" | "slug") {
    super(`Tag not found: ${tagIdentifier} (by ${searchType})`, {
      tagIdentifier,
      searchType,
    });
  }
}

/**
 * 記事未発見エラー
 */
export class PostNotFoundError extends AppError {
  readonly code = "POST_NOT_FOUND" as const;

  constructor(date: string) {
    super(`Post not found: ${date}`, { date });
  }
}

/**
 * 記事コンパイルエラー
 */
export class PostCompileError extends AppError {
  readonly code = "POST_COMPILE_ERROR" as const;

  constructor(date: string, cause?: Error) {
    super(`Failed to compile post: ${date}`, { date }, cause);
  }
}

/**
 * Frontmatter必須フィールド欠落エラー
 */
export class MissingFrontmatterFieldError extends AppError {
  readonly code = "MISSING_FRONTMATTER_FIELD" as const;

  constructor(
    public readonly date: string,
    public readonly field: string,
  ) {
    super(`Missing required frontmatter field in ${date}: ${field}`, {
      date,
      field,
    });
  }
}

/**
 * Frontmatter型不正エラー
 */
export class InvalidFrontmatterError extends AppError {
  readonly code = "INVALID_FRONTMATTER_TYPE" as const;

  constructor(
    public readonly date: string,
    public readonly field: string,
    public readonly value: unknown,
    message: string,
  ) {
    super(
      `Invalid frontmatter in ${date}: ${field} = ${JSON.stringify(value)}: ${message}`,
      { date, field, value },
    );
  }
}

/**
 * 無効なタグエラー
 */
export class InvalidTagError extends AppError {
  readonly code = "INVALID_TAG" as const;

  constructor(
    public readonly date: string,
    public readonly invalidTag: string,
    public readonly validTags: string[],
  ) {
    const suggestion = `Valid tags are: ${validTags.join(", ")}`;
    super(`Invalid tag in ${date}: "${invalidTag}"\n${suggestion}`, {
      date,
      invalidTag,
      validTags,
    });
  }
}

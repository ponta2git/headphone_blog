import { evaluateSync } from "@mdx-js/mdx";
import React from "react";
import runtime from "react/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { DateTime } from "luxon";
import matter from "gray-matter";
import {
  CONTENT_CONSTANTS,
  TAG_DEFINITIONS,
  TIMEZONE,
  LOCALE,
} from "../../site";
import {
  PostCompileError,
  MissingFrontmatterFieldError,
  InvalidFrontmatterError,
  InvalidTagError,
} from "../../errors/post-errors";
import { createLogger } from "../../utils/logger";
import { extractExcerpt, extractFirstImage } from "./extract";
import type { Post, PostFrontmatter, Tag, Postdate } from "../types";
import type { TagName } from "../../site/tags";

const logger = createLogger("posts/parse/compile");

/**
 * MDX文字列をコンパイルしてPost型に変換
 *
 * @param content - MDX文字列
 * @param date - 記事日付（エラーメッセージ用）
 * @returns Post型オブジェクト
 * @throws {PostCompileError} コンパイル失敗時
 */
export function compileMdx(content: string, date: Postdate): Post {
  const dateStr = date.toFormat("yyyyMMdd");
  logger.debug(`Compiling MDX: ${dateStr}`);

  const startTime = Date.now();

  try {
    // MDXをコンパイル
    const mdxModule = evaluateSync(content, {
      jsx: runtime.jsx as Parameters<typeof evaluateSync>[1]["jsx"],
      jsxs: runtime.jsxs as Parameters<typeof evaluateSync>[1]["jsxs"],
      Fragment: React.Fragment,
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        remarkImages,
      ],
    });

    // Frontmatterをパース・検証
    const frontmatter = validateAndParseFrontmatter(
      mdxModule.frontmatter,
      dateStr,
    );

    // 抜粋を抽出（AST-based）
    const excerpt = extractExcerpt(content, CONTENT_CONSTANTS.EXCERPT_LENGTH);

    // OG画像を抽出（AST-based）
    const ogImage = extractFirstImage(content);

    const duration = Date.now() - startTime;
    logger.debug(`Compiled MDX: ${dateStr}`, {
      duration,
      hasOgImage: !!ogImage,
    });

    return {
      frontmatter,
      excerpt,
      body: mdxModule.default,
      rawContent: content,
      ogImage: ogImage ?? undefined,
    };
  } catch (error) {
    logger.error(`Failed to compile MDX: ${dateStr}`, error as Error);

    // 既にPostCompileError系の場合はそのまま再スロー
    if (
      error instanceof PostCompileError ||
      error instanceof MissingFrontmatterFieldError ||
      error instanceof InvalidFrontmatterError ||
      error instanceof InvalidTagError
    ) {
      throw error;
    }

    throw new PostCompileError(dateStr, error as Error);
  }
}

/**
 * Frontmatterのみをパース（高速版）
 *
 * @param content - MDX文字列
 * @param date - 記事日付（エラーメッセージ用）
 * @returns PostFrontmatter
 */
export function parseFrontmatterOnly(
  mdxSource: string,
  date: Postdate,
): PostFrontmatter {
  const dateStr = date.toFormat("yyyyMMdd");
  logger.debug(`Parsing frontmatter only: ${dateStr}`);

  try {
    const { data } = matter(mdxSource);
    return validateAndParseFrontmatter(data, dateStr);
  } catch (error) {
    logger.error(`Failed to parse frontmatter: ${dateStr}`, error as Error);
    throw error;
  }
}

/**
 * Frontmatterをバリデーション・パース
 *
 * @param raw - 生のFrontmatterオブジェクト
 * @param dateStr - 記事日付文字列（エラーメッセージ用）
 * @returns PostFrontmatter
 * @throws {MissingFrontmatterFieldError} 必須フィールド欠落時
 * @throws {InvalidFrontmatterError} 型不正時
 */
function validateAndParseFrontmatter(
  raw: unknown,
  dateStr: string,
): PostFrontmatter {
  // オブジェクトチェック
  if (!raw || typeof raw !== "object") {
    throw new InvalidFrontmatterError(
      dateStr,
      "frontmatter",
      raw,
      "Not an object",
    );
  }

  const fm = raw as Record<string, unknown>;

  // titleチェック
  if (!fm.title) {
    throw new MissingFrontmatterFieldError(dateStr, "title");
  }
  if (typeof fm.title !== "string") {
    throw new InvalidFrontmatterError(
      dateStr,
      "title",
      fm.title,
      "Must be a string",
    );
  }

  // dateチェック
  if (!fm.date) {
    throw new MissingFrontmatterFieldError(dateStr, "date");
  }
  if (typeof fm.date !== "string") {
    throw new InvalidFrontmatterError(
      dateStr,
      "date",
      fm.date,
      "Must be a string",
    );
  }

  // tagsチェック
  if (!fm.tags) {
    throw new MissingFrontmatterFieldError(dateStr, "tags");
  }
  if (!Array.isArray(fm.tags)) {
    throw new InvalidFrontmatterError(
      dateStr,
      "tags",
      fm.tags,
      "Must be an array",
    );
  }

  return {
    title: fm.title,
    date: parsePostdate(fm.date, dateStr),
    tags: fm.tags.map((tag) => parseTag(tag, dateStr)),
  };
}

/**
 * 日付文字列をPostdate型にパース
 */
function parsePostdate(dateStr: string, postDateStr: string): Postdate {
  const result = DateTime.fromFormat(dateStr, "yyyy-MM-dd", {
    zone: TIMEZONE,
    locale: LOCALE,
  });

  if (!result.isValid) {
    throw new InvalidFrontmatterError(
      postDateStr,
      "date",
      dateStr,
      `Invalid date format (expected yyyy-MM-dd)`,
    );
  }

  return result;
}

/**
 * タグ文字列をTag型にパース
 */
function parseTag(raw: unknown, dateStr: string): Tag {
  if (typeof raw !== "string") {
    throw new InvalidFrontmatterError(dateStr, "tag", raw, "Must be a string");
  }

  const slug = TAG_DEFINITIONS[raw as keyof typeof TAG_DEFINITIONS];
  if (!slug) {
    const validTags = Object.keys(TAG_DEFINITIONS);
    throw new InvalidTagError(dateStr, raw, validTags);
  }

  return {
    name: raw as TagName,
    slug,
  };
}

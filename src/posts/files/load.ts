import fs from "node:fs/promises";
import path from "node:path";
import { DateTime } from "luxon";
import { siteConfig, TIMEZONE, LOCALE } from "../../site";
import { DateParseError } from "../../errors";
import { PostNotFoundError, PostLoadError } from "../../errors/post-errors";
import { createLogger } from "../../utils/logger";
import type { Postdate } from "../types";

const logger = createLogger("posts/files/load");

/**
 * 記事ファイルを読み込んで生のMDX文字列を返す
 *
 * @param date - 記事日付
 * @returns MDX文字列
 * @throws {PostNotFoundError} ファイルが存在しない場合
 * @throws {PostLoadError} 読み込みエラー
 */
export async function loadPost(date: Postdate): Promise<string> {
  const dateStr = date.toFormat("yyyyMMdd");
  const filePath = getPostPath(date);

  logger.debug(`Loading post: ${dateStr}`, { filePath });

  try {
    const content = await fs.readFile(filePath, "utf-8");
    logger.debug(`Loaded post: ${dateStr}`, { size: content.length });
    return content;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    if (err.code === "ENOENT") {
      logger.error(`Post not found: ${dateStr}`, err, { filePath });
      throw new PostNotFoundError(dateStr);
    }

    logger.error(`Failed to load post: ${dateStr}`, err, { filePath });
    throw new PostLoadError(dateStr, err);
  }
}

/**
 * Frontmatterのみを読み込む（高速版）
 *
 * @param date - 記事日付
 * @returns MDX文字列（Frontmatter含む）
 * @throws {PostNotFoundError} ファイルが存在しない場合
 * @throws {PostLoadError} 読み込みエラー
 */
export async function loadFrontmatterOnly(date: Postdate): Promise<string> {
  // 現状は全文読み込み（最適化は後で検討）
  return loadPost(date);
}

/**
 * 記事ファイルパスを構築
 *
 * @param date - 記事日付
 * @returns ファイルパス (posts/YYYY/YYYYMMDD.mdx)
 */
function getPostPath(date: Postdate): string {
  const year = date.year;
  const filename = date.toFormat("yyyyMMdd");
  return path.join(siteConfig.paths.posts, String(year), `${filename}.mdx`);
}

/**
 * ファイルパスから記事日付を抽出
 *
 * @param filepath - ファイルパス
 * @returns 記事日付
 * @throws {DateParseError} 日付パース失敗時
 */
export function extractDateFromPath(filepath: string): Postdate {
  const basename = path.basename(filepath, ".mdx");

  logger.debug(`Extracting date from path: ${filepath}`, { basename });

  const result = DateTime.fromFormat(basename, "yyyyMMdd", {
    zone: TIMEZONE,
    locale: LOCALE,
  });

  if (!result.isValid) {
    logger.error(`Invalid date format: ${basename}`);
    throw new DateParseError(basename, "yyyyMMdd");
  }

  return result;
}

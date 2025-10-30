import { readdir } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "../../site";
import { DirectoryScanError } from "../../errors";
import { createLogger } from "../../utils/logger";

const logger = createLogger("posts/files/scan");

/**
 * MDXファイルをスキャンしてファイルパスのリストを返す
 *
 * @returns MDXファイルパスの配列
 * @throws {DirectoryScanError} ディレクトリスキャン失敗時
 */
export async function scanMdxFiles(): Promise<string[]> {
  logger.debug(`Scanning MDX files in: ${siteConfig.paths.posts}`);

  try {
    const dirents = await readdir(siteConfig.paths.posts, {
      recursive: true,
      withFileTypes: true,
    });

    const mdxFiles = dirents
      .filter((d) => d.isFile() && d.name.endsWith(".mdx"))
      .map((d) => path.join(d.path, d.name));

    logger.info(`Found ${mdxFiles.length} MDX files`);

    return mdxFiles;
  } catch (error) {
    logger.error(
      `Failed to scan directory: ${siteConfig.paths.posts}`,
      error as Error,
    );
    throw new DirectoryScanError(siteConfig.paths.posts, error as Error);
  }
}

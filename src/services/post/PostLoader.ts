import { readFile } from "node:fs/promises";
import path from "node:path";

import { evaluateMdxContent } from "./PostUtils";
import { MetaInfo } from "../../MetaInfo";
import { createFileLoadError } from "../errors/ErrorFactory";

import type { Post } from "./PostTypes"; // ※後述
import type { Postdate } from "../date/PostdateService";

/**
 * 指定の日付フォルダから .mdx ファイルを読み込み、Postオブジェクトとして返す
 */
export async function loadPost(date: Postdate): Promise<Post> {
  const postsPath = path.resolve(MetaInfo.siteInfo.postsPath);

  const filePath = path.join(
    postsPath,
    date.toFormat("yyyy"),
    `${date.toFormat("yyyyMMdd")}.mdx`,
  );

  let fileBuffer: Buffer;
  try {
    fileBuffer = await readFile(filePath);
  } catch (error) {
    throw createFileLoadError(filePath, error);
  }

  return evaluateMdxContent(fileBuffer);
}

import { readFileSync } from "node:fs";
import path from "node:path";

import { evaluateMdxContent } from "./PostUtils";
import { MetaInfo } from "../../MetaInfo";
import { createFileLoadError } from "../errors/ErrorFactory";

import type { Post } from "./PostTypes"; // ※後述
import type { Postdate } from "../date/PostdateService";

// フォルダパスを取得
const postsPath = path.resolve(
  import.meta.dirname,
  "../../",
  MetaInfo.siteInfo.postsPath,
);

/**
 * 指定の日付フォルダから .mdx ファイルを読み込み、Postオブジェクトとして返す
 */
export function loadPost(date: Postdate): Post {
  const filePath = path.join(
    postsPath,
    date.toFormat("yyyy"),
    `${date.toFormat("yyyyMMdd")}.mdx`,
  );

  let fileBuffer: Buffer;
  try {
    fileBuffer = readFileSync(filePath);
  } catch (error) {
    throw createFileLoadError(filePath, error);
  }

  return evaluateMdxContent(fileBuffer);
}

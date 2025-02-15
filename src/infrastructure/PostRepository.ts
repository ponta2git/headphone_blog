import { readFile } from "fs/promises";
import { join } from "path";


import { FileLoadError } from "../Errors";
import { postDir } from "../siteBasic";

import type { Post } from "../domain/Post";
import type { DateTime } from "luxon";

export async function findPostByDate(
  date: DateTime,
  metagen?: boolean,
): Promise<Post> {
  const filePath = `${join(
    metagen ? `../${postDir}` : postDir,
    date.toFormat("yyyy"),
    date.toFormat("yyyyMMdd"),
  )}.mdx`;

  try {
    return await readFile(filePath);
  } catch (e) {
    throw FileLoadError(filePath, e);
  }
}

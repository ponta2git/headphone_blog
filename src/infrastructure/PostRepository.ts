import { readFile } from "fs/promises"
import { join } from "path"

import { DateTime } from "luxon"

import { FileLoadError } from "../Errors"
import { postDir } from "../siteBasic"

export async function findPostByDate(date: DateTime, metagen?: boolean) {
  const filePath =
    join(
      metagen ? `../${postDir}` : postDir,
      date.toFormat("yyyy"),
      date.toFormat("yyyyMMdd"),
    ) + ".mdx"

  try {
    return await readFile(filePath)
  } catch (e) {
    throw FileLoadError(filePath, e)
  }
}

import { Dirent } from "fs"
import { readdir } from "fs/promises"
import { basename } from "path"

import { DateTime } from "luxon"

import { FileListCreateError } from "../Errors"
import { IgnoreFiles } from "../siteBasic"
import { postDir } from "../siteBasic"

export async function getAllPostDates(metagen?: boolean): Promise<DateTime[]> {
  let dirents: Dirent[]
  try {
    dirents = await readdir(metagen ? `../${postDir}` : postDir, {
      recursive: true,
      withFileTypes: true,
    })
  } catch (e) {
    throw FileListCreateError(e)
  }

  return dirents
    .filter((dirent) => dirent.isFile() && !IgnoreFiles.includes(dirent.name))
    .map((dirent) =>
      DateTime.fromFormat(basename(dirent.name, ".mdx"), "yyyyMMdd"),
    )
    .filter((date) => date.isValid)
    .toSorted()
}

import { Dirent } from "fs"
import { readFile, readdir } from "fs/promises"
import { join } from "path"

import { DateTime } from "luxon"

import { Post, toPost } from "../domain/Post"
import { Tag } from "../domain/Tag"
import {
  FileListCreateError,
  FileLoadError,
  isNodeJsError,
  PostComposeError,
} from "../Errors"
import { IgnoreFiles, postDir } from "../siteBasic"

export async function findPostBy(
  date: DateTime,
  metagen?: boolean,
): Promise<Post> {
  let file: Buffer
  const filePath =
    join(
      metagen ? `../${postDir}` : postDir,
      date.toFormat("yyyy"),
      date.toFormat("yyyyMMdd"),
    ) + ".mdx"

  try {
    file = await readFile(filePath)
  } catch (e) {
    throw FileLoadError(filePath, e)
  }

  try {
    return await toPost(file)
  } catch (e) {
    throw PostComposeError(filePath, e)
  }
}

export async function getPostsByTags(
  tags: Tag[],
  selfDate: DateTime<true>,
): Promise<Post[]> {
  let dirents: Dirent[]
  try {
    dirents = await readdir(postDir, {
      recursive: true,
      withFileTypes: true,
    })
  } catch (e) {
    throw FileListCreateError(e)
  }

  let files: Buffer[]
  try {
    files = await Promise.all([
      ...dirents
        .filter(
          (dirent) => dirent.isFile() && !IgnoreFiles.includes(dirent.name),
        )
        .map((dirent) => readFile(join(dirent.path, dirent.name))),
    ])
  } catch (e) {
    if (!isNodeJsError(e)) throw e

    throw FileLoadError(e.path!, e)
  }

  let posts: Post[]
  try {
    posts = await Promise.all([...files.map((file) => toPost(file))])
  } catch (e) {
    throw PostComposeError("", e) // todo: Filename
  }

  return posts
    .filter((post) =>
      tags.some((tag) =>
        post.frontmatter.tags.some((postTag) => postTag.path === tag.path),
      ),
    )
    .toSorted((a, b) =>
      a.frontmatter.date > b.frontmatter.date
        ? -1
        : a.frontmatter.date.equals(b.frontmatter.date)
          ? 0
          : 1,
    )
    .filter((post) => !post.frontmatter.date.equals(selfDate))
    .slice(0, 5)
}

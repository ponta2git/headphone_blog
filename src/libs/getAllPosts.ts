import { readdirSync } from "fs"
import { join } from "path"

export function* getAllPostsIterator(path: string): Generator<string> {
  const cur = readdirSync(path, { withFileTypes: true })

  for (const dirent of cur) {
    const res = join(path, dirent.name)
    if (dirent.isDirectory()) yield* getAllPostsIterator(res)
    else {
      if (dirent.name === ".DS_Store") continue
      yield res
    }
  }
}

export function getAllPosts(path = "posts") {
  const posts = []

  for (const post of getAllPostsIterator(path)) {
    posts.push(post)
  }

  return posts
}

import { readFileSync, readdirSync } from "fs"
import { basename, join } from "path"

import PostFactory from "../domain/PostFactory"

export default class PostRepository {
  private postPathList: string[]

  private *getAllPostPathsIterator(path: string): Generator<string> {
    const cur = readdirSync(path, { withFileTypes: true })

    for (const dirent of cur) {
      const res = join(path, dirent.name)
      if (dirent.isDirectory()) yield* this.getAllPostPathsIterator(res)
      else {
        if (dirent.name === ".DS_Store") continue
        yield res
      }
    }
  }

  private getAllPostPaths(path = "posts") {
    const posts = []

    for (const post of this.getAllPostPathsIterator(path)) {
      posts.push(post)
    }

    return posts
  }

  constructor(path = "posts") {
    this.postPathList = this.getAllPostPaths(path).sort()
  }

  public async getAllPosts() {
    return await Promise.all(
      this.postPathList.map((path) => this.getByFilePath(path)),
    )
  }

  public getAllPostDates() {
    return this.postPathList.map((path) => basename(path, ".mdx"))
  }

  public async getByDateString(date: string) {
    const postFile = readFileSync(
      join("posts", date.slice(0, 4), `${date}.mdx`),
    )
    return await PostFactory.create(postFile)
  }

  public async getByFilePath(path: string) {
    const postFile = readFileSync(path)
    return await PostFactory.create(postFile)
  }

  public async getPreviousPostOf(date: string) {
    const shownIdx = this.postPathList.findIndex(
      (path) => basename(path, ".mdx") === date,
    )
    if (shownIdx === -1 || shownIdx === 0) return undefined

    return await this.getByFilePath(this.postPathList[shownIdx - 1])
  }

  public async getNextPostOf(date: string) {
    const shownIdx = this.postPathList.findIndex(
      (path) => basename(path, ".mdx") === date,
    )

    if (shownIdx === -1 || shownIdx + 1 >= this.postPathList.length)
      return undefined

    return await this.getByFilePath(this.postPathList[shownIdx + 1])
  }
}

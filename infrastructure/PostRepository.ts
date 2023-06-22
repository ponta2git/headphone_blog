import { readFile } from "node:fs/promises"
import { basename, join } from "path"
import PostFactory from "../domain/PostFactory"
import { getAllPosts } from "../libs/getAllPosts"

export default class PostRepository {
  private _postPathList: string[] = getAllPosts().sort()

  get paths() {
    return this._postPathList
  }

  public async getByDateString(date: string) {
    const postFile = await readFile(
      join("posts", date.slice(0, 4), `${date}.mdx`),
    )
    return await PostFactory.build(postFile)
  }

  public async getByFilePath(path: string) {
    const postFile = await readFile(path)
    return await PostFactory.build(postFile)
  }

  public async getPreviousPostOf(date: string) {
    const shownIdx = this._postPathList.findIndex(
      (path) => basename(path, ".mdx") === date,
    )
    if (shownIdx - 1 < 0) return null

    return await this.getByFilePath(this.paths[shownIdx - 1])
  }

  public async getNextPostOf(date: string) {
    const shownIdx = this._postPathList.findIndex(
      (path) => basename(path, ".mdx") === date,
    )
    if (shownIdx + 1 < this._postPathList.length) return null

    return await this.getByFilePath(this.paths[shownIdx + 1])
  }
}

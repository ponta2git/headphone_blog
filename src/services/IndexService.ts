import PostRepository from "../infrastructure/PostRepository"

export default class IndexService {
  private _postRepo = new PostRepository()

  public async getData() {
    const postPaths = [...this._postRepo.paths].reverse()

    return await Promise.all(
      postPaths.map(async (path) => await this._postRepo.getByFilePath(path)),
    )
  }
}

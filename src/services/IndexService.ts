import PostRepository from "../infrastructure/PostRepository"

export default class IndexService {
  private postRepo = new PostRepository()

  public async getData() {
    const posts = await this.postRepo.getAllPosts()
    return posts.reverse()
  }
}

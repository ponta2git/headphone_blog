import { basename } from "path"
import PostRepository from "../infrastructure/PostRepository"

export default class PostPageService {
  private _postRepo = new PostRepository()

  public async buildMetadataSource(postdate: string) {
    const { frontmatter, excerpt: description } =
      await this._postRepo.getByDateString(postdate)

    return { frontmatter, description }
  }

  public getRouteParams() {
    return this._postRepo.paths.map((path) => ({
      postdate: basename(path, ".mdx"),
    }))
  }

  public async getData(postdate: string) {
    async function getNeighbourPostsMetadata(
      repo: PostRepository,
      shown: string,
    ) {
      const prevPost = await repo.getPreviousPostOf(shown)
      const nextPost = await repo.getNextPostOf(shown)

      return {
        prev: prevPost?.frontmatter,
        next: nextPost?.frontmatter,
      }
    }

    const { frontmatter, content } = await this._postRepo.getByDateString(
      postdate,
    )
    const { prev, next } = await getNeighbourPostsMetadata(
      this._postRepo,
      postdate,
    )

    return {
      post: {
        frontmatter,
        content,
      },
      prev,
      next,
    }
  }
}

import { PostRouteParams } from "../../app/posts/[postdate]/page"
import { Post, PostFrontmatter } from "../domain/Post"
import PostRepository from "../infrastructure/PostRepository"

export type PostPageData = {
  post: Post
  prev?: PostFrontmatter
  next?: PostFrontmatter
}

export default class PostPageService {
  private postRepo = new PostRepository()

  public async buildMetadataSource(postdate: string) {
    const { frontmatter, excerpt: description } =
      await this.postRepo.getByDateString(postdate)

    return { frontmatter, description }
  }

  public getRouteParams(): PostRouteParams[] {
    return this.postRepo.getAllPostDates().map((postdate) => ({
      postdate,
    }))
  }

  public async getData(postdate: string): Promise<PostPageData> {
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

    const post = await this.postRepo.getByDateString(postdate)
    const { prev, next } = await getNeighbourPostsMetadata(
      this.postRepo,
      postdate,
    )

    return {
      post,
      prev,
      next,
    }
  }
}

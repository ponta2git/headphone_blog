import { Post } from "../domain/Post"
import TagFactory from "../domain/TagFactory"
import PostRepository from "../infrastructure/PostRepository"

export type TagPageData = {
  posts: Post[]
}

export default class TagPageService {
  private allPosts: Post[] = []
  private postRepo = new PostRepository()

  // async constructorがないのでやむを得ず
  static async create() {
    const service = new TagPageService()
    service.allPosts = (await service.postRepo.getAllPosts()).reverse()

    return service
  }

  private constructor() {}

  public buildMetadataSource(tagalias: string) {
    return TagFactory.createFromAlias(tagalias)
  }

  public getRouteParams() {
    return TagFactory.createAllTags().map((tag) => ({ tagalias: tag.alias }))
  }

  public getData(tagAlias: string) {
    const tag = TagFactory.createFromAlias(tagAlias)

    return this.allPosts.flatMap((post) =>
      post.frontmatter.tags.find((posttag) => tag.title === posttag.title)
        ? [post]
        : [],
    )
  }
}

import { Post } from "../domain/Post"
import { Tag } from "../domain/Tag"
import TagFactory from "../domain/TagFactory"
import PostRepository from "../infrastructure/PostRepository"

type TagStats = {
  tag: Tag
  count: number
}

export type TagIndexPageData = {
  tagStats: TagStats[]
}

export default class TagIndexPageService {
  private allPosts: Post[] = []
  private postRepo = new PostRepository()

  // async constructorがないのでやむを得ず
  static async create() {
    const service = new TagIndexPageService()
    service.allPosts = await service.postRepo.getAllPosts()

    return service
  }

  private constructor() {}

  public getData(): TagIndexPageData {
    const tagList = TagFactory.createAllTags()

    const tagStats = tagList.map<TagStats>((tag) => ({
      tag,
      count: this.allPosts.reduce(
        (acc, post) =>
          post.frontmatter.tags.find((ftTag) => tag.title === ftTag.title)
            ? ++acc
            : acc,
        0,
      ),
    }))

    return { tagStats } satisfies TagIndexPageData
  }
}

import type { MDXContent } from "mdx/types"
import { Tag } from "./Tag"

export type Post = {
  readonly frontmatter: PostFrontmatter
  readonly content: MDXContent
  readonly excerpt: string
}

export type PostFrontmatter = {
  title: string
  date: string
  tags: Tag[]
}

import { Tag } from "./Tag"

import type { MDXContent } from "mdx/types"

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

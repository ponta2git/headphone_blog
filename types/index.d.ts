import type Post from "../domain/Post"
import type { PropsWithChildren } from "react"

export type Tag = string

export type PostFrontmatter = {
  title: string
  date: string
  tags: Tag[]
}

export type TagProps = PropsWithChildren<Tag>
export type ExcerptCardProps = PropsWithChildren<
  Pick<Post, "frontmatter" | "excerpt">
>

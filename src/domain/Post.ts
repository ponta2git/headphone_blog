import type { PostFrontmatter } from "../types"
import type { MDXContent, MDXModule } from "mdx/types"
import type { ReactElement } from "react"

export default class Post {
  private static TRUNC_CHAR_COUNT = 150

  private _frontmatter: PostFrontmatter
  private _content: MDXContent

  constructor({ frontmatter, default: content }: MDXModule) {
    this._frontmatter = frontmatter as PostFrontmatter
    this._content = content
  }

  get frontmatter() {
    return this._frontmatter
  }

  get content() {
    return this._content
  }

  get excerpt() {
    function generateExcerpt(body: string) {
      return body.trim().substring(0, Post.TRUNC_CHAR_COUNT).concat("……")
    }

    function extractContent(node: ReactElement) {
      if (typeof node === "string") {
        if (node === "\n") return
        return node
      } else if (typeof node.props.children === "string") {
        return node.props.children
      }

      let str = ""
      if (Array.isArray(node.props.children)) {
        for (const element of node.props.children) {
          const walked = extractContent(element)
          if (walked !== undefined) str += walked
        }
      }

      return str
    }

    return generateExcerpt(extractContent(this._content({})))
  }
}

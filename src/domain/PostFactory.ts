import React from "react"
import { evaluate } from "@mdx-js/mdx"
import runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import remarkImages from "remark-images"
import Post from "./Post"

export default class PostFactory {
  public static async build(postFile: Buffer) {
    const compiled = await evaluate(postFile, {
      ...runtime,
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        remarkImages,
      ],
      Fragment: React.Fragment,
      development: false,
    })

    return new Post(compiled)
  }
}

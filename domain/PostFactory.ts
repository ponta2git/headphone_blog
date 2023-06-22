import { evaluate } from "@mdx-js/mdx"
import runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import Post from "./Post"

export default class PostFactory {
  public static async build(postFile: Buffer) {
    return new Post(
      await evaluate(postFile, {
        ...runtime,
        development: false,
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
        Fragment: "jsx",
      }),
    )
  }
}

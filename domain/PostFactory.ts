import { compileSync, runSync } from "@mdx-js/mdx"
import runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import Post from "./Post"

export default class PostFactory {
  public static build(postFile: Buffer) {
    const compiled = compileSync(postFile, {
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
      development: false,
      outputFormat: "function-body",
    })

    const tricked = String(compiled).replaceAll('"img"', "_components.img")

    return new Post(runSync(tricked, runtime))
  }
}

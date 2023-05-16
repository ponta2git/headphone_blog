import React from "react"
import matter from "gray-matter"
import { compile, run } from "@mdx-js/mdx"
import remarkGfm from "remark-gfm"
import runtime from "react/jsx-runtime"

import { getAllPosts } from "../libs/getAllPosts"
import { readFile } from "node:fs/promises"
import { generateExcerpt } from "../libs/generateExcerpt"
import { walkJsx } from "../libs/walkMdx"

async function getPostMetadata() {
  const postNames = getAllPosts().sort().reverse()

  return await Promise.all(
    postNames.map(async (name) => {
      const postFile = await readFile(name)

      const { data: frontmatter } = matter(postFile)

      const compiled = await compile(postFile, {
        development: false,
        remarkPlugins: [remarkGfm],
        outputFormat: "function-body",
      })
      const { default: mdx } = await run(String(compiled), runtime)
      const excerpt = generateExcerpt(walkJsx(mdx()) ?? "")

      return {
        frontmatter,
        excerpt,
      }
    }),
  )
}

export default async function Page() {
  const data = await getPostMetadata()
  return <div></div>
}

import { evaluate } from "@mdx-js/mdx"
import { MDXModule } from "mdx/types"
import { Fragment, ReactNode, isValidElement } from "react"
import runtime from "react/jsx-runtime"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkImages from "remark-images"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"

import { Frontmatter, toFrontmatter } from "./Frontmatter"
import { MDXCompileError } from "../Errors"

import type { MDXContent } from "mdx/types"

export type Post = {
  readonly frontmatter: Frontmatter
  readonly content: MDXContent
  readonly excerpt: string
}

const TRUNC_CHAR_COUNT = 150

type HasChildren = {
  children: ReactNode
}

function isIterable<T>(obj: unknown): obj is Iterable<T> {
  return Array.isArray(obj)
}

function generateExcerpt(body: string) {
  return body.trim().substring(0, TRUNC_CHAR_COUNT).concat("...")
}

function extractContent(node: ReactNode) {
  let result = ""

  if (typeof node === "string") {
    if (node === "\n") return ""
    return node
  }

  if (isValidElement<HasChildren>(node)) {
    if (isIterable<ReactNode>(node.props.children)) {
      for (const child of node.props.children) {
        if (isValidElement<HasChildren>(child)) {
          result += extractContent(child.props.children)
        }
      }
    } else if (typeof node.props.children === "string") {
      result += extractContent(node.props.children)
    }
  }

  return result
}

export async function toPost(postFile: Buffer) {
  let compiled: MDXModule
  try {
    compiled = await evaluate(postFile, {
      ...runtime,
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        remarkImages,
      ],
      Fragment,
      development: false,
    })
  } catch (e) {
    throw MDXCompileError(e)
  }

  const { frontmatter: rawFrontmatter, default: content } = compiled
  const topNode = content({})
  const excerpt = generateExcerpt(extractContent(topNode))
  const frontmatter = toFrontmatter(rawFrontmatter)

  return {
    frontmatter,
    content,
    excerpt,
  } satisfies Post
}

import { Fragment, PropsWithChildren, ReactNode, isValidElement } from "react"
import { evaluate } from "@mdx-js/mdx"
import runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import remarkImages from "remark-images"
import { Post } from "./Post"
import TagFactory from "./TagFactory"

const TRUNC_CHAR_COUNT = 150

type MDXFrontmatter = {
  title: string
  date: string
  tags: string[]
}

// TODO: type check
function isIterable<T>(obj: any): obj is Iterable<T> {
  return Array.isArray(obj)
}

const generateExcerpt = (body: string) => {
  return body.trim().substring(0, TRUNC_CHAR_COUNT).concat("……")
}

const extractContent = (node: ReactNode) => {
  if (typeof node === "string") {
    if (node === "\n") return ""
    return node
  }
  if (!isValidElement<PropsWithChildren<ReactNode>>(node)) {
    throw new Error("Parse Error!")
  }
  const { children } = node.props
  if (typeof children === "string") return children
  if (isValidElement<PropsWithChildren<ReactNode>>(children)) return ""

  if (!isIterable<ReactNode>(children)) {
    console.dir(children)
    throw new Error("Parse Error! ")
  }
  let str = ""
  for (const element of children) {
    const walked = extractContent(element)
    if (walked !== undefined) str += walked
  }

  return str
}

export default class PostFactory {
  public static async create(postFile: Buffer): Promise<Post> {
    const compiled = await evaluate(postFile, {
      ...runtime,
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        remarkImages,
      ],
      Fragment: Fragment,
      development: false,
    })

    const { frontmatter, default: content } = compiled
    const topNode = content({})
    const excerpt = generateExcerpt(extractContent(topNode))

    const { tags: tagStrs } = frontmatter as MDXFrontmatter
    const postTags = tagStrs.map((str) => TagFactory.createFromString(str))

    return {
      frontmatter: {
        ...(frontmatter as MDXFrontmatter),
        tags: postTags,
      },
      content,
      excerpt,
    }
  }
}

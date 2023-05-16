import type { ReactHTMLElement } from "react"

export function walkJsx(node: string | ReactHTMLElement<never>) {
  if (typeof node === "string") {
    if (node === "\n") return
    return node
  } else if (typeof node.props.children === "string") {
    if (node.type === "h2") return // avoid frontmatter
    return node.props.children
  }

  let str = ""
  if (Array.isArray(node.props.children)) {
    for (const element of node.props.children) {
      const walked = walkJsx(element)
      if (walked !== undefined) str += walked
    }
  }

  return str
}

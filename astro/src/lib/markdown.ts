import { visit } from "unist-util-visit";

import type { Nodes, Root } from "mdast";
import type { Plugin } from "unified";

function inlineText(node: Nodes): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value;
  if (node.type === "break") return " ";
  if ("children" in node) return node.children.map(inlineText).join("");
  return "";
}

/** Use the existing Markdown tree; never parse the source again for excerpts. */
export function excerptFromTree(tree: Root): string {
  const paragraphs: string[] = [];
  function collect(node: Nodes) {
    if (node.type === "paragraph") paragraphs.push(inlineText(node));
    else if (
      node.type === "root" ||
      node.type === "list" ||
      node.type === "listItem"
    )
      node.children.forEach(collect);
  }
  collect(tree);
  const text = paragraphs.join(" ").replace(/\s+/gu, " ").trim();
  if (!text) throw new Error("Article has no text for an excerpt");
  const points = Array.from(text);
  return points.slice(0, 120).join("") + (points.length > 120 ? "…" : "");
}

/** Small blog-specific additions to the standard remark pipeline. */
export const remarkBlog: Plugin<[], Root> = () => (tree, file) => {
  const data = file.data as {
    astro?: { frontmatter?: Record<string, unknown> };
  };
  data.astro ??= {};
  data.astro.frontmatter = {
    ...data.astro.frontmatter,
    excerpt: excerptFromTree(tree),
  };

  visit(tree, "blockquote", (node) => {
    const first = node.children[0];
    if (first?.type !== "paragraph") return;
    const marker = first.children[0];
    if (marker?.type !== "text") return;
    const match = /^\[!(NOTE|WARNING)\](?:\n|$)/u.exec(marker.value);
    if (!match) return;
    marker.value = marker.value.slice(match[0].length);
    if (first.children.every((child) => child.type === "text" && !child.value))
      node.children.shift();
    node.data = {
      hName: "aside",
      hProperties: {
        className: ["callout", `callout-${match[1].toLowerCase()}`],
      },
    };
    node.children.unshift({
      type: "paragraph",
      data: { hProperties: { className: ["callout-label"] } },
      children: [
        { type: "text", value: match[1] === "NOTE" ? "メモ" : "注意" },
      ],
    });
  });

  visit(tree, "table", (node) => {
    node.data = {
      hProperties: {
        tabIndex: 0,
        "aria-label": "表（横にスクロールできます）",
      },
    };
  });
};

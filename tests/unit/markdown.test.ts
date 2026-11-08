import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import { excerptFromTree, remarkBlog } from "../../src/lib/markdown";

const processor = unified().use(remarkParse).use(remarkGfm);
const excerpt = (markdown: string) =>
  excerptFromTree(processor.parse(markdown));

describe("plain-text excerpts from the Markdown tree", () => {
  it("includes prose, list text, link labels, emphasis and inline code", () => {
    expect(
      excerpt(
        "日本語の**強調**と[リンク](https://example.com)を`確認`。\n続き。\n\n- 一つ\n- 二つ\n  - 入れ子",
      ),
    ).toBe("日本語の強調とリンクを確認。 続き。 一つ 二つ 入れ子");
  });
  it("excludes headings, images, code blocks, quotes, alerts and tables", () => {
    expect(
      excerpt(
        "# 見出し\n\n前文。\n\n![代替](image.webp)\n\n> 引用\n\n> [!NOTE]\n> 注意書き\n\n```\nコード\n```\n\n| 表 |\n| --- |\n| セル |\n\n後文。",
      ),
    ).toBe("前文。 後文。");
  });
  it("normalizes whitespace and truncates at 120 Unicode code points only when needed", () => {
    expect(excerpt("  前文。  \n\n  後文。  ")).toBe("前文。 後文。");
    expect(excerpt("あ".repeat(120))).toBe("あ".repeat(120));
    expect(excerpt("😀".repeat(121))).toBe("😀".repeat(120) + "…");
  });
  it("detects empty excerpts", () => {
    expect(() => excerpt("# 見出し\n\n![代替](image.webp)")).toThrow("no text");
  });
  it("exports generated frontmatter and keeps alert content", () => {
    const runner = processor().use(remarkBlog);
    const tree = runner.parse("本文。\n\n> [!WARNING]\n> 注意の本文。");
    const data: { astro?: { frontmatter?: Record<string, unknown> } } = {};
    runner.runSync(tree, { data });
    expect(data.astro?.frontmatter?.excerpt).toBe("本文。");
    expect(tree.children[1]).toMatchObject({
      type: "blockquote",
      data: { hName: "aside" },
      children: [
        { children: [{ value: "注意" }] },
        { children: [{ value: "注意の本文。" }] },
      ],
    });
  });
});

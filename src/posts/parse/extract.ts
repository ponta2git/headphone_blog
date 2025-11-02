import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { visit, EXIT } from "unist-util-visit";
import type { Root, Content, Heading, Text } from "mdast";
import { createLogger } from "../../utils/logger";

const logger = createLogger("posts/parse/extract");

/**
 * MDXから抜粋を抽出（AST-based）
 *
 * Frontmatterを除いた本文の最初のN文字を抽出
 *
 * @param mdxSource - MDXソース文字列
 * @param length - 抜粋の長さ（デフォルト: 100）
 * @returns 抜粋文字列
 */
export function extractExcerpt(mdxSource: string, length = 100): string {
  logger.debug("Extracting excerpt from MDX", { length });

  try {
    const ast = parseMdxAst(mdxSource);

    let textContent = "";
    // ASTをトラバースしてテキストを抽出
    visit(ast, "text", (node: Text) => {
      const text = node.value;
      if (text) {
        textContent += text;
        if (textContent.length >= length) {
          return EXIT;
        }
      }
    });

    // 指定された長さで切り詰め
    const excerpt = textContent.slice(0, length).trim();

    logger.debug("Extracted excerpt", { excerptLength: excerpt.length });

    return excerpt;
  } catch (error) {
    logger.error("Failed to extract excerpt", error as Error);
    // フォールバック: 単純な文字列操作
    return mdxSource.slice(0, length).trim();
  }
}

/**
 * MDXから最初の画像URLを抽出（AST-based）
 *
 * @param mdxSource - MDXソース文字列
 * @returns 画像URL（見つからない場合はnull）
 */
export function extractFirstImage(mdxSource: string): string | null {
  logger.debug("Extracting first image from MDX");

  try {
    // MDXをASTにパース
    const ast = parseMdxAst(mdxSource);

    let firstImageUrl: string | undefined;

    // ASTをトラバースして最初の画像を探す
    visit(ast, "image", (node) => {
      const imageNode = node;
      if (imageNode.url && !firstImageUrl) {
        firstImageUrl = imageNode.url;
        logger.debug("Found first image", { url: firstImageUrl });
        return false; // トラバース停止
      }
    });

    if (!firstImageUrl) {
      logger.debug("No image found in MDX");
    }

    return firstImageUrl ?? null;
  } catch (error) {
    logger.error("Failed to extract first image", error as Error);
    return null;
  }
}

/**
 * MDXから見出し(H2-H4)とid/textを抽出
 */
export function extractHeadings(mdxSource: string): Array<{
  id: string;
  text: string;
  level: 2 | 3 | 4 | 5 | 6;
}> {
  const headings: Array<{
    id: string;
    text: string;
    level: 2 | 3 | 4 | 5 | 6;
  }> = [];
  const counts = new Map<string, number>();

  try {
    const ast = parseMdxAst(mdxSource);

    visit(ast, "heading", (node: Heading) => {
      const h = node;
      if (h.depth >= 2 && h.depth <= 6) {
        let text = "";
        const isText = (n: Content): n is Text => n.type === "text";
        h.children.forEach((c: Content) => {
          if (isText(c)) text += c.value;
        });
        const baseRaw = slugify(text);
        const base = baseRaw.length > 0 ? baseRaw : "section";
        const next = (counts.get(base) ?? 0) + 1;
        counts.set(base, next);
        const unique = next === 1 ? base : `${base}-${next}`;
        headings.push({
          id: unique,
          text,
          level: h.depth as 2 | 3 | 4 | 5 | 6,
        });
      }
    });
  } catch (error) {
    logger.error("Failed to extract headings", error as Error);
  }

  return headings;
}

/**
 * 簡易スラグ化（日本語対応): 記号除去→空白をハイフン、全角→半角の一部簡易置換
 */
function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[！-／：-＠［-｀｛-～]/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * 読了時間（分）を概算（日本語は500-600字/分目安）
 */
export function estimateReadTime(mdxSource: string): number {
  try {
    const ast = parseMdxAst(mdxSource);
    let textContent = "";
    visit(ast, "text", (node: Text) => {
      textContent += node.value;
    });
    const chars = textContent.length;
    const minutes = Math.max(1, Math.round(chars / 550));
    return minutes;
  } catch {
    return 1;
  }
}

/**
 * MDX文字列をフロントマター対応のASTへパース
 */
function parseMdxAst(mdxSource: string): Root {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .parse(mdxSource);
}

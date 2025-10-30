import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
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
    // MDXをASTにパース
    const ast = unified().use(remarkParse).use(remarkGfm).parse(mdxSource);

    let textContent = "";
    let isFrontmatter = false;

    // ASTをトラバースしてテキストを抽出
    visit(ast, (node) => {
      // Frontmatterをスキップ（yamlタイプのみ）
      if (node.type === "yaml") {
        isFrontmatter = true;
        return;
      }

      // テキストノードから内容を抽出
      if (node.type === "text" && !isFrontmatter) {
        const text = node.value;
        textContent += text;
      }

      // 必要な長さに達したら終了
      if (textContent.length >= length) {
        return false; // トラバース停止
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
    const ast = unified().use(remarkParse).use(remarkGfm).parse(mdxSource);

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

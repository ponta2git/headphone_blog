import { evaluateSync } from "@mdx-js/mdx";
import React from "react";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { PostdateService } from "../date/PostdateService";
import { createMdxCompileError, createParseFrontmatterError } from "../errors/ErrorFactory";
import { TagService } from "../tag/TagService";

import type { Post } from "./PostTypes";
import type { MDXModule } from "mdx/types";

export function evaluateMdxContent(file: Buffer): Post {
  // MDX を評価
  let mdxModule: MDXModule;
  try {
    mdxModule = evaluateSync(file, {
      Fragment: React.Fragment,
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        remarkImages,
      ],
    });
  } catch (error) {
    throw createMdxCompileError(error);
  }

  const frontmatter = convertFrontmatter(mdxModule.frontmatter);
  const excerpt = createExcerpt(file);

  return {
    frontmatter,
    excerpt,
    body: mdxModule.default,
  };
}

function convertFrontmatter(raw: unknown): Post["frontmatter"] {
  // raw がオブジェクトではなければエラー
  if (typeof raw !== "object" || raw === null) {
    throw createParseFrontmatterError("Raw frontmatter is not an object.");
  }

  // オブジェクトの型を指定して取り出す
  const { title, date, tags } = raw as {
    title?: unknown;
    date?: unknown;
    tags?: unknown;
  };

  // title のチェック
  if (typeof title !== "string") {
    throw createParseFrontmatterError("title is not a string.");
  }

  // date のチェック
  if (typeof date !== "string") {
    throw createParseFrontmatterError("date is not a string.");
  }

  // tags のチェック
  if (!Array.isArray(tags)) {
    throw createParseFrontmatterError("tags is not an array.");
  }

  // ここで必要に応じてタグの型や日付のパースを行う
  return {
    title,
    date: PostdateService.from_yyyyMMdd(date),
    tags: tags.map((tag) => TagService.from(tag)),
  };
}

function createExcerpt(file: Buffer): string {
  const tree = unified().use(remarkParse).parse(file);
  let textContent = "";

  visit(tree, "text", (node) => {
    textContent += node.value;
  });

  return `${textContent.trim().slice(0, 200)} ...`;
}
import type { Postdate } from "../date/PostdateService";
import type { Tag } from "../tag/TagService";
import type { MDXContent } from "mdx/types";

export type Post = {
  frontmatter: {
    date: Postdate;
    title: string;
    tags: Tag[];
  };
  excerpt: string;
  body: MDXContent;
  rawContent: string; // 画像検出のための生のMDXコンテンツ
};

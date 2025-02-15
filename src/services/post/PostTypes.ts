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
};
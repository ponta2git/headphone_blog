import { getCollection, render } from "astro:content";

import { assertPosts, newestFirst } from "./blog";

/** The only bridge from content entries to the blog's data and rendered body. */
export async function getPosts() {
  const entries = await getCollection("posts");
  const posts = await Promise.all(
    entries.map(async (entry) => {
      const { Content, remarkPluginFrontmatter } = await render(entry);
      const excerpt: unknown = remarkPluginFrontmatter.excerpt;
      if (typeof excerpt !== "string" || !excerpt)
        throw new Error(`Missing generated excerpt: ${entry.id}`);
      return {
        ...entry.data,
        id: entry.id.split("/").at(-1)!,
        excerpt,
        Content,
      };
    }),
  );
  assertPosts(posts);
  return newestFirst(posts);
}

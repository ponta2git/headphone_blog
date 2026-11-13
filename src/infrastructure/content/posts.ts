import { getCollection, getEntry, render } from "astro:content";
import type { CollectionEntry } from "astro:content";

import { createPostCatalog } from "../../application/catalog";
import type { PostSummary } from "../../domain/posts";

export interface ContentPost extends PostSummary {
  readonly entryId: string;
  readonly ogImage?: CollectionEntry<"posts">["data"]["ogImage"];
}

function summarize(entry: CollectionEntry<"posts">): ContentPost {
  // The glob loader has already run remark. Its public metadata avoids preparing
  // Content components and resolving body images on every listing/feed request.
  const frontmatter = entry.rendered?.metadata?.frontmatter;
  const excerpt: unknown =
    typeof frontmatter === "object" &&
    frontmatter !== null &&
    "excerpt" in frontmatter
      ? frontmatter.excerpt
      : undefined;
  if (typeof excerpt !== "string" || !excerpt.trim())
    throw new Error(`Missing generated excerpt: ${entry.id}`);
  const id = entry.id.split("/").at(-1);
  if (!id) throw new Error("Missing content identifier");
  return {
    id,
    entryId: entry.id,
    title: entry.data.title,
    date: entry.data.date,
    tags: entry.data.tags,
    excerpt,
    ogImage: entry.data.ogImage,
  };
}

/** Load a fresh snapshot so Astro's content watcher remains the only cache owner. */
export async function getPostCatalog() {
  const entries = await getCollection("posts");
  return createPostCatalog(entries.map(summarize));
}

/** Render one article body, only on its detail page. */
export async function renderPost(post: ContentPost) {
  const entry = await getEntry("posts", post.entryId);
  if (!entry) throw new Error(`Missing article content: ${post.entryId}`);
  return render(entry);
}

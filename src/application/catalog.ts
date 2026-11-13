import { assertPosts, tags } from "../domain/posts";
import type { PostSummary } from "../domain/posts";

/** A validated publication snapshot. Sorting and tag indexing happen once per load. */
export function createPostCatalog<T extends PostSummary>(input: readonly T[]) {
  assertPosts(input);
  const posts: readonly T[] = Object.freeze(
    input
      .map((post) =>
        Object.freeze({ ...post, tags: Object.freeze([...post.tags]) }),
      )
      .sort((a, b) => b.date.localeCompare(a.date)),
  );
  const positions = new Map(posts.map((post, index) => [post.id, index]));
  const byTag = new Map<string, T[]>();
  for (const post of posts) {
    for (const name of post.tags) {
      const group = byTag.get(name) ?? [];
      group.push(post);
      byTag.set(name, group);
    }
  }
  const tagGroups = Object.freeze(
    Object.entries(tags).flatMap(([name, slug]) => {
      const tagged = byTag.get(name);
      return tagged
        ? [
            Object.freeze({
              name,
              slug,
              posts: Object.freeze(tagged),
              count: tagged.length,
            }),
          ]
        : [];
    }),
  );

  /** A union of matching tags, with each article included once, newest first. */
  function select(names: readonly string[]): readonly T[] {
    if (names.length === 1) return byTag.get(names[0]) ?? [];
    const wanted = new Set(names);
    return posts.filter((post) => post.tags.some((name) => wanted.has(name)));
  }

  return Object.freeze({
    posts,
    tagGroups,
    latest(limit = 5): readonly T[] {
      if (!Number.isInteger(limit) || limit < 0)
        throw new Error("Article limit must be a non-negative integer");
      return posts.slice(0, limit);
    },
    select,
    /** The same snapshot supplies the article, chronological neighbours and recommendations. */
    article(id: string) {
      const index = positions.get(id);
      if (index === undefined) throw new Error(`Unknown post: ${id}`);
      const post = posts[index];
      return {
        post,
        adjacent: { newer: posts[index - 1], older: posts[index + 1] },
        related: select(post.tags)
          .filter((candidate) => candidate.id !== id)
          .slice(0, 5),
      };
    },
  });
}

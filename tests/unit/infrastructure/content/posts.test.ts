import { getCollection, getEntry, render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getPostCatalog,
  renderPost,
} from "../../../../src/infrastructure/content/posts";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
  getEntry: vi.fn(),
  render: vi.fn(),
}));

const entry = (date: string, excerpt: unknown = "記事の本文。") =>
  ({
    id: `${date.slice(0, 4)}/${date.replaceAll("-", "")}`,
    collection: "posts",
    data: { title: "記事", date, tags: ["雑談"] },
    rendered: {
      html: "<p>記事の本文。</p>",
      metadata: { imagePaths: [], frontmatter: { excerpt } },
    },
  }) satisfies CollectionEntry<"posts">;

beforeEach(() => vi.resetAllMocks());

describe("Astro content adapter", () => {
  it("builds summaries from public rendered metadata without rendering article bodies", async () => {
    const source = entry("2025-01-01");
    vi.mocked(getCollection).mockResolvedValue([source]);
    const catalog = await getPostCatalog();
    expect(catalog.posts).toEqual([
      {
        id: "20250101",
        entryId: "2025/20250101",
        title: "記事",
        date: "2025-01-01",
        tags: ["雑談"],
        excerpt: "記事の本文。",
        ogImage: undefined,
      },
    ]);
    expect(catalog.posts[0]).not.toHaveProperty("Content");
    expect(catalog.posts[0]).not.toHaveProperty("rendered");
    expect(render).not.toHaveBeenCalled();
    expect(getEntry).not.toHaveBeenCalled();
    expect(Object.isFrozen(catalog.posts[0].tags)).toBe(true);
    expect(Object.isFrozen(source.data.tags)).toBe(false);
  });

  it("reads content again on each load so edits never leave stale module snapshots", async () => {
    vi.mocked(getCollection)
      .mockResolvedValueOnce([entry("2025-01-01", "初稿。")])
      .mockResolvedValueOnce([entry("2025-01-01", "更新。")]);
    expect((await getPostCatalog()).posts[0].excerpt).toBe("初稿。");
    expect((await getPostCatalog()).posts[0].excerpt).toBe("更新。");
    expect(getCollection).toHaveBeenCalledTimes(2);
  });

  it.each([undefined, null, 12, "", "   "])(
    "rejects invalid generated excerpt %s",
    async (excerpt) => {
      const source = entry("2025-01-01");
      source.rendered.metadata.frontmatter.excerpt = excerpt;
      vi.mocked(getCollection).mockResolvedValue([source]);
      await expect(getPostCatalog()).rejects.toThrow(
        "Missing generated excerpt: 2025/20250101",
      );
      expect(render).not.toHaveBeenCalled();
    },
  );

  it("detects colliding public IDs even when content entry paths differ", async () => {
    const source = entry("2025-01-01");
    vi.mocked(getCollection).mockResolvedValue([
      source,
      { ...source, id: "other/20250101" },
    ]);
    await expect(getPostCatalog()).rejects.toThrow("Duplicate post ID");
  });

  it.each([undefined, null, "invalid", {}])(
    "rejects missing or malformed rendered metadata %s",
    async (frontmatter) => {
      const source: CollectionEntry<"posts"> = entry("2025-01-01");
      source.rendered = { html: "", metadata: { imagePaths: [], frontmatter } };
      vi.mocked(getCollection).mockResolvedValue([source]);
      await expect(getPostCatalog()).rejects.toThrow(
        "Missing generated excerpt",
      );
    },
  );

  it("renders only the requested article and fails when its content disappears", async () => {
    const source = entry("2025-01-01");
    vi.mocked(getCollection).mockResolvedValue([source]);
    const post = (await getPostCatalog()).posts[0];
    vi.mocked(getEntry).mockResolvedValueOnce(source);
    await renderPost(post);
    expect(getEntry).toHaveBeenCalledWith("posts", "2025/20250101");
    expect(render).toHaveBeenCalledExactlyOnceWith(source);
    await expect(renderPost(post)).rejects.toThrow("Missing article content");
    expect(render).toHaveBeenCalledTimes(1);
  });
});

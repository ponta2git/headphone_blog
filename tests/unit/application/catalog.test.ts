import { describe, expect, it } from "vitest";
import { createPostCatalog } from "../../../src/application/catalog";

const post = (date: string, tags = ["試聴"]) => ({
  id: date.replaceAll("-", ""),
  date,
  title: date,
  tags,
  excerpt: `${date} の本文。`,
});

describe("publication catalog", () => {
  const posts = [
    post("2025-01-01"),
    post("2024-01-01", ["購入"]),
    post("2025-03-01", ["雑談"]),
    post("2025-02-01", ["購入", "試聴"]),
  ];

  it("sorts a snapshot without changing the input and bounds recent articles", () => {
    const catalog = createPostCatalog(posts);
    expect(catalog.posts.map((p) => p.id)).toEqual([
      "20250301",
      "20250201",
      "20250101",
      "20240101",
    ]);
    expect(posts[0].id).toBe("20250101");
    expect(catalog.latest(2)).toEqual([posts[2], posts[3]]);
    expect(catalog.latest(0)).toEqual([]);
    expect(() => catalog.latest(-1)).toThrow("limit");
    expect(() => catalog.latest(1.5)).toThrow("limit");
  });

  it("selects a tag union once in publication order and excludes unknown tags", () => {
    const catalog = createPostCatalog(posts);
    expect(catalog.select(["購入", "試聴"]).map((p) => p.id)).toEqual([
      "20250201",
      "20250101",
      "20240101",
    ]);
    expect(catalog.select(["雑談"])).toEqual([posts[2]]);
    expect(catalog.select(["missing"])).toEqual([]);
    expect(catalog.select([])).toEqual([]);
  });

  it("isolates its indexes and summaries from later changes to caller-owned input", () => {
    const input = [post("2025-01-01", ["試聴"])];
    const catalog = createPostCatalog(input);
    input[0].id = "20250201";
    input[0].date = "2025-02-01";
    input[0].title = "変更後";
    input[0].tags.push("購入");
    input.push(post("2025-03-01"));

    expect(catalog.posts).toEqual([post("2025-01-01", ["試聴"])]);
    expect(catalog.article("20250101").post.date).toBe("2025-01-01");
    expect(catalog.select(["購入"])).toEqual([]);
    expect(
      catalog.tagGroups.map(({ name, count }) => ({ name, count })),
    ).toEqual([{ name: "試聴", count: 1 }]);
    expect(Object.isFrozen(catalog.posts[0])).toBe(true);
    expect(Object.isFrozen(catalog.posts[0].tags)).toBe(true);
  });

  it("groups only populated tags in taxonomy order, with matching counts", () => {
    const catalog = createPostCatalog(posts);
    expect(
      catalog.tagGroups.map(({ name, slug, count }) => ({ name, slug, count })),
    ).toEqual([
      { name: "購入", slug: "purchase", count: 2 },
      { name: "試聴", slug: "try", count: 2 },
      { name: "雑談", slug: "chat", count: 1 },
    ]);
    expect(catalog.tagGroups[0].posts).toEqual([posts[3], posts[1]]);
  });

  it("chooses chronological neighbours and handles both ends", () => {
    const catalog = createPostCatalog(posts);
    expect(catalog.article("20250101").adjacent).toEqual({
      newer: posts[3],
      older: posts[1],
    });
    expect(catalog.article("20250301").adjacent.newer).toBeUndefined();
    expect(catalog.article("20240101").adjacent.older).toBeUndefined();
    expect(() => catalog.article("missing")).toThrow("Unknown post");
  });

  it("excludes the current article and limits shared-tag recommendations to five", () => {
    const catalog = createPostCatalog(
      Array.from({ length: 7 }, (_, i) =>
        post(`2025-01-0${i + 1}`, ["購入", "試聴"]),
      ),
    );
    expect(catalog.article("20250104").related.map((p) => p.id)).toEqual([
      "20250107",
      "20250106",
      "20250105",
      "20250103",
      "20250102",
    ]);
  });

  it("rejects invalid publications before making any catalog available", () => {
    expect(() => createPostCatalog([posts[0], posts[0]])).toThrow("Duplicate");
    expect(() => createPostCatalog([post("2025-02-30")])).toThrow("date");
    expect(() =>
      createPostCatalog([post("2025-01-01", ["__proto__"])]),
    ).toThrow("Unknown tag");
  });

  it("handles an empty publication catalog", () => {
    const catalog = createPostCatalog([]);
    expect(catalog.posts).toEqual([]);
    expect(catalog.latest()).toEqual([]);
    expect(catalog.tagGroups).toEqual([]);
    expect(() => catalog.article("20250101")).toThrow("Unknown post");
  });
});

import { describe, expect, it } from "vitest";
import {
  assertPosts,
  isPublicationDate,
  neighbours,
  newestFirst,
  postPath,
  publishedAt,
  relatedPosts,
  selectPosts,
} from "../../src/lib/blog";

const post = (date: string, tags = ["試聴"]) => ({
  id: date.replaceAll("-", ""),
  date,
  title: date,
  tags,
});

describe("publication dates and stable URLs", () => {
  it.each(["2024-02-29", "2025-01-01", "2025-03-01"])(
    "preserves valid calendar date %s",
    (date) => {
      expect(isPublicationDate(date)).toBe(true);
      expect(postPath(date)).toBe(`/posts/${date.replaceAll("-", "")}`);
    },
  );
  it.each([
    "2025-02-29",
    "2024-02-30",
    "2025-13-01",
    "2025-1-01",
    "2025-00-00",
    "oops",
  ])("rejects %s", (date) => {
    expect(isPublicationDate(date)).toBe(false);
    expect(() => postPath(date)).toThrow();
  });
  it.each([
    ["2025-08-31", "2025-08-30T15:00:00.000Z"],
    ["2025-03-01", "2025-02-28T15:00:00.000Z"],
    ["2025-01-01", "2024-12-31T15:00:00.000Z"],
  ])("uses JST midnight for %s, including calendar boundaries", (date, utc) => {
    expect(new Date(publishedAt(date)).toISOString()).toBe(utc);
  });
  it("detects duplicates, filename/date mismatches and unknown tags", () => {
    expect(() => assertPosts([post("2025-01-01"), post("2025-01-01")])).toThrow(
      "Duplicate",
    );
    expect(() =>
      assertPosts([{ ...post("2025-01-01"), id: "20250102" }]),
    ).toThrow("mismatch");
    expect(() => assertPosts([post("2025-01-01", ["__proto__"])])).toThrow(
      "Unknown tag",
    );
  });
});

describe("article selection", () => {
  const posts = [
    post("2025-01-01"),
    post("2024-01-01", ["購入"]),
    post("2025-03-01", ["雑談"]),
    post("2025-02-01", ["購入", "試聴"]),
  ];
  it("sorts newest first without changing the input", () => {
    expect(newestFirst(posts).map((p) => p.id)).toEqual([
      "20250301",
      "20250201",
      "20250101",
      "20240101",
    ]);
    expect(posts[0].id).toBe("20250101");
  });
  it("selects impressions by either tag and discussions by chat", () => {
    expect(selectPosts(posts, ["購入", "試聴"]).map((p) => p.id)).toEqual([
      "20250201",
      "20250101",
      "20240101",
    ]);
    expect(selectPosts(posts, ["雑談"])).toEqual([posts[2]]);
  });
  it("chooses chronological neighbours and handles the ends", () => {
    expect(neighbours(posts, posts[0])).toEqual({
      newer: posts[3],
      older: posts[1],
    });
    expect(neighbours(posts, posts[2]).newer).toBeUndefined();
    expect(neighbours(posts, posts[1]).older).toBeUndefined();
  });
  it("excludes current post and limits shared-tag matches to five", () => {
    const related = Array.from({ length: 7 }, (_, i) =>
      post(`2025-01-0${i + 1}`, ["購入", "試聴"]),
    );
    expect(relatedPosts(related, related[3]).map((p) => p.id)).toEqual([
      "20250107",
      "20250106",
      "20250105",
      "20250103",
      "20250102",
    ]);
  });
});

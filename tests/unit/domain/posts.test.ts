import { describe, expect, it } from "vitest";
import {
  assertPosts,
  isPublicationDate,
  postPath,
  publishedAt,
} from "../../../src/domain/posts";

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
  it("requires a readable title and at least one distinct tag", () => {
    expect(() =>
      assertPosts([{ ...post("2025-01-01"), title: "   " }]),
    ).toThrow("Missing post title");
    expect(() => assertPosts([post("2025-01-01", [])])).toThrow(
      "Missing post tags",
    );
    expect(() => assertPosts([post("2025-01-01", ["試聴", "試聴"])])).toThrow(
      "Duplicate post tag",
    );
  });
});

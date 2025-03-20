import { evaluateMdxContent } from "../../src/services/post/PostUtils";
import { PostdateService } from "../../src/services/date/PostdateService";
import { TagService } from "../../src/services/tag/TagService";
import TagsJson from "../../src/services/tag/Tags.json";

vi.mock(
  import("../../src/services/tag/Tags.json"),
  () =>
    ({
      default: { test: "test-slug", mdx: "mdx-slug" },
    }) as unknown as typeof TagsJson,
);

describe("PostUtils", () => {
  describe("evaluateMdxContent", () => {
    it("should evaluate MDX content and return a Post object", () => {
      const file = Buffer.from(`---
title: "Test Post"
date: "2023-01-01"
tags: ["test", "mdx"]
---

# Hello World
      `);

      const post = evaluateMdxContent(file);

      expect(post.frontmatter.title).toBe("Test Post");
      expect(post.frontmatter.date).toStrictEqual(
        PostdateService.from_yyyyMMdd_hyphenated("2023-01-01"),
      );
      expect(post.frontmatter.tags).toEqual(
        ["test", "mdx"].map((tag) => TagService.fromName(tag)),
      );
      expect(post.excerpt).toBe("Hello World ...");
      expect(post.body).toBeDefined();
    });

    it("should create an excerpt with a maximum of 200 characters", () => {
      const file = Buffer.from(`---
title: "Long Post"
date: "2023-01-01"
tags: ["test", "mdx"]
---

# This is a very long post

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `);

      const post = evaluateMdxContent(file);

      expect(post.frontmatter.title).toBe("Long Post");
      expect(post.frontmatter.date).toStrictEqual(
        PostdateService.from_yyyyMMdd_hyphenated("2023-01-01"),
      );
      expect(post.frontmatter.tags).toEqual(
        ["test", "mdx"].map((tag) => TagService.fromName(tag)),
      );
      expect(post.excerpt.length).toBeLessThanOrEqual(204); // 200 chars + " ..."
      expect(post.excerpt.endsWith(" ...")).toBe(true);
      expect(post.body).toBeDefined();
    });

    it("should throw an error if MDX compilation fails", () => {
      const file = Buffer.from(`invalid mdx content`);

      expect(() => evaluateMdxContent(file)).toThrow();
    });
  });
});

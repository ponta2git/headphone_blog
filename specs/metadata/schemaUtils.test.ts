import { describe, expect, it } from "vitest";
import {
  generateBlogPostingSchema,
  generateWebsiteSchema,
  generateCollectionPageSchema,
} from "../../src/metadata/schema/schemaUtils";
import type { SiteInfo } from "../../src/metadata/types";

describe("schemaUtils", () => {
  const testSiteInfo: SiteInfo = {
    name: "Test Blog",
    description: "Test blog description",
    url: "https://test-blog.example.com/",
    twitter: "@testblog",
    postsPath: "posts",
    ignoreFiles: [".DS_Store"],
    author: "Test Author",
    email: "test@example.com",
  };

  describe("generateBlogPostingSchema", () => {
    it("should generate valid blog post schema", () => {
      const schema = generateBlogPostingSchema(
        "Test Post Title",
        "Test post description",
        "https://test-blog.example.com/posts/20250101",
        "20250101",
        testSiteInfo,
      );

      expect(schema).toEqual({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: "Test Post Title",
        description: "Test post description",
        url: "https://test-blog.example.com/posts/20250101",
        datePublished: "2025-01-01T00:00:00+09:00",
        dateModified: "2025-01-01T00:00:00+09:00",
        author: {
          "@type": "Person",
          name: "Test Author",
        },
        publisher: {
          "@type": "Person",
          name: "Test Author",
          logo: {
            "@type": "ImageObject",
            url: "https://test-blog.example.com/images/logo.webp",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://test-blog.example.com/posts/20250101",
        },
      });
    });

    it("should include image when provided", () => {
      const schema = generateBlogPostingSchema(
        "Test Post Title",
        "Test post description",
        "https://test-blog.example.com/posts/20250101",
        "20250101",
        testSiteInfo,
        "https://test-blog.example.com/images/post-image.webp",
      );

      expect(schema.image).toBe(
        "https://test-blog.example.com/images/post-image.webp",
      );
    });
  });

  describe("generateWebsiteSchema", () => {
    it("should generate valid website schema", () => {
      const schema = generateWebsiteSchema(testSiteInfo);

      expect(schema).toEqual({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Blog",
        description: "Test blog description",
        url: "https://test-blog.example.com/",
        author: {
          "@type": "Person",
          name: "Test Author",
        },
        publisher: {
          "@type": "Person",
          name: "Test Author",
        },
      });
    });
  });

  describe("generateCollectionPageSchema", () => {
    it("should generate valid collection page schema with empty items", () => {
      const schema = generateCollectionPageSchema(
        "Test Collection",
        "Test collection description",
        "https://test-blog.example.com/collection",
      );

      expect(schema).toEqual({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Test Collection",
        description: "Test collection description",
        url: "https://test-blog.example.com/collection",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: [],
        },
      });
    });

    it("should generate valid collection page schema with list items", () => {
      const items = [
        { url: "https://test-blog.example.com/item1", name: "Item 1" },
        { url: "https://test-blog.example.com/item2", name: "Item 2" },
      ];

      const schema = generateCollectionPageSchema(
        "Test Collection",
        "Test collection description",
        "https://test-blog.example.com/collection",
        items,
      );

      expect(schema.mainEntity.itemListElement).toEqual([
        {
          "@type": "ListItem",
          position: 1,
          url: "https://test-blog.example.com/item1",
          name: "Item 1",
        },
        {
          "@type": "ListItem",
          position: 2,
          url: "https://test-blog.example.com/item2",
          name: "Item 2",
        },
      ]);
    });
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";

// Use vi.hoisted to ensure mocks are defined before imports
const mockExistsSync = vi.hoisted(() => vi.fn());
const mockPathJoin = vi.hoisted(() =>
  vi.fn((...args) => {
    // Handle the double slash issue by properly joining the path segments
    return args.join("/").replace(/\/+/g, "/");
  }),
);

vi.mock("fs", () => ({
  existsSync: mockExistsSync,
  default: { existsSync: mockExistsSync },
}));

vi.mock("path", () => ({
  join: mockPathJoin,
  default: { join: mockPathJoin },
}));

// Now import the module under test
import * as imageUtils from "../../src/metadata/utils/imageUtils";

describe("imageUtils", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Set default process.cwd to a test value
    vi.spyOn(process, "cwd").mockReturnValue("/test/workspace");
  });

  describe("extractFirstImagePath", () => {
    it("should extract image path from markdown content", () => {
      const mdxContent = `
        # Test Title
        
        Some text here
        
        ![Alt text](/images/test-image.webp)
        
        More text
      `;

      const result = imageUtils.extractFirstImagePath(mdxContent);
      expect(result).toBe("/images/test-image.webp");
    });

    it("should extract first image path when multiple images exist", () => {
      const mdxContent = `
        # Test Title
        
        ![First image](/images/first.webp)
        
        Some text here
        
        ![Second image](/images/second.webp)
      `;

      const result = imageUtils.extractFirstImagePath(mdxContent);
      expect(result).toBe("/images/first.webp");
    });

    it("should handle absolute URLs", () => {
      const mdxContent = `
        # Test Title
        
        ![External image](https://example.com/image.jpg)
      `;

      const result = imageUtils.extractFirstImagePath(mdxContent);
      expect(result).toBe("https://example.com/image.jpg");
    });

    it("should return undefined when no image exists", () => {
      const mdxContent = `
        # Test Title
        
        Just some text without images
      `;

      const result = imageUtils.extractFirstImagePath(mdxContent);
      expect(result).toBeUndefined();
    });
  });

  describe("imageExists", () => {
    it("should check if relative path image exists in public folder", () => {
      mockExistsSync.mockReturnValue(true);

      const result = imageUtils.imageExists("/images/test.webp");

      expect(mockExistsSync).toHaveBeenCalledWith(
        "/test/workspace/public/images/test.webp",
      );
      expect(result).toBe(true);
    });

    it("should return false if image does not exist", () => {
      mockExistsSync.mockReturnValue(false);

      const result = imageUtils.imageExists("/images/nonexistent.webp");

      expect(mockExistsSync).toHaveBeenCalledWith(
        "/test/workspace/public/images/nonexistent.webp",
      );
      expect(result).toBe(false);
    });

    it("should return true for absolute URLs without checking filesystem", () => {
      const result = imageUtils.imageExists("https://example.com/image.jpg");

      expect(mockExistsSync).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe("getFullImageUrl", () => {
    it("should construct full image URL", () => {
      const path = "/images/test.webp";
      const baseUrl = "https://blog.example.com/";

      const result = imageUtils.getFullImageUrl(path, baseUrl);

      expect(result).toBe("https://blog.example.com/images/test.webp");
    });

    it("should handle paths without leading slash", () => {
      const path = "images/test.webp";
      const baseUrl = "https://blog.example.com/";

      const result = imageUtils.getFullImageUrl(path, baseUrl);

      expect(result).toBe("https://blog.example.com/images/test.webp");
    });
  });

  describe("getImageMetadata", () => {
    it("should return empty object if no image is found", () => {
      const mdxContent = "No image here";
      const baseUrl = "https://blog.example.com/";

      const result = imageUtils.getImageMetadata(mdxContent, baseUrl);

      expect(result).toEqual({});
    });

    it("should return empty object if image does not exist", () => {
      mockExistsSync.mockReturnValue(false);

      const mdxContent = "![Alt](/images/nonexistent.webp)";
      const baseUrl = "https://blog.example.com/";

      const result = imageUtils.getImageMetadata(mdxContent, baseUrl);

      expect(result).toEqual({});
    });

    it("should return metadata for existing image", () => {
      mockExistsSync.mockReturnValue(true);

      const mdxContent = "![Alt](/images/test.webp)";
      const baseUrl = "https://blog.example.com/";

      const result = imageUtils.getImageMetadata(mdxContent, baseUrl);

      expect(result).toEqual({
        url: "https://blog.example.com/images/test.webp",
        width: 1200,
        height: 630,
      });
    });
  });
});

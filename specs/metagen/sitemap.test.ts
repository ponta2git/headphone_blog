import { DateTime } from "luxon";
import { writeFileSync } from "fs";
import { generateSitemap } from "../../metagen/src/sitemap";
import { PostdateService } from "../../src/services/date/PostdateService";
import { TagService } from "../../src/services/tag/TagService";

// Mock the PostdateService, TagService, and writeFileSync
vi.mock("../../src/services/date/PostdateService");
vi.mock("../../src/services/tag/TagService");
vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate sitemap and write to file", async () => {
      const mockDates = [
        DateTime.fromISO("2023-01-01"),
        DateTime.fromISO("2023-01-02"),
      ] as DateTime<true>[];
      vi.mocked(PostdateService.getAllPostdates).mockResolvedValue(mockDates);

      // Mock TagService.allTags
      vi.mocked(TagService.allTags).mockReturnValue([
        { name: "購入", slug: "purchase" },
        { name: "試聴", slug: "try" },
      ]);

      await generateSitemap();

      expect(writeFileSync).toHaveBeenCalledWith(
        "public/sitemap.xml",
        expect.stringContaining(
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ),
      );
      expect(writeFileSync).toHaveBeenCalledWith(
        "public/sitemap.xml",
        expect.stringContaining("<loc>https://ponta-headphone.net/</loc>"),
      );
      expect(writeFileSync).toHaveBeenCalledWith(
        "public/sitemap.xml",
        expect.stringContaining(
          "<loc>https://ponta-headphone.net/posts/20230101</loc>",
        ),
      );
      expect(writeFileSync).toHaveBeenCalledWith(
        "public/sitemap.xml",
        expect.stringContaining(
          "<loc>https://ponta-headphone.net/posts/20230102</loc>",
        ),
      );

      expect(writeFileSync).toHaveBeenCalledWith(
        "public/sitemap.xml",
        expect.stringContaining(
          "<loc>https://ponta-headphone.net/tags/purchase</loc>",
        ),
      );
      expect(writeFileSync).toHaveBeenCalledWith(
        "public/sitemap.xml",
        expect.stringContaining(
          "<loc>https://ponta-headphone.net/tags/try</loc>",
        ),
      );
    });
  });
});

import { DateTime } from "luxon";
import { writeFileSync } from "fs";
import { generateSitemap } from "../../metagen/src/sitemap";
import { PostdateService } from "../../src/services/date/PostdateService";

// Mock the PostdateService and writeFileSync
vi.mock("../../src/services/date/PostdateService");
vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate sitemap and write to file", async () => {
      const mockDates = [
        DateTime.fromISO("2023-01-01"),
        DateTime.fromISO("2023-01-02"),
      ];
      vi.mocked(PostdateService.getAllPostdates).mockResolvedValue(mockDates);

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
    });
  });
});

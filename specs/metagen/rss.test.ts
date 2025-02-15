import { writeFileSync } from "fs";
import { DateTime } from "luxon";
import { generateRSS } from "../../metagen/src/rss";
import { PostdateService } from "../../src/services/date/PostdateService";
import { PostService } from "../../src/services/post/PostService";
import type { Post } from "../../src/services/post/PostTypes";

// Mock the PostdateService, PostService, and writeFileSync
vi.mock("../../src/services/date/PostdateService");
vi.mock("../../src/services/post/PostService");
vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));

describe("rss", () => {
  describe("generateRSS", () => {
    it("should generate RSS feed and write to file", async () => {
      const mockDates = [
        DateTime.fromISO("2023-01-01"),
        DateTime.fromISO("2023-01-02"),
      ];
      const mockPosts = mockDates.map(
        (date) =>
          ({
            frontmatter: {
              title: `Post on ${date.toISODate()}`,
              date: date,
              tags: ["test"],
            },
          }) as unknown as Post,
      );

      vi.mocked(PostdateService.getAllPostdates).mockResolvedValue(mockDates);
      vi.mocked(PostService.getByPostdate).mockImplementation((date) => {
        return mockPosts.find(
          (post) => post.frontmatter.date.toISO() === date.toISO(),
        )!;
      });

      await generateRSS();

      expect(writeFileSync).toHaveBeenCalledWith(
        "../public/rss.xml",
        expect.stringContaining('version="2.0"'),
      );
      expect(writeFileSync).toHaveBeenCalledWith(
        "../public/rss.xml",
        expect.stringContaining(
          "<title><![CDATA[Post on 2023-01-01]]></title>",
        ),
      );
      expect(writeFileSync).toHaveBeenCalledWith(
        "../public/rss.xml",
        expect.stringContaining(
          "<title><![CDATA[Post on 2023-01-02]]></title>",
        ),
      );
    });
  });
});

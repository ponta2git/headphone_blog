/**
 * 記事バリデーションテスト
 *
 * 全記事のFrontmatterバリデーション、MDXコンパイル、画像存在確認、タグ整合性チェックを実行
 */

import { existsSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { getAllPostDates, getPostByDate } from "../src/posts/api";
import { TAG_DEFINITIONS } from "../src/site/tags";
import { CONTENT_CONSTANTS, TIMEZONE, LOCALE } from "../src/site/constants";
import type { Postdate } from "../src/posts/types";

/**
 * すべての記事日付を取得
 */
async function getAllPosts(): Promise<Postdate[]> {
  return await getAllPostDates();
}

/**
 * 記事日付のフォーマット
 */
function formatPostdate(postdate: Postdate): string {
  return postdate.toFormat("yyyyMMdd");
}

describe("Post Validation", () => {
  it("should find at least one post", async () => {
    const postdates = await getAllPosts();
    expect(postdates.length).toBeGreaterThan(0);
  });

  describe("All Posts", () => {
    it("should compile and validate all posts", async () => {
      const postdates = await getAllPosts();
      const errors: Array<{ postdate: string; error: string }> = [];

      for (const postdate of postdates) {
        const postdateStr = formatPostdate(postdate);

        try {
          // 記事をコンパイル（内部でMDXコンパイル、Frontmatter検証、抽出を実行）
          const post = await getPostByDate(postdate);

          // タイトルの検証
          expect(
            post.frontmatter.title,
            `[${postdateStr}] Title should exist`,
          ).toBeTruthy();
          expect(
            typeof post.frontmatter.title,
            `[${postdateStr}] Title should be a string`,
          ).toBe("string");

          // 日付の検証
          expect(
            post.frontmatter.date,
            `[${postdateStr}] Date should exist`,
          ).toBeTruthy();
          expect(
            post.frontmatter.date.isValid,
            `[${postdateStr}] Date should be valid`,
          ).toBe(true);

          // タグの検証
          expect(
            post.frontmatter.tags.length,
            `[${postdateStr}] Should have at least one tag`,
          ).toBeGreaterThan(0);

          const validTagNames = Object.keys(TAG_DEFINITIONS);
          for (const tag of post.frontmatter.tags) {
            expect(
              validTagNames,
              `[${postdateStr}] Unknown tag: "${tag.name}"`,
            ).toContain(tag.name);
          }

          // 抜粋の検証
          expect(
            post.excerpt,
            `[${postdateStr}] Excerpt should exist`,
          ).toBeTruthy();
          expect(
            post.excerpt.length,
            `[${postdateStr}] Excerpt should not be empty`,
          ).toBeGreaterThan(0);
          expect(
            post.excerpt.length,
            `[${postdateStr}] Excerpt should not exceed maximum length`,
          ).toBeLessThanOrEqual(CONTENT_CONSTANTS.EXCERPT_LENGTH);

          // OG画像の検証（存在する場合）
          if (post.ogImage) {
            const imagePath = join(process.cwd(), "public", post.ogImage);
            expect(
              existsSync(imagePath),
              `[${postdateStr}] OG image should exist: ${post.ogImage}`,
            ).toBe(true);
          }

          // コンテンツの検証
          expect(
            post.body,
            `[${postdateStr}] Content component should exist`,
          ).toBeTruthy();
          expect(
            typeof post.body,
            `[${postdateStr}] Content should be a function/component`,
          ).toBe("function");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          errors.push({
            postdate: postdateStr,
            error: errorMessage,
          });
        }
      }

      // すべてのエラーを一度に表示
      if (errors.length > 0) {
        const errorReport = errors
          .map((e) => `  - [${e.postdate}] ${e.error}`)
          .join("\n");
        throw new Error(
          `\n❌ Found ${errors.length} validation errors:\n${errorReport}`,
        );
      }
    });
  });

  describe("Individual Post Properties", () => {
    it("should have valid date format in frontmatter", async () => {
      const postdates = await getAllPosts();

      for (const postdate of postdates) {
        const post = await getPostByDate(postdate);
        const postdateStr = formatPostdate(postdate);

        // 日付のフォーマットが正しいか（yyyy-MM-dd）
        expect(
          post.frontmatter.date.toFormat("yyyy-MM-dd"),
          `[${postdateStr}] Date should be in yyyy-MM-dd format`,
        ).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // 日付がタイムゾーンに沿っているか
        const parsedDate = DateTime.fromFormat(
          post.frontmatter.date.toFormat("yyyy-MM-dd"),
          "yyyy-MM-dd",
          {
            zone: TIMEZONE,
            locale: LOCALE,
          },
        );
        expect(
          parsedDate.isValid,
          `[${postdateStr}] Date should be valid in ${TIMEZONE}`,
        ).toBe(true);
      }
    });

    it("should have at least one valid tag", async () => {
      const postdates = await getAllPosts();
      const validTagNames = Object.keys(TAG_DEFINITIONS);

      for (const postdate of postdates) {
        const post = await getPostByDate(postdate);
        const postdateStr = formatPostdate(postdate);

        expect(
          post.frontmatter.tags.length,
          `[${postdateStr}] Should have at least one tag`,
        ).toBeGreaterThan(0);

        for (const tag of post.frontmatter.tags) {
          expect(
            validTagNames,
            `[${postdateStr}] Tag "${tag.name}" should be valid`,
          ).toContain(tag.name);
        }
      }
    });

    it("should have a non-empty excerpt", async () => {
      const postdates = await getAllPosts();

      for (const postdate of postdates) {
        const post = await getPostByDate(postdate);
        const postdateStr = formatPostdate(postdate);

        expect(
          post.excerpt.trim().length,
          `[${postdateStr}] Excerpt should not be empty`,
        ).toBeGreaterThan(0);
      }
    });

    it("should have valid OG image paths if present", async () => {
      const postdates = await getAllPosts();

      for (const postdate of postdates) {
        const post = await getPostByDate(postdate);
        const postdateStr = formatPostdate(postdate);

        if (post.ogImage) {
          const imagePath = join(process.cwd(), "public", post.ogImage);
          expect(
            existsSync(imagePath),
            `[${postdateStr}] OG image file should exist: ${post.ogImage}`,
          ).toBe(true);
        }
      }
    });
  });
});

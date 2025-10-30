import { writeFileSync } from "fs";

import { DateTime } from "luxon";

import { getAllPostDates } from "../../src/posts/api";
import * as TagService from "../../src/lib/tag";
import { TIMEZONE } from "../../src/site";

async function getPostDates(): Promise<DateTime[]> {
  return (await getAllPostDates()).toReversed();
}

function formatDate(date: DateTime): string {
  return `${date.year}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;
}

function addIndex(): string {
  const date = DateTime.now().setZone(TIMEZONE);
  return `
    <url>
      <loc>https://ponta-headphone.net/</loc>
      <lastmod>${formatDate(date)}</lastmod>
    </url>
  `;
}

function addPost(date: DateTime): string {
  return `
    <url>
      <loc>https://ponta-headphone.net/posts/${date.toISODate({ format: "basic" })}</loc>
      <lastmod>${formatDate(date)}</lastmod>
    </url>
  `;
}

function addTag(slug: string): string {
  const date = DateTime.now().setZone(TIMEZONE);
  return `
    <url>
      <loc>https://ponta-headphone.net/tags/${slug}</loc>
      <lastmod>${formatDate(date)}</lastmod>
    </url>
  `;
}

async function generateSitemapContent(): Promise<string> {
  const posts = await getPostDates();
  const postUrls = posts.map(addPost).join("\n");

  // Get all tag slugs and generate URLs for them
  const tags = TagService.getAllTags();
  const tagUrls = tags.map((tag) => addTag(tag.slug)).join("\n");

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${addIndex()}
      ${postUrls}
      ${tagUrls}
    </urlset>
  `;
}

export async function generateSitemap(): Promise<void> {
  console.log("Generating sitemap...");
  const sitemapContent = await generateSitemapContent();
  writeFileSync("public/sitemap.xml", sitemapContent.trim());
  console.log("Sitemap generated.");
}

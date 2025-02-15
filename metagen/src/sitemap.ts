import { writeFileSync } from "fs";

import { DateTime } from "luxon";

import { PostdateService } from "../../src/services/date/PostdateService";

async function getAllPostDates(): Promise<DateTime[]> {
  return (await PostdateService.getAllPostdates(true)).toReversed();
}

function formatDate(date: DateTime): string {
  return `${date.year}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;
}

function addIndex(): string {
  const date = DateTime.now();
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

async function generateSitemapContent(): Promise<string> {
  const posts = await getAllPostDates();
  const postUrls = posts.map(addPost).join("\n");
  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${addIndex()}
      ${postUrls}
    </urlset>
  `;
}

export async function generateSitemap(): Promise<void> {
  console.log("Generating sitemap...");
  const sitemapContent = await generateSitemapContent();
  writeFileSync("../public/sitemap.xml", sitemapContent.trim());
  console.log("Sitemap generated.");
}

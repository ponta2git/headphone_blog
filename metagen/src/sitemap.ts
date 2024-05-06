import { writeFileSync } from "fs"

import { DateTime } from "luxon"

import { getAllPostDates } from "../../src/infrastructure/PostDatesRepository"
import { resolve } from "path"

function addIndex() {
  const date = DateTime.now()

  return (
    "<url>" +
    `<loc>https://ponta-headphone.net/</loc>` +
    `<lastmod>${date.year}-${date.month.toString().padStart(2, "0")}-${date.day
      .toString()
      .padStart(2, "0")}</lastmod>` +
    "</url>"
  )
}

function addPost(date: DateTime) {
  return (
    "<url>" +
    `<loc>https://ponta-headphone.net/posts/${date.toISODate({ format: "basic" })}</loc>` +
    `<lastmod>${date.year}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}</lastmod>` +
    "</url>"
  )
}

export async function generateSitemap() {
  const posts = await getAllPostDates(true)

  const sitemap =
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    addIndex() +
    `\n` +
    posts.map(addPost).join("\n") +
    "\n</urlset>\n"

  console.log("sitemap dir: ", resolve("../public/rss.xml"))
  writeFileSync("../public/rss.xml", sitemap)
}

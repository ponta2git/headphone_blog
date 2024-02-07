import { writeFileSync } from "fs"

import { DateTime } from "luxon"

import PostRepository from "../../src/infrastructure/PostRepository"

function addIndex() {
  const date = DateTime.now()

  return (
    "<url>" +
    `<loc>https://ponta-headphone.net/</loc>` +
    `<lastmod>${date.year}-${date.month.toString().padStart(2)}-${date.day
      .toString()
      .padStart(2)}</lastmod>` +
    "</url>"
  )
}

function addPost(date: string) {
  const year = date.slice(0, 4)
  const month = date.slice(4, 6)
  const day = date.slice(6, 8)

  return (
    "<url>" +
    `<loc>https://ponta-headphone.net/posts/${date}</loc>` +
    `<lastmod>${year}-${month}-${day}</lastmod>` +
    "</url>"
  )
}

export function generateSitemap() {
  const repo = new PostRepository("../posts")
  const posts = repo.getAllPostDates()

  const sitemap =
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    addIndex() +
    `\n` +
    posts.map(addPost).join("\n") +
    "\n</urlset>\n"

  writeFileSync("../public/sitemap.xml", sitemap)
}

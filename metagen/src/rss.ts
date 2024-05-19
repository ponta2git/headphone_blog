import { writeFileSync } from "fs"

import RSS from "rss"

import { Frontmatter, toFrontmatter } from "../../src/domain/Frontmatter"
import { getAllPostDates } from "../../src/infrastructure/PostDatesRepository"
import { findPostByDate } from "../../src/infrastructure/PostRepository"
import { siteName, siteDescription } from "../../src/siteBasic"

async function getLatest5PostMatters() {
  const postDates = (await getAllPostDates(true)).toReversed()
  const sliced = postDates.slice(0, 5)
  const files = await Promise.all(
    sliced.map((date) => findPostByDate(date, true)),
  )
  return files.map((file) => toFrontmatter(file))
}

function addRSSItem(matters: Frontmatter[], feed: RSS) {
  matters.forEach((matt) => {
    console.log(matt.date.toISO({ format: "extended", includeOffset: true })!)
    feed.item({
      title: matt.title,
      description: matt.title,
      url: `https://ponta-headphone.net/posts/${matt.date.toISODate({ format: "basic" })}`,
      date: matt.date.toISODate({ format: "extended" })!,
    })
  })
}

function generateNewRSS() {
  return new RSS({
    title: siteName,
    description: siteDescription,
    site_url: "https://ponta-headphone.net/",
    feed_url: "https://ponta-headphone.net/rss.xml",
    language: "ja",
  })
}

export async function generateRSS() {
  const feed = generateNewRSS()
  const posts = await getLatest5PostMatters()

  addRSSItem(posts, feed)

  writeFileSync("../public/rss.xml", feed.xml())
}

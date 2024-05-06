import { writeFileSync } from "fs"

import RSS from "rss"

import { Post } from "../../src/domain/Post"
import { getAllPostDates } from "../../src/infrastructure/PostDatesRepository"
import { findPostBy } from "../../src/infrastructure/PostRepository"
import { siteName, siteDescription } from "../../src/siteBasic"

async function getLatest5Posts() {
  const postDates = (await getAllPostDates(true)).toReversed()
  const sliced = postDates.slice(0, 5)
  return await Promise.all(sliced.map((date) => findPostBy(date, true)))
}

function addRSSItem(posts: Post[], feed: RSS) {
  posts.forEach((post) => {
    feed.item({
      title: post.frontmatter.title,
      description: post.excerpt,
      url: `https://ponta-headphone.net/posts/${post.frontmatter.date.toISODate({ format: "basic" })}`,
      date: post.frontmatter.date.toISODate()!,
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
  const posts = await getLatest5Posts()

  addRSSItem(posts, feed)

  console.log("rss dir: ", __dirname)
  writeFileSync("rss.xml", feed.xml())
}

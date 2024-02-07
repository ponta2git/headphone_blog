import { writeFileSync } from "fs"

import RSS from "rss"

import { Post } from "../../src/domain/Post"
import PostRepository from "../../src/infrastructure/PostRepository"
import { siteName, siteDescription } from "../../src/siteBasic"

async function getLatest5Posts() {
  const repo = new PostRepository("../posts")
  const posts = (await repo.getAllPosts()).reverse()

  return posts.slice(0, 5)
}

function addRSSItem(posts: Post[], feed: RSS) {
  posts.forEach((post) => {
    feed.item({
      title: post.frontmatter.title,
      description: post.excerpt,
      url: `https://ponta-headphone.net/posts/${post.frontmatter.date.replaceAll(
        "-",
        "",
      )}`,
      date: post.frontmatter.date,
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

  writeFileSync("../public/rss.xml", feed.xml())
}

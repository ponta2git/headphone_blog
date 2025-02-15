import { writeFileSync } from "fs";

import RSS from "rss";

import { MetaInfo } from "../../src/MetaInfo";
import { PostdateService } from "../../src/services/date/PostdateService";
import { PostService } from "../../src/services/post/PostService";

import type { Post } from "../../src/services/post/PostTypes";

async function getLatest5PostMatters() {
  const all = (await PostdateService.getAllPostdates(true)).toReversed();
  const sliced = all.slice(0, Math.min(5, all.length));

  const posts = await Promise.all(
    sliced.map((date) => PostService.getByPostdate(date)),
  );
  return posts.map((file) => file.frontmatter);
}

function addRSSItem(matters: Post["frontmatter"][], feed: RSS) {
  matters.forEach((matt) => {
    feed.item({
      title: matt.title,
      description: matt.title,
      url: `https://ponta-headphone.net/posts/${matt.date.toISODate({ format: "basic" })}`,
      date: matt.date.toISODate({ format: "extended" })!,
    });
  });
}

function generateNewRSS() {
  return new RSS({
    title: MetaInfo.siteInfo.name,
    description: MetaInfo.siteInfo.description,
    site_url: "https://ponta-headphone.net/",
    feed_url: "https://ponta-headphone.net/rss.xml",
    language: "ja",
  });
}

export async function generateRSS() {
  console.log("Generating RSS...");
  const feed = generateNewRSS();
  const posts = await getLatest5PostMatters();

  addRSSItem(posts, feed);

  writeFileSync("../public/rss.xml", feed.xml());
  console.log("RSS generated.");
}

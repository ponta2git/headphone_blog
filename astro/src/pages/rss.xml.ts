import rss from "@astrojs/rss";
import { getPosts } from "../lib/posts";
import { postPath, publishedAt, site } from "../lib/blog";

export async function GET() {
  return rss({
    title: site.name,
    description: site.description,
    site: site.url,
    trailingSlash: false,
    customData: "<language>ja</language>",
    items: (await getPosts()).slice(0, 5).map((post) => ({
      title: post.title,
      link: postPath(post.date),
      description: post.excerpt,
      pubDate: new Date(publishedAt(post.date)),
    })),
  });
}

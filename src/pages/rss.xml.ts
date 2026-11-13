import rss from "@astrojs/rss";
import { getPostCatalog } from "../infrastructure/content/posts";
import { postPath, publishedAt } from "../domain/posts";
import { site } from "../config/site";

export async function GET() {
  return rss({
    title: site.name,
    description: site.description,
    site: site.url,
    trailingSlash: false,
    customData: "<language>ja</language>",
    items: (await getPostCatalog()).latest().map((post) => ({
      title: post.title,
      link: postPath(post.date),
      description: post.excerpt,
      pubDate: new Date(publishedAt(post.date)),
    })),
  });
}

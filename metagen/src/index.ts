import { generateRSS } from "./rss"
import { generateSitemap } from "./sitemap"
void (async () => {
  await Promise.all([generateRSS(), generateSitemap()])
})()

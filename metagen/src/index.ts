import { generateRSS } from "./rss";
import { generateSitemap } from "./sitemap";

// change current directory to the upper directory.
process.chdir("../");

(async () => {
  await Promise.all([generateRSS(), generateSitemap()]);
})();

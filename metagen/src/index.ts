import { generateRSS } from "./rss";
import { generateSitemap } from "./sitemap";

// change current directory to the upper directory.
process.chdir("../");

void (async () => {
  try {
    await Promise.all([generateRSS(), generateSitemap()]);
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    process.exit(1);
  }
})();

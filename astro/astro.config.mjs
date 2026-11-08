import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";

import { remarkBlog } from "./src/lib/markdown.ts";

export default defineConfig({
  site: "https://ponta-headphone.net",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  publicDir: "../public",
  markdown: {
    processor: unified({ remarkPlugins: [remarkBlog], smartypants: false }),
  },
  image: {
    layout: "constrained",
    breakpoints: [320, 480, 640, 800, 1200, 1600],
  },
  // The legacy Next.js PostCSS configuration belongs to the parent package.
  vite: { css: { postcss: { plugins: [] } } },
});

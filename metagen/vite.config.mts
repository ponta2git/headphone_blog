import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: "src/index.ts",
      name: "metagen",
      fileName: "index.js",
    },
  },
});

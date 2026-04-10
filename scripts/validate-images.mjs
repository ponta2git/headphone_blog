#!/usr/bin/env node
/* global process, console */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const POSTS_DIR = resolve(ROOT, "posts");
const PUBLIC_DIR = resolve(ROOT, "public");

const mdxFiles = [];
function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = resolve(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && e.name.endsWith(".mdx")) mdxFiles.push(full);
  }
}

walk(POSTS_DIR);

const warnings = [];
const failures = [];

const IMAGE_RE = /!\[(.*?)\]\(([^)]+)\)/g; // markdown image ![alt](src)

for (const file of mdxFiles) {
  const rel = file.replace(ROOT + "/", "");
  const src = readFileSync(file, "utf-8");
  let m;
  let firstImageUrl = null;
  while ((m = IMAGE_RE.exec(src))) {
    const alt = (m[1] || "").trim();
    const url = m[2].trim();

    if (!alt) {
      warnings.push(`[Alt] Missing alt text in ${rel} -> ${url}`);
    }

    // Expect absolute path under /images/** for public assets
    if (!url.startsWith("/")) {
      warnings.push(
        `[Path] Prefer absolute URL rooted at / for images: ${rel} -> ${url}`,
      );
      continue;
    }

    const abs = resolve(PUBLIC_DIR, url.slice(1));
    if (!existsSync(abs)) {
      failures.push(`[Missing] Image not found: ${rel} -> ${url}`);
      continue;
    }

    // Check extension (prefer webp/avif)
    const lc = abs.toLowerCase();
    if (!lc.endsWith(".webp") && !lc.endsWith(".avif")) {
      warnings.push(`[Format] Consider WebP/AVIF for: ${rel} -> ${url}`);
    }

    // Mark first image (likely hero/LCP candidate)
    if (!firstImageUrl) firstImageUrl = url;

    // Size sanity
    try {
      const st = statSync(abs);
      const mb = st.size / 1024 / 1024;
      // Tighter threshold for first image in the document (potential LCP)
      const threshold = url === firstImageUrl ? 0.5 : 1.5; // MB
      if (mb > threshold) {
        const tag = url === firstImageUrl ? "[LCP]" : "[Size]";
        const note =
          url === firstImageUrl
            ? `First image likely to affect LCP (>${threshold}MB)`
            : `Large image (>${threshold}MB)`;
        warnings.push(
          `${tag} ${note}: ${mb.toFixed(2)}MB at ${url} referenced from ${rel}`,
        );
      }
    } catch (e) {
      warnings.push(
        `[Stat] Could not stat image: ${url} (${e && e.message ? e.message : "unknown error"})`,
      );
    }
  }
}

if (failures.length) {
  console.error(
    "❌ image validation failed:\n" + failures.map((s) => ` - ${s}`).join("\n"),
  );
  if (warnings.length) {
    console.warn(
      "\n⚠️ image validation warnings:\n" +
        warnings.map((s) => ` - ${s}`).join("\n"),
    );
  }
  process.exit(1);
}

if (warnings.length) {
  console.warn(
    "⚠️ image validation warnings:\n" +
      warnings.map((s) => ` - ${s}`).join("\n"),
  );
}

console.log("✅ validate-images: OK");

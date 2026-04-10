#!/usr/bin/env node
/* global process, console */
// Simple SEO validator: checks canonical, OG/Twitter tags, and JSON-LD presence
// Run after a static export build. Exits non-zero on failure.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const outDir = resolve(process.cwd(), "out");

function fail(msg) {
  console.error(`❌ validate-seo: ${msg}`);
  process.exitCode = 1;
}

function readHtml(path) {
  return readFileSync(path, "utf8");
}

function assertCanonical(html, expectedPath) {
  const re = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i;
  const m = html.match(re);
  if (!m) return fail(`${expectedPath}: canonical link missing`);
  const href = m[1];
  if (!href.startsWith("https://"))
    return fail(`${expectedPath}: canonical is not absolute: ${href}`);
}

function assertOpenGraph(html, expectedPath) {
  const needed = ["og:title", "og:description", "og:url", "og:type"];
  for (const prop of needed) {
    const re = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]*>`, "i");
    if (!re.test(html)) fail(`${expectedPath}: missing ${prop}`);
  }
}

function assertTwitter(html, expectedPath) {
  const needed = ["twitter:card", "twitter:title", "twitter:description"];
  for (const name of needed) {
    const re = new RegExp(`<meta[^>]+name=["']${name}["'][^>]*>`, "i");
    if (!re.test(html)) fail(`${expectedPath}: missing ${name}`);
  }
}

function assertJsonLd(html, expectedPath) {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i;
  if (!re.test(html)) fail(`${expectedPath}: missing JSON-LD script`);
}

function walkPostsDir() {
  const postsDir = join(outDir, "posts");
  let files = [];
  try {
    for (const name of readdirSync(postsDir)) {
      const p = join(postsDir, name, "index.html");
      try {
        if (statSync(p).isFile()) files.push(p);
      } catch {
        // ignore invalid entries
      }
    }
  } catch {
    // no posts dir; ignore
  }
  return files;
}

function validatePage(relPath, { requireJsonLd = false } = {}) {
  const full = join(outDir, relPath);
  const html = readHtml(full);
  assertCanonical(html, relPath);
  assertOpenGraph(html, relPath);
  assertTwitter(html, relPath);
  if (requireJsonLd) assertJsonLd(html, relPath);
}

try {
  // Home
  validatePage("index.html");
  // Tags index (Next export may emit tags.html or tags/index.html)
  try {
    validatePage("tags/index.html");
  } catch {
    validatePage("tags.html");
  }
  // A tag detail page (best-effort)
  const tagIndex = join(outDir, "tags");
  try {
    for (const slug of readdirSync(tagIndex)) {
      const p = join("tags", slug, "index.html");
      try {
        if (statSync(join(outDir, p)).isFile()) {
          validatePage(p);
          break;
        }
      } catch {
        // ignore non-directories
      }
    }
  } catch {
    // ignore if tags directory is absent
  }
  // Posts: validate all found (JSON-LD required)
  const postPages = walkPostsDir();
  for (const p of postPages) {
    const rel = p.replace(outDir + "/", "");
    validatePage(rel, { requireJsonLd: true });
  }

  if (process.exitCode) {
    console.error("❌ validate-seo: FAILED");
    process.exit(process.exitCode);
  } else {
    console.log("✅ validate-seo: OK");
  }
} catch (e) {
  console.error("❌ validate-seo: Exception:", e);
  process.exit(1);
}

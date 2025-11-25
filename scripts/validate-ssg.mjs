#!/usr/bin/env node
/* eslint-env node */
/* eslint no-undef: 0 */
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(path) {
  const p = resolve(process.cwd(), path);
  return readFileSync(p, "utf-8");
}

// 1) Posts route: dynamicParams=false and generateStaticParams present
{
  const file = "src/app/posts/[postdate]/page.tsx";
  const src = read(file);
  assert(
    /export\s+const\s+dynamicParams\s*=\s*false/.test(src),
    `[SSG] ${file} must export 'dynamicParams = false'`,
  );
  assert(
    /export\s+async\s+function\s+generateStaticParams\s*\(/.test(src),
    `[SSG] ${file} must export 'generateStaticParams'`,
  );
}

// 2) Layout: generateMetadata function exists (static metadata path)
{
  const file = "src/app/layout.tsx";
  const src = read(file);
  assert(
    /export\s+function\s+generateMetadata\s*\(/.test(src),
    `[Meta] ${file} must export 'generateMetadata'`,
  );
}

// 3) Generated files basic sanity (to be run after metagen)
{
  const rssPath = resolve(process.cwd(), "public", "rss.xml");
  const sitemapPath = resolve(process.cwd(), "public", "sitemap.xml");
  assert(existsSync(rssPath), "[Metagen] public/rss.xml must exist");
  assert(existsSync(sitemapPath), "[Metagen] public/sitemap.xml must exist");

  const rss = readFileSync(rssPath, "utf-8");
  const sm = readFileSync(sitemapPath, "utf-8");
  assert(/<rss[\s>]/.test(rss), "[Metagen] rss.xml should contain <rss> root");
  assert(
    /<urlset[\s>]/.test(sm),
    "[Metagen] sitemap.xml should contain <urlset> root",
  );
}

console.log("✅ validate-ssg: OK");

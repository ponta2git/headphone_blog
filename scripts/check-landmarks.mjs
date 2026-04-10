#!/usr/bin/env node
/* global process, console */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

function read(path) {
  const p = resolve(process.cwd(), path);
  return readFileSync(p, "utf-8");
}

function contains(file, pattern) {
  const src = read(file);
  return pattern.test(src);
}

const failures = [];

// 1) Header landmark in SiteHeader
try {
  const headerFile = "src/components/features/SiteHeader/SiteHeader.tsx";
  if (!contains(headerFile, /<header[\s>]/)) {
    failures.push(
      `[Landmarks] ${headerFile} should include a <header> element`,
    );
  }
} catch (e) {
  failures.push(`[Landmarks] Failed to read SiteHeader: ${e.message}`);
}

// 2) Footer landmark in SiteFooter
try {
  const footerFile = "src/components/features/SiteFooter/SiteFooter.tsx";
  if (!contains(footerFile, /<footer[\s>]/)) {
    failures.push(
      `[Landmarks] ${footerFile} should include a <footer> element`,
    );
  }
  // Icon-only links should have aria-label
  const footerSrc = read(footerFile);
  const iconLinkOpenTags =
    footerSrc.match(
      /<[A-Za-z][A-Za-z0-9]*\b[^>]*className=\{styles\.iconLink\}[^>]*>/g,
    ) || [];

  for (const tag of iconLinkOpenTags) {
    if (!/\baria-label\s*=/.test(tag)) {
      const preview = tag.replace(/\s+/g, " ").trim();
      failures.push(`[A11y] Footer icon link missing aria-label: ${preview}`);
    }
  }
} catch (e) {
  failures.push(`[Landmarks] Failed to read SiteFooter: ${e.message}`);
}

// 3) Main landmark in PageLayout
try {
  const mainFile = "src/components/layouts/PageLayout/PageLayout.tsx";
  if (!contains(mainFile, /<main[\s>]/)) {
    failures.push(`[Landmarks] ${mainFile} should include a <main> element`);
  }
} catch (e) {
  failures.push(`[Landmarks] Failed to read PageLayout: ${e.message}`);
}

// 4) At least one <nav> somewhere in components (e.g., neighbours nav)
try {
  const targetDir = resolve(process.cwd(), "src/components");
  const stack = [targetDir];
  let navFound = false;
  while (stack.length && !navFound) {
    const dir = stack.pop();
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = resolve(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (ent.isFile() && /\.(t|j)sx?$/.test(ent.name)) {
        const src = read(full);
        if (/<nav[\s>]/.test(src)) {
          navFound = true;
          break;
        }
      }
    }
  }
  if (!navFound) {
    failures.push("[Landmarks] No <nav> landmark found in components");
  }
} catch (e) {
  failures.push(
    `[Landmarks] Failed while scanning components for <nav>: ${e.message}`,
  );
}

if (failures.length) {
  console.error(
    "❌ landmarks check failed:\n" + failures.map((s) => ` - ${s}`).join("\n"),
  );
  process.exit(1);
}

console.log("✅ landmarks check: OK");

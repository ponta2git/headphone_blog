import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { load } from "cheerio";
import ts from "typescript";
import { describe, expect, it } from "vitest";

// A project budget, not an ISO threshold. The original DOM enhancements use
// 842 uncompressed bytes; 4 KiB leaves room for fixes without a UI runtime.
const javascriptBudget = 4 * 1024;
const dist = path.resolve("dist");
assert.ok(existsSync(dist), "Run pnpm build before the output checks");

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

const files = filesIn(dist);
const home = load(readFileSync(path.join(dist, "index.html"), "utf8"));
const canonical = home("link[rel=canonical]").attr("href");
assert.ok(canonical, "The home page must identify the public site origin");
const origin = new URL(canonical).origin;
const pages = files
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    const relative = path.relative(dist, file).split(path.sep).join("/");
    const route =
      relative === "index.html"
        ? "/"
        : `/${relative.replace(/\.html$/, "").replace(/\/index$/, "/")}`;
    const select = load(readFileSync(file, "utf8"));
    const ids = select("[id]")
      .map((_, element) => select(element).attr("id") ?? "")
      .get();
    return { route, url: new URL(route, origin), select, ids };
  });

function localFile(url: URL): string {
  const file = path.resolve(dist, `.${decodeURIComponent(url.pathname)}`);
  assert.ok(file.startsWith(`${dist}${path.sep}`), "Asset escapes dist");
  assert.ok(existsSync(file) && statSync(file).isFile(), `Missing ${url.href}`);
  return file;
}

function localUrl(value: string, base: URL): URL | undefined {
  const url = new URL(value, base);
  return url.origin === origin ? url : undefined;
}

function pageAt(url: URL) {
  const route = decodeURIComponent(url.pathname).replace(/\.html$/, "");
  return pages.find(
    (page) => page.route === route || page.route === `${route}/`,
  );
}

/** Count emitted modules once, including statically referenced dependencies. */
function javascriptBytes(page: (typeof pages)[number]): number {
  const visited = new Set<string>();
  function moduleBytes(url: URL): number {
    if (visited.has(url.href)) return 0;
    visited.add(url.href);
    return sourceBytes(readFileSync(localFile(url), "utf8"), url);
  }
  function sourceBytes(source: string, base: URL): number {
    let bytes = Buffer.byteLength(source);
    const tree = ts.createSourceFile(
      base.pathname,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.JS,
    );
    function visit(node: ts.Node) {
      let specifier: ts.Node | undefined;
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        specifier = node.moduleSpecifier;
      } else if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword
      ) {
        specifier = node.arguments[0];
        assert.ok(
          specifier && ts.isStringLiteralLike(specifier),
          `${base.pathname}: dynamic imports must have measurable asset paths`,
        );
      }
      if (specifier && ts.isStringLiteralLike(specifier)) {
        const url = localUrl(specifier.text, base);
        if (url) bytes += moduleBytes(url);
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
    return bytes;
  }
  let bytes = 0;
  page.select("script").each((_, element) => {
    const script = page.select(element);
    const type = script.attr("type") ?? "text/javascript";
    if (!["module", "text/javascript", "application/javascript"].includes(type))
      return;
    const src = script.attr("src");
    if (src) {
      const url = localUrl(src, page.url);
      if (url) bytes += moduleBytes(url);
    } else {
      bytes += sourceBytes(script.html() ?? "", page.url);
    }
  });
  page.select('link[rel="modulepreload"][href]').each((_, element) => {
    const url = localUrl(page.select(element).attr("href")!, page.url);
    if (url) bytes += moduleBytes(url);
  });
  return bytes;
}

describe("quality contracts for every generated page", () => {
  it("keeps readable static pages, landmarks and progressive enhancements", () => {
    expect(pages.length).toBeGreaterThan(0);
    expect(existsSync(path.join(dist, "server"))).toBe(false);
    for (const { route, select, ids } of pages) {
      expect(select("astro-island, astro-server-island"), route).toHaveLength(
        0,
      );
      expect(select("body > header"), route).toHaveLength(1);
      expect(select("body > footer"), route).toHaveLength(1);
      expect(select("main"), route).toHaveLength(1);
      expect(select("main h1"), route).toHaveLength(1);
      expect(select("main").text().trim().length, route).toBeGreaterThan(0);
      expect(select('a.skip-link[href="#main"]'), route).toHaveLength(1);
      expect(select("main#main").attr("tabindex"), route).toBe("-1");
      expect(select("#top").attr("tabindex"), route).toBe("-1");
      expect(new Set(ids).size, `${route}: duplicate IDs`).toBe(ids.length);
      expect(ids, route).not.toContain("");
      select("nav").each((_, element) => {
        const nav = select(element);
        expect(
          nav.attr("aria-label") || nav.attr("aria-labelledby"),
          `${route}: navigation needs an accessible name`,
        ).toBeTruthy();
      });
      select("button[data-copy-url]").each((_, element) => {
        const button = select(element);
        expect(button.attr("hidden"), route).toBeDefined();
        expect(button.attr("type"), route).toBe("button");
        const status = select("[id]").filter(
          (_, node) =>
            select(node).attr("id") === button.attr("aria-describedby"),
        );
        expect(status.attr("role"), route).toBe("status");
        expect(status.attr("aria-live"), route).toBe("polite");
      });
    }
  });

  it("resolves local links, fragments and accessible-name references", () => {
    for (const page of pages) {
      const { route, select, ids } = page;
      select("a[href]").each((_, element) => {
        const href = select(element).attr("href")!;
        const url = localUrl(href, page.url);
        if (!url) return;
        const target = pageAt(url);
        if (!target) {
          localFile(url);
          return;
        }
        const fragment = decodeURIComponent(
          url.hash.slice(1).split(":~:text=")[0],
        );
        if (fragment)
          expect(target.ids, `${route} links to ${href}`).toContain(fragment);
      });
      for (const attribute of ["aria-labelledby", "aria-describedby"]) {
        select(`[${attribute}]`).each((_, element) => {
          const references = select(element).attr(attribute)!.trim();
          expect(references, `${route}: empty ${attribute}`).not.toBe("");
          for (const id of references.split(/\s+/))
            expect(ids, `${route}: ${attribute}=${id}`).toContain(id);
        });
      }
    }
  });

  it("ships every referenced local script, stylesheet and image", () => {
    for (const { url, select } of pages) {
      select(
        "script[src], img[src], source[src], link[rel=stylesheet][href], link[rel=icon][href], link[rel=modulepreload][href]",
      ).each((_, element) => {
        const asset =
          select(element).attr("src") ?? select(element).attr("href");
        assert.ok(asset);
        const resolved = localUrl(asset, url);
        if (resolved) localFile(resolved);
      });
      select("img[srcset], source[srcset]").each((_, element) => {
        const srcset = select(element).attr("srcset")!;
        if (srcset.startsWith("data:")) return;
        for (const candidate of srcset.split(",")) {
          const resolved = localUrl(candidate.trim().split(/\s+/)[0], url);
          if (resolved) localFile(resolved);
        }
      });
    }
  });

  it("keeps each page within the 4 KiB first-party JavaScript budget", () => {
    for (const page of pages)
      expect(javascriptBytes(page), page.route).toBeLessThanOrEqual(
        javascriptBudget,
      );
  });
});

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { imageMetadata } from "astro/assets/utils";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";

interface BaselinePost {
  id: string;
  url: string;
  title: string;
  date: string;
  tags: { name: string; slug: string }[];
  renderedBodyLinks: { text: string; href: string }[];
  markdownImages: { alt: string; url: string }[];
  renderedTableCount: number;
  renderedCodeBlockCount: number;
}
const baseline: {
  posts: BaselinePost[];
  representativePostIds: string[];
  assets: { url: string; sha256: string; width: number; height: number }[];
} = JSON.parse(
  readFileSync(
    new URL("../../../docs/astro-migration/baseline.json", import.meta.url),
    "utf8",
  ),
);
const dist = path.resolve("dist");
const html = (route: string) =>
  load(
    readFileSync(
      path.join(dist, route === "/" ? "index.html" : `${route}.html`),
      "utf8",
    ),
  );
const representatives = baseline.posts.filter((post) =>
  baseline.representativePostIds.includes(post.id),
);
const orderedIds = ["20250518", "20250330", "20240421", "20231211", "20220626"];
const routes = [
  "/",
  "/all-articles",
  "/tags",
  "/tags/system",
  "/tags/purchase",
  "/tags/try",
  "/tags/headphones",
  ...orderedIds.map((id) => `/posts/${id}`),
];

describe("static output contract", () => {
  it("emits every prototype page with canonical URLs and valid JSON-LD", () => {
    for (const route of routes) {
      const $ = html(route);
      expect($("html").attr("lang")).toBe("ja");
      expect($("h1")).toHaveLength(1);
      expect($("title").text()).toContain("pontaのヘッドホンブログ");
      expect($("link[rel=canonical]").attr("href")).toBe(
        `https://ponta-headphone.net${route}`,
      );
      expect($("meta[property='og:url']").attr("content")).toBe(
        `https://ponta-headphone.net${route}`,
      );
      expect($("meta[name=description]").attr("content")).toBeTruthy();
      expect($("meta[name=robots]").attr("content")).toBe("noindex, nofollow");
      expect($("script[type='application/ld+json']")).toHaveLength(1);
      expect(
        JSON.parse($("script[type='application/ld+json']").text())["@context"],
      ).toBe("https://schema.org");
      expect($("astro-island, meta[name=json-ld]")).toHaveLength(0);
    }
    expect(readFileSync(path.join(dist, "robots.txt"), "utf8")).toContain(
      "Disallow: /",
    );
    expect(existsSync(path.join(dist, "server"))).toBe(false);
  });

  it.each(representatives)(
    "preserves article information and body structures: $id",
    (post) => {
      const $ = html(post.url);
      expect($("h1").text()).toBe(post.title);
      expect($(".article-heading time").attr("datetime")).toBe(post.date);
      expect(
        $(".article-heading .tags a")
          .map((_, el) => $(el).text())
          .get(),
      ).toEqual(post.tags.map((tag) => tag.name));
      expect(
        $(".article-heading .tags a")
          .map((_, el) => $(el).attr("href"))
          .get(),
      ).toEqual(post.tags.map((tag) => `/tags/${tag.slug}`));
      expect($(".prose table")).toHaveLength(post.renderedTableCount);
      expect($(".prose pre")).toHaveLength(post.renderedCodeBlockCount);
      expect(
        $(".prose img")
          .map((_, el) => $(el).attr("alt"))
          .get(),
      ).toEqual(post.markdownImages.map((img) => img.alt));
      expect(
        $(".prose a")
          .map((_, el) => $(el).attr("href"))
          .get(),
      ).toEqual(
        post.renderedBodyLinks.map((link) =>
          link.href === "posts/20230210" ? "/posts/20230210" : link.href,
        ),
      );
      expect($(".prose h1, Info, Warning, Postscript")).toHaveLength(0);
      const ld = JSON.parse($("script[type='application/ld+json']").text());
      expect(ld["@type"]).toBe("BlogPosting");
      expect(ld.headline).toBe(post.title);
      expect(ld.datePublished).toBe(`${post.date}T00:00:00+09:00`);
      expect($("meta[property='article:published_time']").attr("content")).toBe(
        ld.datePublished,
      );
    },
  );

  it("keeps headings nested, alert content and the postscript date", () => {
    const $ = html("/posts/20250518");
    expect(
      $(".prose h2,.prose h3,.prose h4")
        .map((_, el) => el.tagName)
        .get(),
    ).toEqual(["h2", "h3", "h4", "h4"]);
    expect($(".callout-warning").text()).toContain("一切保証いたしません");
    expect($(".callout-note").text()).toContain("Windows 11 Pro 23H2");
    expect(html("/posts/20220626")(".prose").text()).toContain(
      "追記：2024/5/19",
    );
  });

  it("shares the same excerpts across lists, metadata, JSON-LD and RSS", () => {
    const home = html("/");
    const archive = html("/all-articles");
    const feed = load(readFileSync(path.join(dist, "rss.xml"), "utf8"), {
      xml: true,
    });
    expect(
      home(".post-summary")
        .map((_, el) => home(el).attr("data-post-id"))
        .get(),
    ).toEqual(orderedIds);
    expect(feed("item")).toHaveLength(5);
    expect(
      feed("item > link")
        .map((_, el) => feed(el).text().split("/").at(-1))
        .get(),
    ).toEqual(orderedIds);
    for (const post of representatives) {
      const $ = html(post.url);
      const excerpt = $("meta[name=description]").attr("content");
      const item = feed("item").filter(
        (_, el) =>
          feed(el).find("link").text() ===
          `https://ponta-headphone.net${post.url}`,
      );
      expect(item).toHaveLength(1);
      expect(item.find("guid").text()).toBe(
        `https://ponta-headphone.net${post.url}`,
      );
      expect(item.find("title").text()).toBe(post.title);
      expect(item.find("description").text()).toBe(excerpt);
      expect(home(`[data-post-id='${post.id}'] .excerpt`).text()).toBe(excerpt);
      expect(archive(`[data-post-id='${post.id}'] .excerpt`).text()).toBe(
        excerpt,
      );
      expect(
        JSON.parse($("script[type='application/ld+json']").text()).description,
      ).toBe(excerpt);
      expect($("meta[property='og:description']").attr("content")).toBe(
        excerpt,
      );
      const [year, month, day] = post.date.split("-").map(Number);
      expect(new Date(item.find("pubDate").text()).getTime()).toBe(
        Date.UTC(year, month - 1, day) - 9 * 60 * 60 * 1000,
      );
    }
    const system = html("/tags/system");
    expect(
      system(".post-summary")
        .map((_, el) => system(el).attr("data-post-id"))
        .get(),
    ).toEqual(["20250518", "20231211", "20220626"]);
    for (const id of ["20250518", "20231211", "20220626"])
      expect(system(`[data-post-id='${id}'] .excerpt`).text()).toBe(
        home(`[data-post-id='${id}'] .excerpt`).text(),
      );
  });

  it("builds actual responsive images without upscaling and retains legacy image bytes", async () => {
    for (const post of representatives) {
      const $ = html(post.url);
      for (const [index, original] of post.markdownImages.entries()) {
        const asset = baseline.assets.find(
          (item) => item.url === original.url,
        )!;
        const img = $(".prose img").eq(index);
        expect(Number(img.attr("width"))).toBe(asset.width);
        expect(Number(img.attr("height"))).toBe(asset.height);
        expect(img.attr("sizes")).toBe(
          "(min-width: 800px) 768px, calc(100vw - 32px)",
        );
        const variants = img
          .attr("srcset")!
          .split(",")
          .map((item) => item.trim().split(/\s+/));
        expect(variants.length).toBeGreaterThan(1);
        for (const [src, descriptor] of variants) {
          const width = Number.parseInt(descriptor);
          const dimensions = await imageMetadata(
            readFileSync(path.join(dist, src)),
          );
          expect(dimensions.width).toBe(width);
          expect(width).toBeLessThanOrEqual(asset.width);
          expect(
            Math.abs(dimensions.height - (width * asset.height) / asset.width),
          ).toBeLessThanOrEqual(1);
        }
        expect(
          createHash("sha256")
            .update(readFileSync(path.join(dist, original.url)))
            .digest("hex"),
        ).toBe(asset.sha256);
      }
    }
  });

  it("uses explicit OGP images and the common fallback with real dimensions", async () => {
    for (const id of orderedIds) {
      const $ = html(`/posts/${id}`);
      const url = $("meta[property='og:image']").attr("content")!;
      const src = new URL(url).pathname;
      expect(
        src.startsWith(
          id === "20240421" ? "/_astro/20240421" : "/images/logo.webp",
        ),
      ).toBe(true);
      const metadata = await imageMetadata(readFileSync(path.join(dist, src)));
      expect(Number($("meta[property='og:image:width']").attr("content"))).toBe(
        metadata.width,
      );
      expect(
        Number($("meta[property='og:image:height']").attr("content")),
      ).toBe(metadata.height);
    }
  });

  it("has no broken local links except the article deliberately outside the prototype", () => {
    const absent = new Set<string>();
    for (const route of routes) {
      const $ = html(route);
      for (const href of $("a[href]")
        .map((_, el) => $(el).attr("href")!)
        .get()) {
        if (!href.startsWith("/")) continue;
        const pathname = new URL(href, "https://ponta-headphone.net").pathname;
        if (
          !routes.includes(pathname) &&
          !existsSync(path.join(dist, pathname))
        )
          absent.add(pathname);
      }
    }
    expect([...absent]).toEqual(["/posts/20230210"]);
    expect(readdirSync(dist).some((file) => file.startsWith("_next"))).toBe(
      false,
    );
  });
});

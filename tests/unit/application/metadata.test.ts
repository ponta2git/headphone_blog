import { describe, expect, it } from "vitest";
import {
  buildArticleMetadata,
  buildPageMetadata,
} from "../../../src/application/metadata";
import { site } from "../../../src/config/site";

describe("publication metadata", () => {
  it("uses the same canonical origin, description and fallback image for every page", () => {
    const home = buildPageMetadata({ path: "/" });
    expect(home.pageTitle).toBe(site.name);
    expect(home.canonical).toBe(`${site.url}/`);
    expect(home.description).toBe(site.description);
    expect(home.imageUrl).toBe(`${site.url}/images/logo.webp`);
    expect(home.image).toMatchObject({ width: 512, height: 286 });
    expect(JSON.parse(home.structuredData)["@type"]).toBe("WebSite");
    const collection = buildPageMetadata({ path: "/tags", title: "タグ" });
    expect(collection.pageTitle).toBe(`タグ | ${site.name}`);
    expect(JSON.parse(collection.structuredData)).toMatchObject({
      "@type": "CollectionPage",
      name: "タグ",
      url: `${site.url}/tags`,
    });
  });

  it("shares the article identity and JST publication date across metadata and share URLs", () => {
    const post = {
      id: "20261113",
      title: "A & B / 日本語",
      date: "2026-11-13",
      tags: ["雑談"],
      excerpt: "要約",
    };
    const image = { src: "/_astro/example.webp", width: 800, height: 600 };
    const article = buildArticleMetadata(post, image);
    const metadata = buildPageMetadata(article.page);
    const schema = JSON.parse(metadata.structuredData);
    expect(metadata.canonical).toBe(`${site.url}/posts/20261113`);
    expect(metadata.published).toBe("2026-11-13T00:00:00+09:00");
    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: metadata.published,
      url: metadata.canonical,
      mainEntityOfPage: metadata.canonical,
      image: metadata.imageUrl,
    });
    expect(metadata.image).toEqual(image);
    const share = new URL(article.shareUrl);
    expect(share.searchParams.get("url")).toBe(metadata.canonical);
    expect(share.searchParams.get("text")).toBe(`${post.title}: ${site.name}`);
    expect(buildPageMetadata(buildArticleMetadata(post).page).imageUrl).toBe(
      `${site.url}/images/logo.webp`,
    );
  });

  it("cannot close a JSON-LD script with article text and retains the original text after parsing", () => {
    const title = '</script><script>alert("example")</script>';
    const metadata = buildPageMetadata({
      path: "/",
      title,
      description: "<本文> & 引用",
    });
    expect(metadata.structuredData).not.toContain("<");
    expect(JSON.parse(metadata.structuredData).name).toBe(title);
    expect(JSON.parse(metadata.structuredData).description).toBe(
      "<本文> & 引用",
    );
  });
});

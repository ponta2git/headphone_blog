import { siteConfig } from "../../site";
import type { Post } from "../types";

/**
 * ブログポスト用のJSON-LD構造化データを生成
 *
 * @param post - 記事データ
 * @returns JSON-LD オブジェクト
 */
export function generateBlogPostingSchema(post: Post) {
  const { frontmatter, excerpt, ogImage } = post;
  const dateStr = frontmatter.date.toFormat("yyyyMMdd");
  const url = `${siteConfig.url}/posts/${dateStr}`;
  const publishedTime = frontmatter.date.toISO() || "";

  const imageUrl = ogImage
    ? `${siteConfig.url}${ogImage}`
    : `${siteConfig.url}/images/og-default.png`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: excerpt || siteConfig.description,
    url,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.webp`,
      },
    },
    image: imageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/**
 * ウェブサイト用のJSON-LD構造化データを生成
 *
 * @returns JSON-LD オブジェクト
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}

/**
 * コレクションページ用のJSON-LD構造化データを生成
 *
 * @param title - ページタイトル
 * @param description - ページ説明
 * @param url - ページURL
 * @param items - コレクションアイテム（オプション）
 * @returns JSON-LD オブジェクト
 */
export function generateCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  items: unknown[] = [],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    hasPart: items,
  };
}

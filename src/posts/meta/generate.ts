import type { Metadata } from "next";
import { siteConfig } from "../../site";
import { createLogger } from "../../utils/logger";
import type { Post } from "../types";

const logger = createLogger("posts/meta/generate");

/**
 * 記事ページのメタデータを生成
 *
 * @param post - 記事データ
 * @param canonical - カノニカルURL（オプション）
 * @returns Next.js Metadata
 */
export function generatePostMetadata(post: Post, canonical?: string): Metadata {
  const { frontmatter, excerpt, ogImage } = post;
  const dateStr = frontmatter.date.toFormat("yyyyMMdd");

  logger.debug(`Generating metadata for post: ${dateStr}`);

  const title = `${frontmatter.title} | ${siteConfig.name}`;
  const description = excerpt || siteConfig.description;
  const url = canonical || `${siteConfig.url}/posts/${dateStr}`;

  // OG画像URL
  const imageUrl = ogImage
    ? `${siteConfig.url}${ogImage}`
    : `${siteConfig.url}/images/og-default.png`;

  // 公開日時（ISO 8601形式）
  const publishedTime = frontmatter.date.toISO() || undefined;

  logger.debug(`Generated metadata for post: ${dateStr}`, {
    hasOgImage: !!ogImage,
  });

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * アーカイブページのメタデータを生成
 *
 * @param title - ページタイトル
 * @param path - ページパス（例: "all-articles"）
 * @param description - ページ説明
 * @returns Next.js Metadata
 */
export function generateArchiveMetadata(
  title: string,
  path: string,
  description: string,
): Metadata {
  logger.debug(`Generating archive metadata: ${path}`);

  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}/${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}

/**
 * タグページのメタデータを生成
 *
 * @param tagName - タグ名
 * @param slug - タグスラッグ
 * @returns Next.js Metadata
 */
export function generateTagMetadata(tagName: string, slug: string): Metadata {
  logger.debug(`Generating tag metadata: ${slug}`);

  const title = `${tagName} | タグ | ${siteConfig.name}`;
  const description = `${tagName}に関する記事一覧`;
  const url = `${siteConfig.url}/tags/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/**
 * 静的ページのメタデータを生成
 *
 * @param title - ページタイトル
 * @param path - ページパス（例: "privacy"）
 * @param description - ページ説明
 * @returns Next.js Metadata
 */
export function generateStaticMetadata(
  title: string,
  path: string,
  description: string,
): Metadata {
  logger.debug(`Generating static metadata: ${path}`);

  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}/${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}

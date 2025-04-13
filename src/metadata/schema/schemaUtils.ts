import type { SiteInfo } from "../types";

/**
 * ブログポスト用の構造化データを生成
 */
export function generateBlogPostingSchema(
  title: string,
  description: string,
  url: string,
  date: string,
  siteInfo: SiteInfo,
  imageUrl?: string,
) {
  const formattedDate = formatDateForSchema(date);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    url: url,
    datePublished: formattedDate,
    dateModified: formattedDate,
    author: {
      "@type": "Person",
      name: siteInfo.author,
    },
    publisher: {
      "@type": "Person",
      name: siteInfo.author,
      logo: {
        "@type": "ImageObject",
        url: `${siteInfo.url}images/logo.webp`,
      },
    },
    ...(imageUrl && {
      image: imageUrl,
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/**
 * ウェブサイト用の構造化データを生成
 */
export function generateWebsiteSchema(siteInfo: SiteInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteInfo.name,
    description: siteInfo.description,
    url: siteInfo.url,
    author: {
      "@type": "Person",
      name: siteInfo.author,
    },
    publisher: {
      "@type": "Person",
      name: siteInfo.author,
    },
  };
}

/**
 * コレクションページ用の構造化データを生成
 */
export function generateCollectionPageSchema(
  name: string,
  description: string,
  url: string,
  listItems: Array<{ url: string; name: string }> = [],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
        name: item.name,
      })),
    },
  };
}

/**
 * 日付文字列をSchema.org形式に変換
 * @param date 日付文字列 (yyyyMMdd形式)
 * @returns ISO8601形式の日付文字列
 */
function formatDateForSchema(date: string): string {
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00+09:00`;
}

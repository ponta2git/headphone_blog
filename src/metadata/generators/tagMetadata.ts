import type { SiteInfo } from "../types";
import type { Metadata } from "next";

type TagMetadataParams = {
  tagName: string;
  tagSlug: string;
  description?: string;
  siteInfo: SiteInfo;
};

/**
 * タグページのメタデータを生成
 */
export function generateTagMetadata(params: TagMetadataParams): Metadata {
  const { tagName, tagSlug, description, siteInfo } = params;
  const tagTitle = `${tagName}に関する記事`;
  const tagDescription = description || `${tagName}に関する記事の一覧です。`;

  return {
    title: tagTitle,
    description: tagDescription,
    alternates: {
      canonical: `${siteInfo.url}tags/${tagSlug}`,
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      url: `${siteInfo.url}tags/${tagSlug}`,
      title: tagTitle,
      description: tagDescription,
      type: "website",
      siteName: siteInfo.name,
    },
    twitter: {
      card: "summary",
      site: siteInfo.twitter,
      creator: siteInfo.twitter,
      title: tagTitle,
      description: tagDescription,
    },
  };
}

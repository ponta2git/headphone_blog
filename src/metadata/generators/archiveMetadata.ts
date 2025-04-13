import type { SiteInfo } from "../types";
import type { Metadata } from "next";

type ArchiveMetadataParams = {
  title: string;
  pagePath: string;
  description?: string;
  siteInfo: SiteInfo;
};

/**
 * アーカイブページのメタデータを生成
 */
export function generateArchiveMetadata(
  params: ArchiveMetadataParams,
): Metadata {
  const { title, pagePath, description, siteInfo } = params;
  const pageDescription = description || `${title}の一覧ページです。`;

  return {
    title: title,
    description: pageDescription,
    alternates: {
      canonical: `${siteInfo.url}${pagePath}`,
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      url: `${siteInfo.url}${pagePath}`,
      title: title,
      description: pageDescription,
      type: "website",
      siteName: siteInfo.name,
    },
    twitter: {
      card: "summary",
      site: siteInfo.twitter,
      creator: siteInfo.twitter,
      title: title,
      description: pageDescription,
    },
  };
}

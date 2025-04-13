import type { SiteInfo } from "../types";
import type { Metadata } from "next";

type StaticMetadataParams = {
  title: string;
  pagePath: string;
  description?: string;
  siteInfo: SiteInfo;
};

/**
 * 静的ページのメタデータを生成
 */
export function generateStaticMetadata(params: StaticMetadataParams): Metadata {
  const { title, pagePath, description, siteInfo } = params;

  return {
    title: title,
    description: description || siteInfo.description,
    alternates: {
      canonical: `${siteInfo.url}${pagePath}`,
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      url: `${siteInfo.url}${pagePath}`,
      title: title,
      description: description || siteInfo.description,
      type: "website",
      siteName: siteInfo.name,
    },
    twitter: {
      card: "summary",
      site: siteInfo.twitter,
      creator: siteInfo.twitter,
      title: title,
      description: description || siteInfo.description,
    },
  };
}

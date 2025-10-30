import { siteConfig, IMAGE_CONSTANTS, LOCALE } from "../../site";
import type { Metadata } from "next";

/**
 * ベースとなるメタデータ定義
 *
 * サイト全体で共通するメタデータ設定。
 * 各ページのメタデータはこれを継承または上書きする。
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    url: siteConfig.url,
    locale: LOCALE,
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/images/logo.webp`,
        width: IMAGE_CONSTANTS.LOGO_SIZE,
        height: IMAGE_CONSTANTS.LOGO_SIZE,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
};

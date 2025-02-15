import type { Metadata } from "next";

const siteInfo = {
  name: "pontaのヘッドホンブログ",
  description:
    "ヘッドホンオーディオを楽しんでいます。ヘッドホンや機材のインプレッションやヘッドホンオーディオの楽しみ方などについて気楽に書き連ねています。",
  url: "https://ponta-headphone.net/",
  twitter: "@ponta2twit",
  postsPath: "posts",
} as const;

const metadataBase: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: siteInfo.name,
  alternates: {
    canonical: siteInfo.url,
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    url: siteInfo.url,
    locale: "ja-JP",
    type: "website",
    siteName: siteInfo.name,
  },
  twitter: {
    card: "summary",
    site: siteInfo.twitter,
  },
};

const metaInfo = {
  siteInfo,
  metadataBase,
};

export default metaInfo;

import { generateArchiveMetadata } from "./generators/archiveMetadata";
import { generatePostMetadata } from "./generators/postMetadata";
import { generateStaticMetadata } from "./generators/staticMetadata";
import { generateTagMetadata } from "./generators/tagMetadata";
import {
  generateBlogPostingSchema,
  generateCollectionPageSchema,
  generateWebsiteSchema,
} from "./schema/schemaUtils";
import * as imageUtils from "./utils/imageUtils";

import type { SiteInfo } from "./types";
import type { Metadata, ResolvingMetadata } from "next";

/**
 * サイト全体の基本情報
 */
const siteInfo: SiteInfo = {
  name: "pontaのヘッドホンブログ",
  description:
    "ヘッドホンオーディオを楽しんでいます。ヘッドホンや機材のインプレッションやヘッドホンオーディオの楽しみ方などについて気楽に書き連ねています。",
  url: "https://ponta-headphone.net/",
  twitter: "@ponta2twit",
  postsPath: "posts",
  ignoreFiles: [".DS_store"],
  author: "ponta",
  email: "coshun@gmail.com",
};

/**
 * ベースとなるメタデータ定義
 */
const baseMetadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: siteInfo.name,
    template: `%s | ${siteInfo.name}`,
  },
  description: siteInfo.description,
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
    title: siteInfo.name,
    description: siteInfo.description,
    images: [
      {
        url: `${siteInfo.url}images/logo.webp`,
        width: 230,
        height: 230,
        alt: siteInfo.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    site: siteInfo.twitter,
    creator: siteInfo.twitter,
    title: siteInfo.name,
    description: siteInfo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [
    {
      name: siteInfo.author,
      url: siteInfo.url,
    },
  ],
  creator: siteInfo.author,
  publisher: siteInfo.author,
};

/**
 * ページ種別ごとのメタデータ生成関数
 */
const generateMetadata = {
  /**
   * 記事ページのメタデータを生成
   */
  post: async (
    title: string,
    description: string,
    postdate: string,
    imageUrl?: string,
    mdxContent?: string,
    parent?: ResolvingMetadata,
  ): Promise<Metadata> => {
    return generatePostMetadata(
      { title, description, postdate, imageUrl, mdxContent, siteInfo },
      parent,
    );
  },

  /**
   * タグページのメタデータを生成
   */
  tag: (tagName: string, tagSlug: string, description?: string): Metadata => {
    return generateTagMetadata({ tagName, tagSlug, description, siteInfo });
  },

  /**
   * アーカイブページのメタデータを生成
   */
  archive: (
    title: string,
    pagePath: string,
    description?: string,
  ): Metadata => {
    return generateArchiveMetadata({ title, pagePath, description, siteInfo });
  },

  /**
   * 静的ページのメタデータを生成
   */
  static: (title: string, pagePath: string, description?: string): Metadata => {
    return generateStaticMetadata({ title, pagePath, description, siteInfo });
  },
};

/**
 * Schema.org 構造化データを生成するヘルパー関数
 */
const schemaOrg = {
  /**
   * ブログポスト用の構造化データを生成
   */
  blogPosting: (
    title: string,
    description: string,
    url: string,
    date: string,
    imageUrl?: string,
  ) => {
    return generateBlogPostingSchema(
      title,
      description,
      url,
      date,
      siteInfo,
      imageUrl,
    );
  },

  /**
   * ウェブサイト用の構造化データを生成
   */
  website: () => {
    return generateWebsiteSchema(siteInfo);
  },

  /**
   * コレクションページ用の構造化データを生成
   */
  collectionPage: (
    name: string,
    description: string,
    url: string,
    listItems: Array<{ url: string; name: string }> = [],
  ) => {
    return generateCollectionPageSchema(name, description, url, listItems);
  },
};

export const MetaInfo = {
  siteInfo,
  baseMetadata,
  generateMetadata,
  schemaOrg,
  imageUtils,
};

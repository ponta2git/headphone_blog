import * as imageUtils from "../utils/imageUtils";

import type { SiteInfo } from "../types";
import type { Metadata, ResolvingMetadata } from "next";

type PostMetadataParams = {
  title: string;
  description: string;
  postdate: string;
  imageUrl?: string;
  mdxContent?: string;
  siteInfo: SiteInfo;
};

/**
 * 記事ページのメタデータを生成
 */
export async function generatePostMetadata(
  params: PostMetadataParams,
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  const { title, description, postdate, imageUrl, mdxContent, siteInfo } =
    params;
  const previousMetadata = await parent;
  const previousImages = previousMetadata?.openGraph?.images || [];

  // 画像URLが指定されていない場合は、MDXコンテンツから抽出を試みる
  let ogImage = imageUrl;
  if (!ogImage && mdxContent) {
    const imageData = imageUtils.getImageMetadata(mdxContent, siteInfo.url);
    if (imageData.url) {
      ogImage = imageData.url;
    }
  }

  return {
    title: title,
    description: description || siteInfo.description,
    alternates: {
      canonical: `${siteInfo.url}posts/${postdate}`,
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      type: "article",
      url: `${siteInfo.url}posts/${postdate}`,
      title: title,
      description: description || siteInfo.description,
      // 記事に特定の画像があれば優先的に使用
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
            ...previousImages,
          ]
        : previousImages,
      publishedTime: `${postdate.slice(0, 4)}-${postdate.slice(
        4,
        6,
      )}-${postdate.slice(6, 8)}T00:00:00+09:00`,
    },
    twitter: {
      card: "summary",
      site: siteInfo.twitter,
      creator: siteInfo.twitter,
      title: title,
      description: description || siteInfo.description,
      // Twitterカードに画像を設定
      ...(ogImage && {
        card: "summary_large_image",
        images: [ogImage],
      }),
    },
  };
}

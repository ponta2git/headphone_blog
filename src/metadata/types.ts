import type { Metadata, ResolvingMetadata } from "next";

/**
 * サイト全体の基本情報
 */
export type SiteInfo = {
  name: string;
  description: string;
  url: string;
  twitter: string;
  postsPath: string;
  ignoreFiles: string[];
  author: string;
  email: string;
};

/**
 * 画像メタデータ
 */
export type ImageMetadata = {
  url?: string;
  width?: number;
  height?: number;
  alt?: string;
};

/**
 * ページメタデータジェネレーター関数の共通型
 */
export type MetadataGenerator<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (params: T, parent?: ResolvingMetadata) => Promise<Metadata> | Metadata;

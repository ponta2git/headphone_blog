import type { DateTime } from "luxon";
import type { MDXContent } from "mdx/types";
import type { TagName, TagSlug } from "../site/tags";

/**
 * タグデータ
 */
export interface Tag {
  /** タグ名（日本語） */
  name: TagName;

  /** URLスラッグ */
  slug: TagSlug;
}

/**
 * タグ統計情報
 */
export interface TagStats {
  /** タグ情報 */
  tag: Tag;

  /** このタグを持つ記事数 */
  count: number;
}

/**
 * 記事日付型（JST固定のLuxon DateTime）
 */
export type Postdate = DateTime<true>;

/**
 * 記事のFrontmatter
 */
export interface PostFrontmatter {
  /** 記事日付 */
  date: Postdate;

  /** 記事タイトル */
  title: string;

  /** タグ配列 */
  tags: Tag[];
}

/**
 * 記事データ
 */
export interface Post {
  /** Frontmatterデータ */
  frontmatter: PostFrontmatter;

  /** 記事抜粋（最初のN文字） */
  excerpt: string;

  /** MDXコンテンツ（Reactコンポーネント） */
  body: MDXContent;

  /** 生MDX文字列（画像検出等に使用） */
  rawContent: string;

  /** OG画像URL（記事内の最初の画像） */
  ogImage?: string;
}

/**
 * 記事キャッシュエラー情報
 */
export interface PostCacheError {
  /** エラーメッセージ */
  message: string;

  /** エラー発生時刻（Unix timestamp） */
  timestamp: number;

  /** 元のエラー */
  originalError?: Error;
}

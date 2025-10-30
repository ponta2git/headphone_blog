/**
 * メタデータモジュール - 統合エクスポート
 *
 * 旧 MetaInfo.ts との互換性を保つための統合インターフェース
 */

export { baseMetadata } from "./base";
export {
  generateBlogPostingSchema,
  generateWebsiteSchema,
  generateCollectionPageSchema,
} from "./schema";
export {
  generatePostMetadata,
  generateArchiveMetadata,
  generateTagMetadata,
  generateStaticMetadata,
} from "./generate";

/**
 * 旧 MetaInfo.ts 互換インターフェース
 *
 * 既存コードとの互換性のため、MetaInfo オブジェクトを提供。
 * 段階的に直接importへ移行することを推奨。
 */
import { baseMetadata } from "./base";
import {
  generateBlogPostingSchema,
  generateWebsiteSchema,
  generateCollectionPageSchema,
} from "./schema";
import {
  generatePostMetadata,
  generateArchiveMetadata,
  generateTagMetadata,
  generateStaticMetadata,
} from "./generate";
import { siteConfig } from "../../site";

export const MetaInfo = {
  baseMetadata,
  siteConfig,
  schemaOrg: {
    website: generateWebsiteSchema,
    blogPosting: generateBlogPostingSchema,
    collectionPage: generateCollectionPageSchema,
  },
  generateMetadata: {
    post: generatePostMetadata,
    archive: generateArchiveMetadata,
    tag: generateTagMetadata,
    static: generateStaticMetadata,
  },
} as const;

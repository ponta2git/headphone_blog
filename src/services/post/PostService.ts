import {
  getPostCache,
  getPendingPostCache,
  setPendingPostCache,
  getErrorCache,
} from "./PostCache";
import { loadPost } from "./PostLoader";
import { createPostComposeError } from "../errors/ErrorFactory";

import type { Post } from "./PostTypes";
import type { Postdate } from "../date/PostdateService";

/**
 * 日付を指定して記事を取得する。
 * - キャッシュの存在確認
 * - ネガティブキャッシュ（エラー）の存在確認
 * - ペンディング中のロード操作の確認
 * - ファイル読み込み
 * - 結果はPostCacheが自動的にキャッシュに格納
 */
export const PostService = {
  async getByPostdate(date: Postdate): Promise<Post> {
    const cacheKey = date.toFormat("yyyy-MM-dd");

    // Check for a completed post in the cache
    const cached = getPostCache(cacheKey);
    if (cached) return cached;

    // Check if we recently had an error for this resource (negative caching)
    const cachedError = getErrorCache(cacheKey);
    if (cachedError) {
      throw createPostComposeError(
        `Failed to load post (cached error): ${cacheKey}`,
        cachedError.originalError || new Error(cachedError.message),
      );
    }

    // Check if there's already a pending request for this post
    const pendingPost = getPendingPostCache(cacheKey);
    if (pendingPost) return pendingPost;

    // Create a new loading operation and cache the promise
    try {
      // No need for .then handler as the cache management is now centralised in PostCache
      const postPromise = loadPost(date);

      // Store the pending promise in the cache system
      // The cache system will handle both success and error cases
      setPendingPostCache(cacheKey, postPromise);

      return postPromise;
    } catch (error) {
      throw createPostComposeError(`Failed to load post: ${cacheKey}`, error);
    }
  },
};

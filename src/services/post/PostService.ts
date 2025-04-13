import {
  getPostCache,
  getPendingPostCache,
  setPostCache,
  setPendingPostCache,
} from "./PostCache";
import { loadPost } from "./PostLoader";
import { createPostComposeError } from "../errors/ErrorFactory";

import type { Post } from "./PostTypes";
import type { Postdate } from "../date/PostdateService";

/**
 * 日付を指定して記事を取得する。
 * - キャッシュの存在確認
 * - ペンディング中のロード操作の確認
 * - ファイル読み込み
 * - 結果を再度キャッシュに格納
 */
export const PostService = {
  async getByPostdate(date: Postdate): Promise<Post> {
    const cacheKey = date.toFormat("yyyy-MM-dd");

    // Check for a completed post in the cache
    const cached = getPostCache(cacheKey);
    if (cached) return cached;

    // Check if there's already a pending request for this post
    const pendingPost = getPendingPostCache(cacheKey);
    if (pendingPost) return pendingPost;

    // Create a new loading operation and cache the promise
    try {
      const postPromise = loadPost(date).then((post) => {
        // Store the completed post in the regular cache
        setPostCache(cacheKey, post);
        return post;
      });

      // Store the pending promise in the pending cache
      setPendingPostCache(cacheKey, postPromise);

      return postPromise;
    } catch (error) {
      throw createPostComposeError(`Failed to load post: ${cacheKey}`, error);
    }
  },
};

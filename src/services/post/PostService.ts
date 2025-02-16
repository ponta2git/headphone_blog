import { getPostCache, setPostCache } from "./PostCache";
import { loadPost } from "./PostLoader";
import { createPostComposeError } from "../errors/ErrorFactory";

import type { Postdate } from "../date/PostdateService";

/**
 * 日付を指定して記事を取得する。
 * - キャッシュの存在確認
 * - ファイル読み込み
 * - 結果を再度キャッシュに格納
 */
export const PostService = {
  getByPostdate(date: Postdate) {
    const cacheKey = date.toFormat("yyyy-MM-dd");
    const cached = getPostCache(cacheKey);
    if (cached) return cached;

    try {
      const post = loadPost(date);
      setPostCache(cacheKey, post);
      return post;
    } catch (error) {
      throw createPostComposeError(`Failed to load post: ${cacheKey}`, error);
    }
  },
};

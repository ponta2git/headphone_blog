import { CacheManager } from "../lib/cache/manager";
import { getPostIndex } from "./files/index";
import { loadPost } from "./files/load";
import { compileMdx, parseFrontmatterOnly } from "./parse/compile";
import { createLogger } from "../utils/logger";
import type { Post, Postdate, Tag, TagStats } from "./types";

const logger = createLogger("posts/api");

// キャッシュ
const postCache = new CacheManager<string, Post>(100);
const errorCache = new CacheManager<string, Error>(50, 30_000);

/**
 * 記事日付から記事を取得
 *
 * @param date - 記事日付
 * @returns Post
 * @throws {PostNotFoundError} 記事が存在しない場合
 * @throws {PostLoadError} 読み込みエラー
 * @throws {PostCompileError} コンパイルエラー
 */
export async function getPostByDate(date: Postdate): Promise<Post> {
  const key = date.toFormat("yyyyMMdd");

  // キャッシュチェック
  const cached = postCache.get(key);
  if (cached) {
    logger.debug(`Cache hit: ${key}`);
    return cached;
  }

  // エラーキャッシュチェック
  const cachedError = errorCache.get(key);
  if (cachedError) {
    logger.debug(`Error cache hit: ${key}`);
    throw cachedError;
  }

  try {
    logger.debug(`Loading post: ${key}`);
    const content = await loadPost(date);
    const post = compileMdx(content, date);
    postCache.set(key, post);
    logger.debug(`Loaded and cached post: ${key}`);
    return post;
  } catch (error) {
    // loadPost/compileMdxが既に適切なエラーをスローするため、そのままキャッシュ
    errorCache.set(key, error as Error);
    throw error;
  }
}

/**
 * タグで記事を絞り込み
 *
 * @param tag - タグ
 * @returns 該当記事の配列（新しい順）
 */
export async function getPostsByTag(tag: Tag): Promise<Post[]> {
  logger.info(`Getting posts by tag: ${tag.slug}`);

  const postIndex = await getPostIndex();
  const dates = postIndex.getDatesByTag(tag);

  logger.debug(`Found ${dates.length} posts for tag: ${tag.slug}`);

  return Promise.all(dates.map(getPostByDate));
}

/**
 * 全記事を取得
 *
 * @returns 全記事の配列（新しい順）
 */
export async function getAllPosts(): Promise<Post[]> {
  logger.info("Getting all posts");

  const startTime = Date.now();
  const postIndex = await getPostIndex();
  const dates = postIndex.getAllDates();

  logger.debug(`Found ${dates.length} posts`);

  const posts = await Promise.all(dates.map(getPostByDate));

  const duration = Date.now() - startTime;
  logger.info("Loaded all posts", { count: posts.length, duration });

  return posts;
}

/**
 * 全記事の日付を取得
 *
 * @returns 全記事の日付配列（新しい順）
 */
export async function getAllPostDates(): Promise<Postdate[]> {
  logger.debug("Getting all post dates");

  const postIndex = await getPostIndex();
  return postIndex.getAllDates();
}

/**
 * 関連記事を取得
 *
 * タグの重複数でスコアリングし、スコアの高い記事を返す
 *
 * @param currentPost - 現在の記事
 * @param limit - 最大取得数（デフォルト: 5）
 * @returns 関連記事の配列
 */
export async function getRelatedPosts(
  currentPost: Post,
  limit = 5,
): Promise<Post[]> {
  logger.debug(
    `Getting related posts for: ${currentPost.frontmatter.date.toFormat("yyyyMMdd")}`,
    {
      limit,
    },
  );

  const postIndex = await getPostIndex();
  const currentTags = new Set(currentPost.frontmatter.tags.map((t) => t.slug));
  const allDates = postIndex
    .getAllDates()
    .filter((d) => !d.equals(currentPost.frontmatter.date));

  // 各記事のタグ重複数をスコアリング
  const scored = await Promise.all(
    allDates.map(async (date) => {
      const content = await loadPost(date);
      const fm = parseFrontmatterOnly(content, date);
      const commonTags = fm.tags.filter((t) => currentTags.has(t.slug)).length;
      return { date, score: commonTags };
    }),
  );

  // スコア降順でソート、上位N件を取得
  const topDates = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.date);

  logger.debug(`Found ${topDates.length} related posts`);

  return Promise.all(topDates.map(getPostByDate));
}

/**
 * 前後の記事を取得
 *
 * @param currentDate - 現在の記事の日付
 * @returns 前後の記事（存在しない場合はnull）
 */
export async function getNeighbourPosts(currentDate: Postdate): Promise<{
  prev: Post | null;
  next: Post | null;
}> {
  logger.debug(
    `Getting neighbour posts for: ${currentDate.toFormat("yyyyMMdd")}`,
  );

  const postIndex = await getPostIndex();
  const allDates = postIndex.getAllDates();
  const index = allDates.findIndex((d) => d.equals(currentDate));

  if (index === -1) {
    logger.warn(`Post not found in index: ${currentDate.toFormat("yyyyMMdd")}`);
    return { prev: null, next: null };
  }

  // allDatesは降順（新しい順）なので、prevは次の要素、nextは前の要素
  const prev =
    index < allDates.length - 1
      ? await getPostByDate(allDates[index + 1])
      : null;
  const next = index > 0 ? await getPostByDate(allDates[index - 1]) : null;

  return { prev, next };
}

/**
 * タグ統計を取得
 *
 * @returns 各タグの記事数
 */
export async function getTagStats(): Promise<TagStats[]> {
  logger.debug("Getting tag stats");

  const postIndex = await getPostIndex();
  return postIndex.getTagStats();
}

/**
 * キャッシュをクリア
 *
 * テスト用、またはビルド前のクリーンアップに使用
 */
export function clearCache(): void {
  postCache.clear();
  errorCache.clear();
  logger.debug("Cache cleared");
}

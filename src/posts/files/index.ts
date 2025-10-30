import { scanMdxFiles } from "./scan";
import { extractDateFromPath, loadFrontmatterOnly } from "./load";
import { TAG_DEFINITIONS } from "../../site";
import { createLogger } from "../../utils/logger";
import type { Postdate, Tag, TagStats } from "../types";
import type { TagSlug } from "../../site/tags";

const logger = createLogger("posts/files/index");

/**
 * 記事インデックス
 *
 * 全記事をスキャンし、日付・タグによる検索を高速化
 */
class PostIndex {
  private allDates: Postdate[] = [];
  private tagIndex = new Map<TagSlug, Set<Postdate>>();
  private isBuilt = false;

  /**
   * インデックスを構築
   *
   * 全MDXファイルをスキャンし、Frontmatterを読み込んでインデックス化
   */
  async build(): Promise<void> {
    if (this.isBuilt) {
      logger.debug("Index already built, skipping");
      return;
    }

    logger.info("Building post index...");
    const startTime = Date.now();

    const files = await scanMdxFiles();
    this.allDates = files
      .map((file) => extractDateFromPath(file))
      .sort((a, b) => b.toMillis() - a.toMillis()); // 降順（新しい順）

    logger.debug(`Found ${this.allDates.length} posts, loading frontmatter...`);

    // 各記事のFrontmatterを読み込んでタグインデックスを構築
    const { parseFrontmatterOnly } = await import("../parse/compile");

    await Promise.all(
      this.allDates.map(async (date) => {
        try {
          const dateStr = date.toFormat("yyyyMMdd");
          const rawContent = await loadFrontmatterOnly(date);
          const frontmatter = parseFrontmatterOnly(rawContent, date);

          // タグインデックスに追加
          for (const tag of frontmatter.tags) {
            if (!this.tagIndex.has(tag.slug)) {
              this.tagIndex.set(tag.slug, new Set());
            }
            this.tagIndex.get(tag.slug)!.add(date);
          }

          logger.debug(`Indexed post: ${dateStr}`);
        } catch (error) {
          const err = error as Error;
          logger.warn(`Failed to index post: ${date.toFormat("yyyyMMdd")}`, {
            error: err.message,
          });
        }
      }),
    );

    this.isBuilt = true;

    const duration = Date.now() - startTime;
    logger.info(`Post index built`, { count: this.allDates.length, duration });
  }

  /**
   * 全記事の日付を取得（降順）
   */
  getAllDates(): Postdate[] {
    return this.allDates;
  }

  /**
   * タグで記事を絞り込み
   *
   * @param tag - タグ
   * @returns 該当記事の日付配列
   */
  getDatesByTag(tag: Tag): Postdate[] {
    const dates = Array.from(this.tagIndex.get(tag.slug) || []);
    return dates.sort((a, b) => b.toMillis() - a.toMillis());
  }

  /**
   * タグ統計を取得
   *
   * @returns 各タグの記事数
   */
  getTagStats(): TagStats[] {
    const allTags = Object.entries(TAG_DEFINITIONS).map(([name, slug]) => ({
      name: name as keyof typeof TAG_DEFINITIONS,
      slug,
    }));

    return allTags.map((tag) => ({
      tag,
      count: this.tagIndex.get(tag.slug)?.size || 0,
    }));
  }

  /**
   * インデックスをクリア（テスト用）
   */
  clear(): void {
    this.allDates = [];
    this.tagIndex.clear();
    this.isBuilt = false;
    logger.debug("Index cleared");
  }
}

/**
 * PostIndexシングルトンインスタンス
 */
let postIndexInstance: PostIndex | null = null;

/**
 * PostIndexインスタンスを取得（シングルトン）
 *
 * @returns PostIndexインスタンス
 */
export async function getPostIndex(): Promise<PostIndex> {
  if (!postIndexInstance) {
    logger.debug("Creating new PostIndex instance");
    postIndexInstance = new PostIndex();
    await postIndexInstance.build();
  }
  return postIndexInstance;
}

/**
 * PostIndexをクリア（テスト用）
 */
export function clearPostIndex(): void {
  if (postIndexInstance) {
    postIndexInstance.clear();
    postIndexInstance = null;
    logger.debug("PostIndex instance cleared");
  }
}

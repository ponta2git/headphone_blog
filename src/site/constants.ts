/**
 * コンテンツ生成に関する定数
 */
export const CONTENT_CONSTANTS = {
  /** 記事抜粋の最大文字数 */
  EXCERPT_LENGTH: 120,

  /** RSSフィードに含める記事数 */
  RSS_ITEM_COUNT: 5,

  /** 関連記事の表示数 */
  RELATED_POSTS_COUNT: 5,
} as const;

/**
 * キャッシュに関する定数
 */
export const CACHE_CONSTANTS = {
  /** エラーキャッシュのTTL（ミリ秒） */
  ERROR_CACHE_TTL_MS: 30_000, // 30秒
} as const;

/**
 * 画像に関する定数
 */
export const IMAGE_CONSTANTS = {
  /** OG画像のデフォルト幅 */
  OG_IMAGE_WIDTH: 1200,

  /** OG画像のデフォルト高さ */
  OG_IMAGE_HEIGHT: 630,

  /** サイトロゴのサイズ */
  LOGO_SIZE: 230,
} as const;

/**
 * 日付フォーマット定数
 */
export const DATE_FORMATS = {
  /** yyyyMMdd形式 */
  COMPACT: "yyyyMMdd" as const,

  /** yyyy-MM-dd形式 */
  HYPHENATED: "yyyy-MM-dd" as const,

  /** ISO8601形式（JST） */
  ISO8601_JST: "yyyy-MM-dd'T'HH:mm:ssZZ" as const,
} as const;

/**
 * タイムゾーン定数
 */
export const TIMEZONE = "Asia/Tokyo" as const;

/**
 * ロケール定数
 */
export const LOCALE = "ja-JP" as const;

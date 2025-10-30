/**
 * タグマスターデータ
 *
 * 日本語名 → URLスラッグのマッピング
 */
export const TAG_DEFINITIONS = {
  購入: "purchase",
  試聴: "try",
  システム: "system",
  評価指標: "metric",
  雑談: "chat",
  イベント: "event",
  DAC: "dac",
  ヘッドホンアンプ: "hpa",
  ヘッドホン: "headphones",
} as const;

/**
 * タグ名の型（ユニオン型）
 */
export type TagName = keyof typeof TAG_DEFINITIONS;

/**
 * タグスラッグの型（ユニオン型）
 */
export type TagSlug = (typeof TAG_DEFINITIONS)[TagName];

/**
 * タグ定義の型
 */
export type TagDefinitions = typeof TAG_DEFINITIONS;

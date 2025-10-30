/**
 * サイト全体の基本設定
 *
 * この設定は静的に決定され、実行時には変更されない
 */
export const siteConfig = {
  /** サイト名 */
  name: "pontaのヘッドホンブログ",

  /** サイト説明 */
  description:
    "ヘッドホンオーディオを楽しんでいます。ヘッドホンや機材のインプレッションやヘッドホンオーディオの楽しみ方などについて気楽に書き連ねています。",

  /** サイトURL（末尾スラッシュあり） */
  url: "https://ponta-headphone.net/",

  /** 著者情報 */
  author: {
    name: "ponta",
    email: "coshun@gmail.com",
  },

  /** ソーシャルメディア */
  social: {
    twitter: "@ponta2twit",
  },

  /** パス設定 */
  paths: {
    /** 記事ディレクトリ（プロジェクトルートからの相対パス） */
    posts: "posts",

    /** 公開ディレクトリ */
    public: "public",

    /** 無視するファイル */
    ignoreFiles: [".DS_Store"],
  },
} as const;

/**
 * サイト設定の型（as const による型推論）
 */
export type SiteConfig = typeof siteConfig;

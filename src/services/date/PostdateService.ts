import { DateTime } from "luxon";

/**
 * Luxon の DateTime を Postdate として扱う
 */
export type Postdate = DateTime;

export const PostdateService = {
  /**
   * yyyy-MM-dd フォーマットの日付文字列を JST として解釈し、DateTime を返す
   */
  from_yyyyMMdd(dateStr: string): Postdate {
    return DateTime.fromFormat(dateStr, "yyyy-MM-dd", {
      zone: "Asia/Tokyo",
    });
  },

  /**
   * Postdate を指定フォーマットの文字列に変換 (省略時は `yyyy-MM-dd`)
   */
  format(date: Postdate, formatStr = "yyyy-MM-dd"): string {
    // 常に JST で出力
    return date.setZone("Asia/Tokyo").toFormat(formatStr);
  },
};
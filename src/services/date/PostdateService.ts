import { readdir } from "node:fs/promises";
import path from "node:path";

import { DateTime } from "luxon";

import { MetaInfo } from "../../MetaInfo";
import { FileListCreateError } from "../errors/ErrorFactory";

import type { Dirent } from "node:fs";

/**
 * Luxon の DateTime を Postdate として扱う
 */
export type Postdate = DateTime;

export const PostdateService = {
  /**
   * yyyy-MM-dd フォーマットの日付文字列を JST として解釈し、DateTime を返す
   */
  from_yyyyMMdd_hyphenated(dateStr: string): Postdate {
    return DateTime.fromFormat(dateStr, "yyyy-MM-dd", {
      zone: "Asia/Tokyo",
      locale: "ja-JP",
    });
  },

  /**
   * yyyyMMdd フォーマットの日付文字列を JST として解釈し、DateTime を返す
   */
  from_yyyyMMdd(dateStr: string): Postdate {
    return DateTime.fromFormat(dateStr, "yyyyMMdd", {
      zone: "Asia/Tokyo",
      locale: "ja-JP",
    });
  },

  /**
   * Postdate を指定フォーマットの文字列に変換 (省略時は `yyyy-MM-dd`)
   */
  format(date: Postdate, formatStr = "yyyy-MM-dd"): string {
    // 常に JST で出力
    return date.setZone("Asia/Tokyo").toFormat(formatStr);
  },

  async getAllPostdates(metagen?: boolean): Promise<Postdate[]> {
    let dirents: Dirent[];

    try {
      dirents = await readdir(
        metagen
          ? path.resolve(
              import.meta.dirname,
              `../../${MetaInfo.siteInfo.postsPath}`,
            )
          : MetaInfo.siteInfo.postsPath,
        {
          recursive: true,
          withFileTypes: true,
        },
      );
    } catch (e) {
      throw FileListCreateError(e);
    }

    return dirents
      .filter((dirent) => dirent.isFile())
      .map((dirent) =>
        DateTime.fromFormat(path.parse(dirent.name).name, "yyyyMMdd", {
          zone: "Asia/Tokyo",
          locale: "ja-JP",
        }),
      )
      .filter((date) => date.isValid)
      .sort((a, b) => a.toMillis() - b.toMillis());
  },
};

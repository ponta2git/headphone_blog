import { DateTime } from "luxon";

import { InvalidDateStringFormatError } from "../Errors";

export type PostDate = DateTime<true>;

export function toPostDate_yyyyMMdd(str: string) {
  const result = DateTime.fromFormat(str, "yyyyMMdd", {
    zone: "Asia/Tokyo",
    locale: "ja-JP",
  });

  if (!result.isValid) throw InvalidDateStringFormatError(str, "yyyyMMdd");

  return result;
}

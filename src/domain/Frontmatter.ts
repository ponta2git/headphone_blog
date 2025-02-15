import matter from "gray-matter";
import { DateTime } from "luxon";

import { Post } from "./Post";
import { Tag, toTagFromTitle } from "./Tag";
import { ParseFrontmatterError } from "../Errors";

export type Frontmatter = {
  title: string;
  date: DateTime;
  tags: Tag[];
};

export function toFrontmatter(post: Post) {
  const { data: rawData } = matter(post);

  if (typeof rawData !== "object" || rawData === null) {
    throw ParseFrontmatterError("Frontmatter is not object");
  }

  if (!("title" in rawData)) {
    throw ParseFrontmatterError("Title is not found");
  }
  if (!("date" in rawData)) {
    throw ParseFrontmatterError("Date is not found");
  }
  const date = DateTime.fromFormat(rawData.date as string, "yyyy-MM-dd", {
    zone: "Asia/Tokyo",
    locale: "ja-JP",
  });
  if (!date.isValid) {
    throw ParseFrontmatterError(
      `Cannot parse the date: ${rawData.date as string}`,
    );
  }

  if (!("tags" in rawData)) {
    throw ParseFrontmatterError("Tags is not found");
  }
  if (!Array.isArray(rawData.tags)) {
    throw ParseFrontmatterError("Tags is not array");
  }

  return {
    title: rawData.title as string,
    date,
    tags: rawData.tags.map((rawTag) => toTagFromTitle(rawTag as string)),
  } satisfies Frontmatter;
}

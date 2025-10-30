import { TAG_DEFINITIONS, type TagName } from "../../site";
import { TagNotFoundError } from "../../errors";
import type { Tag, Post } from "../../posts/types";

export function fromName(raw: unknown): Tag {
  if (typeof raw !== "string") {
    throw new TagNotFoundError(String(raw), "name");
  }

  const found = TAG_DEFINITIONS[raw as keyof typeof TAG_DEFINITIONS];
  if (!found) {
    throw new TagNotFoundError(raw, "name");
  }

  return {
    name: raw as keyof typeof TAG_DEFINITIONS,
    slug: found,
  };
}

export function fromSlug(raw: unknown): Tag {
  if (typeof raw !== "string") {
    throw new TagNotFoundError(String(raw), "slug");
  }

  const foundName = Object.keys(TAG_DEFINITIONS).find(
    (key) => TAG_DEFINITIONS[key as keyof typeof TAG_DEFINITIONS] === raw,
  );

  if (!foundName) {
    throw new TagNotFoundError(raw, "slug");
  }

  return {
    name: foundName as keyof typeof TAG_DEFINITIONS,
    slug: raw as (typeof TAG_DEFINITIONS)[keyof typeof TAG_DEFINITIONS],
  };
}

export function getAllTags(): Tag[] {
  return Object.entries(TAG_DEFINITIONS).map(([name, slug]) => ({
    name: name as TagName,
    slug,
  }));
}

export function tagInPost(tag: Tag, matt: Post["frontmatter"]): boolean {
  return matt.tags.map((t) => t.name).includes(tag.name);
}

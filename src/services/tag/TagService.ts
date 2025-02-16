import TagDefinitions from "./Tags.json";

import type { Post } from "../post/PostTypes";

export type Tag = {
  name: string;
  slug: string;
};

export const TagService = {
  fromName(raw: unknown): Tag {
    if (typeof raw !== "string") {
      throw new Error("Tag must be a string, or parse logic must be extended.");
    }

    const found = TagDefinitions[raw as keyof typeof TagDefinitions];
    if (!found) {
      throw new Error(`Tag not found: ${raw}`);
    }

    return {
      name: raw,
      slug: found,
    };
  },

  fromSlug(raw: unknown): Tag {
    if (typeof raw !== "string") {
      throw new Error(
        "Slug must be a string, or parse logic must be extended.",
      );
    }

    const foundName = Object.keys(TagDefinitions).find(
      (key) => TagDefinitions[key as keyof typeof TagDefinitions] === raw,
    );

    if (!foundName) {
      throw new Error(`Tag not found for slug: ${raw}`);
    }

    return {
      name: foundName,
      slug: raw,
    };
  },

  allTags(): Tag[] {
    return Object.entries(TagDefinitions).map(([name, slug]) => ({
      name,
      slug,
    }));
  },

  tagInPost(tag: Tag, matt: Post["frontmatter"]) {
    return matt.tags
      .map((frontmatterTag) => frontmatterTag.name)
      .includes(tag.name);
  },
};

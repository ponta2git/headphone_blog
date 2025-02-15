export type Tag = {
  name: string;
  slug: string;
};

export const TagService = {
  from(raw: unknown): Tag {
    if (typeof raw !== "string") {
      throw new Error("Tag must be a string, or parse logic must be extended.");
    }
    return {
      name: raw,
      slug: raw.toLowerCase().replace(/\s+/g, "-"),
    };
  },
};
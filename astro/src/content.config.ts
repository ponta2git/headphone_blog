import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { isPublicationDate, tags } from "./lib/blog";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z
        .string()
        .refine(isPublicationDate, "Use a valid YYYY-MM-DD publication date"),
      tags: z
        .array(
          z.string().refine((tag) => Object.hasOwn(tags, tag), "Unknown tag"),
        )
        .min(1),
      ogImage: image().optional(),
    }),
});

export const collections = { posts };

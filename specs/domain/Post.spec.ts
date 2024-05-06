import { DateTime } from "luxon"
import { MDXContent } from "mdx/types"
import { describe, test, afterEach, vi, expect } from "vitest"

import { toFrontmatter } from "../../src/domain/Frontmatter"
import { Post, toPost } from "../../src/domain/Post"
import { toTagFromTitleString } from "../../src/domain/Tag"

vi.mock("../../src/domain/Frontmatter")

afterEach(() => {
  vi.clearAllMocks()
})

describe("Post", () => {
  describe("toPost", () => {
    test("successful", async () => {
      const mdxStr = `---
title: title
date: "2024-03-23"
tags: ["イベント"]
---

body of mdx. [link](http://example.com) in contents.
`
      const mdxBuffer = Buffer.from(mdxStr)

      const expectedRawFrontmatter = {
        title: "title",
        date: "2024-03-23",
        tags: ["イベント"],
      }
      const frontmatter = {
        title: "title",
        date: DateTime.fromFormat("20240323", "yyyyMMdd") as DateTime<true>,
        tags: [toTagFromTitleString("イベント")],
      }
      vi.mocked(toFrontmatter).mockReturnValue(frontmatter)

      const actual = await toPost(mdxBuffer)

      expect(toFrontmatter).toHaveBeenCalledWith(
        expectedRawFrontmatter as unknown,
      )
      expect(actual).toStrictEqual<Post>({
        frontmatter,
        content: expect.anything() as MDXContent, // todo: anything
        excerpt: "body of mdx. link in contents. ...",
      })
    })
  })
})

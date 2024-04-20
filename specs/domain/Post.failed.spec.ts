import { evaluate } from "@mdx-js/mdx"
import { describe, test, afterEach, vi, expect } from "vitest"

import { toPost } from "../../src/domain/Post"
import { MDXCompileError } from "../../src/Errors"

vi.mock("@mdx-js/mdx")
vi.mock("../../src/domain/Frontmatter")

afterEach(() => {
  vi.clearAllMocks()
})

describe("Post failed", () => {
  describe("toPost: Error", () => {
    test("cannot compile mdx", async () => {
      vi.mocked(evaluate).mockRejectedValueOnce("error!")

      await expect(toPost(Buffer.from(""))).rejects.toStrictEqual(
        MDXCompileError(""),
      )
    })
  })
})

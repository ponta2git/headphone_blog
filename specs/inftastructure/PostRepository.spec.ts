import { readFile } from "fs/promises"

import { DateTime } from "luxon"
import { describe, test, afterEach, vi, expect } from "vitest"

import { findPostByDate } from "../../src/infrastructure/PostRepository"

vi.mock("fs/promises")
vi.mock("../../src/domain/Post")

afterEach(() => {
  vi.clearAllMocks()
})

describe("PostRepository", () => {
  const postDate = DateTime.fromFormat("20240102", "yyyyMMdd", {
    zone: "Asia/Tokyo",
    locale: "ja-JP",
  })

  test("findPostBy", async () => {
    await findPostByDate(postDate)

    expect(vi.mocked(readFile)).toHaveBeenCalledOnce()
    expect(vi.mocked(readFile)).toHaveBeenCalledWith("posts/2024/20240102.mdx")
  })

  test("findPostBy: error", async () => {
    vi.mocked(readFile).mockRejectedValue("readFile Rejected!")

    await expect(findPostByDate(postDate)).rejects.toThrow(
      "Cannot load file: posts/2024/20240102.mdx",
    )
  })
})

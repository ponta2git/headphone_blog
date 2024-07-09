import { Dirent } from "fs"
import { readdir } from "fs/promises"

import { DateTime } from "luxon"
import { describe, test, afterEach, vi, expect } from "vitest"

import { getAllPostDates } from "../../src/infrastructure/PostDateRepository"

vi.mock("fs/promises")

afterEach(() => {
  vi.clearAllMocks()
})

describe("PostDatesRepository", () => {
  test("getAllPostDates", async () => {
    const files = [
      {
        name: ".DS_store",
        isFile: () => true,
      },
      {
        name: "dir1",
        isFile: () => false,
      },
      {
        name: "file1",
        isFile: () => true,
      },
      {
        name: "20240204.mdx",
        isFile: () => true,
      },
      {
        name: "20231010.mdx",
        isFile: () => true,
      },
    ] as Dirent[]
    vi.mocked(readdir).mockResolvedValueOnce(files)
    const expected = [
      DateTime.fromFormat("20231010", "yyyyMMdd", {
        zone: "Asia/Tokyo",
        locale: "ja-JP",
      }),
      DateTime.fromFormat("20240204", "yyyyMMdd", {
        zone: "Asia/Tokyo",
        locale: "ja-JP",
      }),
    ]

    const actual = await getAllPostDates()
    expect(actual).toStrictEqual(expected)
  })
})

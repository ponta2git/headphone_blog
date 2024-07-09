import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

import { toFrontmatter } from "../../../domain/Frontmatter"
import { PostDate } from "../../../domain/PostDate"
import { getAllPostDatesWithCache } from "../../../infrastructure/CachedInfrastructure"
import { findPostByDate } from "../../../infrastructure/PostRepository"

export async function Neighbours({ selfDate }: { selfDate: PostDate }) {
  const postDates = await getAllPostDatesWithCache()
  const pos = postDates.findIndex((date) => date.equals(selfDate))

  const [prev, next] = await Promise.all([
    pos > 0 ? findPostByDate(postDates[pos - 1]) : undefined,
    pos < postDates.length - 1 ? findPostByDate(postDates[pos + 1]) : undefined,
  ])

  const [prevMatter, nextMatter] = [
    prev ? toFrontmatter(prev) : undefined,
    next ? toFrontmatter(next) : undefined,
  ]

  return (
    <div className="flex w-full flex-row items-center justify-start">
      <div className="w-[20px] shrink-0 items-center">
        <FontAwesomeIcon icon={faChevronLeft} className="block h-4 w-4" />
      </div>
      <div className="w-1/3 shrink-0 pl-2 text-sm leading-6">
        {prevMatter && (
          <Link
            href={`/posts/${prevMatter.date.toFormat("yyyyMMdd")}`}
            className="line-break-strict text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
          >
            {prevMatter.title}
          </Link>
        )}
      </div>
      <div className="w-1/3"></div>
      <div className="w-1/3 shrink-0 pr-2 text-right text-sm leading-6">
        {nextMatter && (
          <Link
            href={`/posts/${nextMatter.date.toFormat("yyyyMMdd")}`}
            className="line-break-strict text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
          >
            {nextMatter.title}
          </Link>
        )}
      </div>
      <div className="w-[20px] shrink-0 items-center">
        <FontAwesomeIcon icon={faChevronRight} className="ml-2 block h-4 w-4" />
      </div>
    </div>
  )
}

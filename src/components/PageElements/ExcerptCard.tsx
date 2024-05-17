import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

import { TagItem } from "./TagItem"
import { Post } from "../../domain/Post"

export function ExcerptCard({
  post: {
    frontmatter: { date, title, tags },
    excerpt,
  },
}: {
  post: Post
}) {
  const link = `/posts/${date.toISODate({ format: "basic" })}`
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row gap-x-1 overflow-x-scroll whitespace-nowrap">
          {tags.map((tag) => (
            <TagItem key={tag.path} tag={tag} />
          ))}
        </div>
        <h2 className="text-xl font-bold leading-snug tracking-[0.4px]">
          <Link
            href={link}
            className="ml-[0.25rem] flex flex-row items-center justify-start gap-x-1 transition-colors hover:text-[#40404088]"
          >
            {title}
            <FontAwesomeIcon
              icon={faChevronRight}
              className="-mb-[0.15rem] h-3 w-3"
            />
          </Link>
        </h2>
      </div>
      <div className="px-2">
        <p>{excerpt}</p>
      </div>
    </div>
  )
}

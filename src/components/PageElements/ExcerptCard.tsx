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
  const link = `/posts/${date.replaceAll("-", "")}`
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-xl font-bold leading-snug tracking-[0.4px]">
          <Link
            href={link}
            className="transition-colors hover:text-[#40404088]"
          >
            {title}
          </Link>
        </h2>
        <time className="text-xs leading-tight tracking-tight text-[#7b8ca2]">
          {date}
        </time>
        <div className="flex flex-row gap-x-1">
          {tags.map((tag) => (
            <TagItem key={tag.alias} tag={tag} />
          ))}
        </div>
      </div>
      <div className="mx-2 flex flex-col gap-y-2">
        <p>{excerpt}</p>

        <Link href={link}>
          <div className="flex flex-row items-center justify-end gap-x-1 text-sm text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]">
            <FontAwesomeIcon
              icon={faChevronRight}
              className="-mb-[0.15rem] h-3 w-3"
            />
            続きを読む
          </div>
        </Link>
      </div>
    </div>
  )
}

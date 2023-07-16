import Link from "next/link"
import type { ExcerptCardProps } from "../../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { Tag } from "./Tag"

export function ExcerptCard({ frontmatter, excerpt }: ExcerptCardProps) {
  const link = `posts/${frontmatter.date.replaceAll("-", "")}`
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-xl font-bold leading-snug tracking-[0.4px] transition-colors hover:text-[#40404088]">
          <Link href={link}>{frontmatter.title}</Link>
        </h2>
        <div className="flex flex-row items-center gap-x-2">
          <time className="text-sm leading-tight tracking-tight text-[#7b8ca2]">
            {frontmatter.date}
          </time>
          {/*
          <div className="flex flex-row gap-x-1">
            {frontmatter.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          */}
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <p>{excerpt}</p>

        <Link href={link}>
          <div className="flex flex-row items-center justify-end gap-x-1 text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]">
            <FontAwesomeIcon
              icon={faChevronRight}
              className="-mb-[0.1rem] h-3 w-3"
            />
            続きを読む
          </div>
        </Link>
      </div>
    </div>
  )
}

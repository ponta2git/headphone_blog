import Link from "next/link"

import { TagItem } from "./TagItem"
import { Frontmatter } from "../../domain/Frontmatter"

export function ExcerptCard({
  frontmatter: { date, title, tags },
}: {
  frontmatter: Frontmatter
}) {
  const link = `/posts/${date.toISODate({ format: "basic" })}`
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row items-baseline gap-x-1 leading-tight">
          {tags.map((tag) => (
            <TagItem key={tag.path} tag={tag} />
          ))}
        </div>
        <h2 className="line-break-strict text-xl font-bold leading-snug tracking-[0.6px]">
          <Link
            href={link}
            className="ml-[0.25rem] transition-colors hover:text-[#40404088]"
          >
            {title}
          </Link>
        </h2>
        <div className="text-sm leading-5 tracking-[0.2px]">
          <p className="ml-[0.25rem] text-slate-500">
            {date.toFormat("yyyy-MM-dd")}
          </p>
        </div>
      </div>
    </div>
  )
}

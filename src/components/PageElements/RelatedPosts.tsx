import { faNewspaper } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

import { Frontmatter } from "../../domain/Frontmatter"
import { Tag } from "../../domain/Tag"

export default function RelatedPosts({
  tags,
  frontmatters,
}: {
  tags: Tag[]
  frontmatters: Frontmatter[]
}) {
  return (
    <div className="mx-auto mb-24 w-[85vw] rounded-xl bg-slate-50 px-8 pb-8 pt-6 tracking-wide text-neutral-700 md:mx-auto md:w-3/5 lg:w-1/2">
      <h3 className="mb-4 flex flex-row items-center gap-2 font-semibold leading-8">
        <span className="inline-block h-4 w-4">
          <FontAwesomeIcon icon={faNewspaper} />
        </span>
        関連記事
      </h3>
      <div className="flex flex-col gap-2 leading-6">
        {frontmatters.map((matter) => (
          <p key={matter.date.toISO()}>
            <Link
              href={`/posts/${matter.date.toFormat("yyyyMMdd")}`}
              className=" text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
            >
              {matter.title}
            </Link>
          </p>
        ))}
        <div className="mt-4 flex flex-col gap-2 text-xs">
          {tags &&
            tags.map((tag) => (
              <p key={tag.path}>
                <Link
                  href={`/tags/${tag.path}`}
                  className="tracking-[0.4px] text-[#7b8ca2]"
                >
                  他の「{tag.title}」の記事を読む
                </Link>
              </p>
            ))}
        </div>
      </div>
    </div>
  )
}

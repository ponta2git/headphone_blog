import Link from "next/link"
import { Tag as TagType } from "../../types"
import { TagSlugs } from "../../libs/siteBasic"

export function Tag({ tag }: { tag: TagType }) {
  return (
    <Link
      href={`tags/${TagSlugs[tag]}`}
      className="rounded-lg border-[1px] border-solid border-slate-300 px-2 py-1 text-sm transition-colors hover:bg-slate-200"
    >
      <span className="shadow-slate-900 drop-shadow-lg">{tag}</span>
    </Link>
  )
}

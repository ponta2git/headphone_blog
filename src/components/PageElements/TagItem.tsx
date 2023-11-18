import Link from "next/link"
import { Tag } from "../../domain/Tag"

export function TagItem({ tag }: { tag: Tag }) {
  return (
    <div>
      <Link
        href={`tags/${tag.alias}`}
        className="rounded-lg border-[1px] border-solid border-slate-300 p-1 text-xs transition-colors hover:bg-slate-200"
      >
        <span className="shadow-slate-900 drop-shadow-lg">{tag.title}</span>
      </Link>
    </div>
  )
}

import Link from "next/link";

import { Tag } from "../../domain/Tag";

export function TagItem({ tag }: { tag: Tag }) {
  return (
    <div className="mb-[3px]">
      <Link
        href={`/tags/${tag.path}`}
        className="rounded-xl border-[1px] border-solid border-slate-300 px-2 py-1 text-xs transition-colors hover:bg-slate-200"
      >
        <span className="shadow-slate-900 drop-shadow-lg">{tag.title}</span>
      </Link>
    </div>
  );
}

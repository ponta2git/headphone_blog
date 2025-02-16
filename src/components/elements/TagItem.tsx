import Link from "next/link";

import type { Tag } from "../../services/tag/TagService";

export function TagItem({ tag }: { tag: Tag }) {
  return (
    <div className="rounded-lg border-[1px] border-[#CCE0FF] bg-[#f0f8ff] px-2 py-1 text-xs transition-colors hover:bg-[#CCE0FF77]">
      <Link href={`/tags/${tag.slug}`}>
        <span>{tag.name}</span>
      </Link>
    </div>
  );
}

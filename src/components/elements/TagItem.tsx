import Link from "next/link";

import type { Tag } from "../../services/tag/TagService";

export function TagItem({ tag }: { tag: Tag }) {
  return (
    <div className="rounded-lg border-[1px] border-bg-footer bg-bg-alt px-2 py-1 text-xs transition-colors hover:bg-universal-shadow">
      <Link href={`/tags/${tag.slug}`}>
        <span>{tag.name}</span>
      </Link>
    </div>
  );
}

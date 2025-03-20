import Link from "next/link";

import { TagItem } from "../../elements/TagItem";

import type { Post } from "../../../services/post/PostTypes";

export function MetaCard({ post }: { post: Post }) {
  const { frontmatter } = post;
  const { date, tags, title } = frontmatter;

  const link = `/posts/${date.toISODate({ format: "basic" })}`;
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-[0.375rem]">
        <div className="flex flex-row gap-x-2">
          {tags.map((tag) => (
            <TagItem key={tag.slug} tag={tag} />
          ))}
        </div>
        <h2 className="font-header-setting ml-[0.25rem] text-xl leading-snug font-bold tracking-[0.6px] text-[#2F4F4F]">
          <Link
            href={link}
            className="transition-colors hover:text-[#40404088]"
          >
            {title}
          </Link>
        </h2>
        <p className="ml-[0.25rem] text-sm leading-5 tracking-[0.2px] text-[#7b8ca2]">
          {date.toFormat("yyyy-MM-dd")}
        </p>
      </div>
    </div>
  );
}

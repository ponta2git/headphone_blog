import { faNewspaper } from "@fortawesome/free-solid-svg-icons/faNewspaper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import type { Postdate, Post } from "../../posts/types";
import type { Tag } from "../../posts/types";
import { getRelatedPosts } from "../../posts/api";

export default async function RelatedPosts({
  selfTags,
  selfDate,
}: {
  selfTags: Tag[];
  selfDate: Postdate;
}) {
  // Create a temporary post object for related post lookup
  const currentPost: Post = {
    frontmatter: {
      date: selfDate,
      title: "",
      tags: selfTags,
    },
    excerpt: "",
    body: () => null,
    rawContent: "",
  };

  const targets = await getRelatedPosts(currentPost, 5);

  return (
    <div className="flex flex-col gap-y-3 rounded-lg border-2 border-bg-alt bg-white px-8 py-6 leading-8">
      <h3 className="font-header-setting flex flex-row items-center gap-x-2 leading-snug tracking-[0.6px] text-text-heading">
        <span className="inline-block">
          <FontAwesomeIcon icon={faNewspaper} />
        </span>
        <span className="inline-block">関連記事</span>
      </h3>
      <div className="flex flex-col gap-y-0.5 leading-7">
        {targets.map((post) => (
          <p key={post.frontmatter.date.toISO()}>
            <Link
              href={`/posts/${post.frontmatter.date.toFormat("yyyyMMdd")}`}
              className="text-justify tracking-[-0.0125rem] break-words text-link-blue transition-colors hover:text-link-blue-hover"
            >
              {post.frontmatter.title}
            </Link>
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-y-1 text-sm">
        {selfTags.map((tag) => (
          <p key={tag.slug}>
            <Link
              href={`/tags/${tag.slug}`}
              className="text-justify tracking-[-0.0125rem] break-words text-text-meta"
            >
              他の「{tag.name}」の記事を読む
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
}

import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { toFrontmatter } from "../../domain/Frontmatter";
import { isTagEqual } from "../../domain/Tag";
import {
  findPostByDateWithCache,
  getAllPostDatesWithCache,
} from "../../infrastructure/CachedInfrastructure";

import type { PostDate } from "../../domain/PostDate";
import type { Tag } from "../../domain/Tag";

export default async function RelatedPosts({
  selfTags,
  selfDate,
}: {
  selfTags: Tag[];
  selfDate: PostDate;
}) {
  const allDates = await getAllPostDatesWithCache();
  const dates = allDates.filter((date) => !date.equals(selfDate));
  const posts = await Promise.all([
    ...dates.map((date) => findPostByDateWithCache(date)),
  ]);
  const matters = posts.map((post) => toFrontmatter(post));

  const frontmatters = matters
    .filter((cand) =>
      selfTags.some((selfTag) =>
        cand.tags.some((candTag) => isTagEqual(selfTag, candTag)),
      ),
    )
    .toReversed()
    .slice(0, 5);

  return (
    <div className="rounded-xl bg-slate-50 px-8 pt-6 pb-8 tracking-wide text-neutral-700">
      <h3 className="mb-4 flex flex-row items-center gap-2 leading-8 font-semibold">
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
              className="line-break-strict text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
            >
              {matter.title}
            </Link>
          </p>
        ))}
        <div className="mt-4 flex flex-col gap-2 text-xs">
          {selfTags.map((tag) => (
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
  );
}

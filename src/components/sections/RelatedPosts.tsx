import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import {
  PostdateService,
  type Postdate,
} from "../../services/date/PostdateService";
import { PostService } from "../../services/post/PostService";

import type { Tag } from "../../services/tag/TagService";

export default async function RelatedPosts({
  selfTags,
  selfDate,
}: {
  selfTags: Tag[];
  selfDate: Postdate;
}) {
  const allDates = await PostdateService.getAllPostdates();
  const dates = allDates.filter((date) => !date.equals(selfDate));
  const posts = await Promise.all(
    dates.map((date) => PostService.getByPostdate(date)),
  );
  const matters = posts.map((post) => post.frontmatter);

  const targets = matters
    .filter((cand) =>
      selfTags.some((selfTag) =>
        cand.tags.some((candTag) => selfTag.slug === candTag.slug),
      ),
    )
    .toReversed()
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-y-3 rounded-lg border-2 border-[#f0f8ff] bg-white px-8 py-6 leading-8">
      <h3 className="font-header-setting flex flex-row items-center gap-x-2 leading-snug tracking-[0.6px] text-[#2F4F4F]">
        <span className="inline-block">
          <FontAwesomeIcon icon={faNewspaper} />
        </span>
        <span className="inline-block">関連記事</span>
      </h3>
      <div className="flex flex-col gap-y-0.5 leading-7">
        {targets.map((matter) => (
          <p key={matter.date.toISO()}>
            <Link
              href={`/posts/${matter.date.toFormat("yyyyMMdd")}`}
              className="text-justify tracking-[-0.0125rem] break-words text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
            >
              {matter.title}
            </Link>
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-y-1 text-sm">
        {selfTags.map((tag) => (
          <p key={tag.slug}>
            <Link
              href={`/tags/${tag.slug}`}
              className="text-justify tracking-[-0.0125rem] break-words text-[#7b8ca2]"
            >
              他の「{tag.name}」の記事を読む
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
}

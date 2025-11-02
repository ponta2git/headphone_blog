import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons/faHeadphonesSimple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import Container from "../../components/layout/Container";
import { MetaCard } from "../../components/sections/article/MetaCard";
import { generateArchiveMetadata } from "../../posts/meta";
import { getPostsByTag } from "../../posts/api";
import * as TagService from "../../lib/tag";

export function generateMetadata() {
  return generateArchiveMetadata(
    "オーディオ談議",
    "discussions",
    "オーディオ談議の記事一覧",
  );
}

export default async function Page() {
  const discussionTag = TagService.fromName("雑談");
  const filtered = await getPostsByTag(discussionTag);

  return (
    <Container>
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading">
        <FontAwesomeIcon
          icon={faHeadphonesSimple}
          className="inline-block h-5 w-5"
        />
        <span className="inline-block">考察</span>
      </h1>
      <div className="flex flex-col gap-y-4">
        <div className="text-justify tracking-[-0.0125rem] break-words">
          わたしが（主にヘッドホン）オーディオに対して思っていることを、つらつらと書き連ねています。今後、楽しくオーディオを続けていくにあたって、何かみなさんの参考になれば幸いです。
        </div>
        {filtered.map((post) => (
          <MetaCard key={post.frontmatter.date.toISO()} post={post} />
        ))}
        <div className="text-justify tracking-[-0.0125rem] break-words">
          別ジャンルの記事をお探しなら、
          <Link href="/tags">
            <span className="text-link-blue transition-colors hover:text-link-blue-hover">
              ジャンル一覧をご覧ください。
            </span>
          </Link>
        </div>
      </div>
    </Container>
  );
}

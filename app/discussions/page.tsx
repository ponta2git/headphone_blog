import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons/faHeadphonesSimple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import Container from "../../src/components/layout/Container";
import { MetaCard } from "../../src/components/sections/article/MetaCard";
import { MetaInfo } from "../../src/MetaInfo";
import { PostdateService } from "../../src/services/date/PostdateService";
import { PostService } from "../../src/services/post/PostService";
import { TagService } from "../../src/services/tag/TagService";

import type { Metadata } from "next";

export const metadata: Metadata = {
  ...MetaInfo.metadataBase,
  title: `考察: ${MetaInfo.siteInfo.name}`,
  description: "考察を集めたページ",
  alternates: {
    ...MetaInfo.metadataBase.alternates,
    canonical: `${MetaInfo.siteInfo.url}kousatsu`,
  },
  openGraph: {
    ...MetaInfo.metadataBase.openGraph,
    url: `${MetaInfo.siteInfo.url}kousatsu`,
  },
  twitter: {
    ...MetaInfo.metadataBase.twitter,
    description: "考察を集めたページ",
  },
};

export default async function Page() {
  const discussionTag = TagService.fromName("雑談");
  const postdates = (await PostdateService.getAllPostdates()).toReversed();
  const allPosts = await Promise.all(
    postdates.map((date) => PostService.getByPostdate(date)),
  );

  const filtered = allPosts.filter((post) =>
    TagService.tagInPost(discussionTag, post.frontmatter),
  );

  return (
    <Container>
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-[#2F4F4F]">
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
            <span className="text-[#4682B4] transition-colors hover:text-[#4682B488]">
              ジャンル一覧をご覧ください。
            </span>
          </Link>
        </div>
      </div>
    </Container>
  );
}

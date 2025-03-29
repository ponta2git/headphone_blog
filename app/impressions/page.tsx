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
  title: `感想: ${MetaInfo.siteInfo.name}`,
  description: "機材の感想を集めたページ",
  alternates: {
    ...MetaInfo.metadataBase.alternates,
    canonical: `${MetaInfo.siteInfo.url}impressions`,
  },
  openGraph: {
    ...MetaInfo.metadataBase.openGraph,
    url: `${MetaInfo.siteInfo.url}impressions`,
  },
  twitter: {
    ...MetaInfo.metadataBase.twitter,
    description: "機材の感想を集めたページ",
  },
};

export default async function Page() {
  const tryTag = TagService.fromName("試聴");
  const purchaseTag = TagService.fromName("購入");

  const postdates = (await PostdateService.getAllPostdates()).toReversed();
  const allPosts = await Promise.all(
    postdates.map((date) => PostService.getByPostdate(date)),
  );

  const filtered = allPosts.filter(
    (post) =>
      TagService.tagInPost(tryTag, post.frontmatter) ||
      TagService.tagInPost(purchaseTag, post.frontmatter),
  );

  return (
    <Container>
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading">
        <FontAwesomeIcon
          icon={faHeadphonesSimple}
          className="inline-block h-5 w-5"
        />
        <span className="inline-block">感想</span>
      </h1>
      <div className="flex flex-col gap-y-4">
        <div className="text-justify tracking-[-0.0125rem] break-words">
          わたしが実際に聴いた機材のインプレッションの一覧です。このサイトのメインコンテンツの一つです。わたしの中の機材に対する評価指標・考え方に関しては、こちらの
          <Link href="/tags/metric">
            <span className="text-link-blue transition-colors hover:text-link-blue-hover">
              これらの記事を読むとわかりやすい
            </span>
          </Link>
          ですので、先にそちらをご覧ください。
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

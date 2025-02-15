import Link from "next/link";

import TabContainer from "../../src/components/layout/Tab/TabContainer";
import { toFrontmatter } from "../../src/domain/Frontmatter";
import { allTags, tagInPost } from "../../src/domain/Tag";
import {
  findPostByDateWithCache,
  getAllPostDatesWithCache,
} from "../../src/infrastructure/CachedInfrastructure";
import { MetaInfo } from "../../src/MetaInfo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  ...MetaInfo.metadataBase,
  title: `タグ一覧 - ${MetaInfo.siteInfo.name}`,
  alternates: {
    ...MetaInfo.metadataBase.alternates,
    canonical: `${MetaInfo.siteInfo.url}tags`,
  },
  openGraph: {
    ...MetaInfo.metadataBase.openGraph,
    url: `${MetaInfo.siteInfo.url}tags`,
  },
};

export default async function Page() {
  const tagList = allTags();
  const postDates = await getAllPostDatesWithCache();
  const allPosts = await Promise.all([
    ...postDates.map((date) => findPostByDateWithCache(date)),
  ]);

  const frontmatters = allPosts.map((post) => toFrontmatter(post));

  const stats = tagList.map((tag) => ({
    tag,
    count: frontmatters.reduce(
      (acc, matt) => (tagInPost(tag, matt) ? ++acc : acc),
      0,
    ),
  }));

  return (
    <TabContainer activeTab="tags">
      {stats.map((stat) => (
        <p
          key={stat.tag.path}
          className="flex flex-row items-center justify-center gap-x-[0.125rem]"
        >
          <Link
            href={`/tags/${stat.tag.path}`}
            className="block tracking-[0.4px] transition-colors hover:text-[#40404088]"
          >
            {stat.tag.title}
          </Link>
          <span className="block text-xs tracking-[0.4px] text-[#7b8ca2]">
            ({stat.count})
          </span>
        </p>
      ))}
    </TabContainer>
  );
}

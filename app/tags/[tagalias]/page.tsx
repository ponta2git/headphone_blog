import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TabContainer from "../../../src/components/layout/Tab/TabContainer";
import { ExcerptCard } from "../../../src/components/sections/article/ExcerptCard";
import { toFrontmatter } from "../../../src/domain/Frontmatter";
import { allTags, tagInPost, toTagFromPath } from "../../../src/domain/Tag";
import {
  findPostByDateWithCache,
  getAllPostDatesWithCache,
} from "../../../src/infrastructure/CachedInfrastructure";
import { MetaInfo } from "../../../src/MetaInfo";

import type { Metadata } from "next";

export const dynamicParams = false;

type TagPageRouteParams = {
  tagalias: string;
};

export function generateStaticParams(): TagPageRouteParams[] {
  return allTags().map((tag) => ({ tagalias: tag.path }));
}

export async function generateMetadata(props: {
  params: Promise<TagPageRouteParams>;
}): Promise<Metadata> {
  const params = await props.params;

  const { tagalias } = params;

  const tag = toTagFromPath(tagalias);

  return {
    ...MetaInfo.metadataBase,
    title: `${tag.title}: ${MetaInfo.siteInfo.name}`,
    description: `タグ ${tag.title} の一覧`,
    alternates: {
      ...MetaInfo.metadataBase.alternates,
      canonical: `${MetaInfo.siteInfo.url}tags/${tag.path}`,
    },
    openGraph: {
      ...MetaInfo.metadataBase.openGraph,
      url: `${MetaInfo.siteInfo.url}tags/${tag.path}`,
      type: "article",
    },
    twitter: {
      ...MetaInfo.metadataBase.twitter,
      description: `タグ ${tag.title} の一覧`,
    },
  };
}

export default async function Page(props: {
  params: Promise<TagPageRouteParams>;
}) {
  const params = await props.params;

  const { tagalias } = params;

  const tag = toTagFromPath(tagalias);
  const postDates = (await getAllPostDatesWithCache()).toReversed();
  const allPosts = await Promise.all([
    ...postDates.map((date) => findPostByDateWithCache(date)),
  ]);

  const displayDates = allPosts
    .map((file) => toFrontmatter(file))
    .filter((matt) => tagInPost(tag, matt))
    .map((matter) => matter.date);

  return (
    <TabContainer activeTab="tags">
      <div className="mb-6 flex flex-row items-center justify-center gap-x-1">
        <FontAwesomeIcon icon={faTag} size="sm" className="h-4 w-4" />
        <span className="block">{tag.title}</span>
      </div>
      <div className="flex flex-col gap-y-8">
        {displayDates.map((date) => (
          <ExcerptCard key={date.toISODate()} selfDate={date} />
        ))}
      </div>
    </TabContainer>
  );
}

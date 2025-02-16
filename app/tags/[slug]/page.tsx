import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import Container from "../../../src/components/layout/Container";
import { MetaCard } from "../../../src/components/sections/article/MetaCard";
import { MetaInfo } from "../../../src/MetaInfo";
import { PostdateService } from "../../../src/services/date/PostdateService";
import { PostService } from "../../../src/services/post/PostService";
import { TagService } from "../../../src/services/tag/TagService";

import type { Metadata } from "next";

export const dynamicParams = false;

type TagPageRouteParams = {
  slug: string;
};

export function generateStaticParams(): TagPageRouteParams[] {
  return TagService.allTags().map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<TagPageRouteParams>;
}): Promise<Metadata> {
  const params = await props.params;
  console.info(params);

  const { slug } = params;
  const tag = TagService.fromSlug(slug);

  return {
    ...MetaInfo.metadataBase,
    title: `${tag.name}: ${MetaInfo.siteInfo.name}`,
    description: `タグ ${tag.name} の一覧`,
    alternates: {
      ...MetaInfo.metadataBase.alternates,
      canonical: `${MetaInfo.siteInfo.url}tags/${tag.slug}`,
    },
    openGraph: {
      ...MetaInfo.metadataBase.openGraph,
      url: `${MetaInfo.siteInfo.url}tags/${tag.slug}`,
      type: "article",
    },
    twitter: {
      ...MetaInfo.metadataBase.twitter,
      description: `タグ ${tag.name} の一覧`,
    },
  };
}

export default async function Page(props: {
  params: Promise<TagPageRouteParams>;
}) {
  const params = await props.params;

  const { slug } = params;
  const tag = TagService.fromSlug(slug);

  const postdates = (await PostdateService.getAllPostdates()).toReversed();
  const allPosts = await Promise.all(
    postdates.map((date) => PostService.getByPostdate(date)),
  );
  const filtered = allPosts.filter((post) =>
    TagService.tagInPost(tag, post.frontmatter),
  );

  return (
    <Container>
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-[#2F4F4F]">
        <FontAwesomeIcon icon={faTag} className="inline-block h-5 w-5" />
        <span className="inline-block">{tag.name} に関する記事一覧</span>
      </h1>

      <div className="flex flex-col gap-y-4">
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

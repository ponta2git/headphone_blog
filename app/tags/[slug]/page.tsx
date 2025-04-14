import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
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
  const { slug } = params;
  const tag = TagService.fromSlug(slug);

  // タグページ向けのメタデータを生成
  const metadata = MetaInfo.generateMetadata.tag(tag.name, tag.slug);

  // タグページ向けの構造化データを生成
  const jsonLd = MetaInfo.schemaOrg.collectionPage(
    `${tag.name}に関する記事`,
    `${tag.name}に関連する記事の一覧ページです。`,
    `${MetaInfo.siteInfo.url}tags/${slug}`,
    [],
  );

  return {
    ...metadata,
    other: {
      "json-ld": JSON.stringify(jsonLd),
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
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading">
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
            <span className="text-link-blue transition-colors hover:text-link-blue-hover">
              ジャンル一覧をご覧ください。
            </span>
          </Link>
        </div>
      </div>
    </Container>
  );
}

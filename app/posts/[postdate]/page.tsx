import ArticleTags from "../../../src/ArticleTags";
import { TagItem } from "../../../src/components/elements/TagItem";
import Container from "../../../src/components/layout/Container";
import { Neighbours } from "../../../src/components/sections/article/Neighbours";
import { ShareWith } from "../../../src/components/sections/article/ShareWith";
import RelatedPosts from "../../../src/components/sections/RelatedPosts";
import { MetaInfo } from "../../../src/MetaInfo";
import { PostdateService } from "../../../src/services/date/PostdateService";
import { PostService } from "../../../src/services/post/PostService";

import type { Metadata, ResolvingMetadata } from "next";

export const dynamicParams = false;

type PostPageRouteParams = {
  postdate: string;
};

export async function generateStaticParams(): Promise<PostPageRouteParams[]> {
  const postdates = await PostdateService.getAllPostdates();
  return postdates.map((date) => ({ postdate: date.toFormat("yyyyMMdd") }));
}

export async function generateMetadata(
  props: { params: Promise<PostPageRouteParams> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { postdate } = params;

  const date = PostdateService.from_yyyyMMdd(postdate);
  const post = await PostService.getByPostdate(date);
  const { frontmatter, excerpt, rawContent } = post;

  // JSON-LDの構造化データを生成
  const jsonLd = MetaInfo.schemaOrg.blogPosting(
    frontmatter.title,
    excerpt,
    `${MetaInfo.siteInfo.url}posts/${postdate}`,
    postdate,
  );

  // 新しいメタデータ生成関数を使用
  const metadata = await MetaInfo.generateMetadata.post(
    frontmatter.title,
    excerpt,
    postdate,
    undefined, // 自動検出するのでimageUrlは指定しない
    rawContent, // 代わりにrawContentを渡して自動検出させる
    parent,
  );

  return {
    ...metadata,
    other: {
      "json-ld": JSON.stringify(jsonLd),
    },
  };
}

export default async function Page(props: {
  params: Promise<PostPageRouteParams>;
}) {
  const params = await props.params;
  const { postdate } = params;

  const date = PostdateService.from_yyyyMMdd(postdate);
  const { frontmatter, body } = await PostService.getByPostdate(date);

  return (
    <>
      <Container>
        <article>
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-row items-baseline gap-x-1">
              {frontmatter.tags.map((tag) => (
                <TagItem key={tag.slug} tag={tag} />
              ))}
            </div>

            <h1 className="font-header-setting text-2xl leading-snug font-bold tracking-[0.6px] text-text-heading">
              {frontmatter.title}
            </h1>
          </div>

          <p className="text-sm leading-5 tracking-[0.2px] text-text-meta">
            {frontmatter.date.toFormat("yyyy-MM-dd")}
          </p>

          <div className="my-10 mt-4 flex flex-col gap-[1.725rem] px-3 lg:px-6">
            {body({ components: ArticleTags })}
          </div>

          <div className="px-6">
            <ShareWith
              date={frontmatter.date}
              title={frontmatter.title}
              tags={frontmatter.tags}
            />
          </div>

          <div className="mt-10">
            <Neighbours selfDate={frontmatter.date} />
          </div>
        </article>
      </Container>
      <div className="mx-auto mb-16 w-[85vw] md:w-3/5 lg:w-1/3">
        <RelatedPosts selfTags={frontmatter.tags} selfDate={date} />
      </div>
    </>
  );
}

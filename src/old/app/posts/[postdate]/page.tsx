import ArticleTags from "../../../ArticleTags";
import { TagItem } from "../../../components/elements/TagItem";
import Container from "../../../components/layout/Container";
import { Neighbours } from "../../../components/sections/article/Neighbours";
import { ShareWith } from "../../../components/sections/article/ShareWith";
import RelatedPosts from "../../../components/sections/RelatedPosts";
import { generatePostMetadata } from "../../../posts/meta";
import { getPostByDate, getAllPostDates } from "../../../posts/api";
import { DateTime } from "luxon";
import { TIMEZONE, LOCALE } from "../../../site";

import type { Metadata } from "next";

export const dynamicParams = false;

type PostPageRouteParams = {
  postdate: string;
};

export async function generateStaticParams(): Promise<PostPageRouteParams[]> {
  const dates = await getAllPostDates();
  return dates.map((date) => ({ postdate: date.toFormat("yyyyMMdd") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostPageRouteParams>;
}): Promise<Metadata> {
  const { postdate } = await params;

  const date = DateTime.fromFormat(postdate, "yyyyMMdd", {
    zone: TIMEZONE,
    locale: LOCALE,
  });

  if (!date.isValid) {
    throw new Error(`Invalid postdate: ${postdate}`);
  }

  const post = await getPostByDate(date);
  const canonical = `https://ponta-headphone.net/posts/${postdate}`;

  return generatePostMetadata(post, canonical);
}

export default async function Page({
  params,
}: {
  params: Promise<PostPageRouteParams>;
}) {
  const { postdate } = await params;

  const date = DateTime.fromFormat(postdate, "yyyyMMdd", {
    zone: TIMEZONE,
    locale: LOCALE,
  });

  if (!date.isValid) {
    throw new Error(`Invalid postdate: ${postdate}`);
  }

  const { frontmatter, body } = await getPostByDate(date);

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
            <ShareWith title={frontmatter.title} postdate={postdate} />
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

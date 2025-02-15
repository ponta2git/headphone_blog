import { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkImages from "remark-images"

import ArticleTags from "../../../src/ArticleTags"
import RelatedPosts from "../../../src/components/elements/RelatedPosts"
import { TagItem } from "../../../src/components/elements/TagItem"
import Container from "../../../src/components/layout/Container"
import { Neighbours } from "../../../src/components/sections/article/Neighbours"
import { toFrontmatter } from "../../../src/domain/Frontmatter"
import { toPostDate_yyyyMMdd } from "../../../src/domain/PostDate"
import {
  findPostByDateWithCache,
  getAllPostDatesWithCache,
} from "../../../src/infrastructure/CachedInfrastructure"
import { siteName, siteUrl } from "../../../src/siteBasic"

export const dynamicParams = false

type PostPageRouteParams = {
  postdate: string
}

export async function generateStaticParams(): Promise<PostPageRouteParams[]> {
  const postDates = await getAllPostDatesWithCache()
  return postDates.map((date) => ({ postdate: date.toFormat("yyyyMMdd") }))
}

export async function generateMetadata(
  props: {
    params: Promise<PostPageRouteParams>
  }
): Promise<Metadata> {
  const params = await props.params;

  const {
    postdate
  } = params;

  const date = toPostDate_yyyyMMdd(postdate)
  const file = await findPostByDateWithCache(date)

  const frontmatter = toFrontmatter(file)

  return {
    metadataBase: new URL(siteUrl),
    title: `${frontmatter.title} - ${siteName}`,
    alternates: {
      canonical: `${siteUrl}posts/${postdate}`,
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      url: `${siteUrl}posts/${postdate}`,
      locale: "ja_JP",
      type: "article",
      title: `${frontmatter.title} - ${siteName}`,
      siteName,
    },
    twitter: {
      card: "summary",
      site: "@ponta2twit",
    },
  }
}

export default async function Page(
  props: {
    params: Promise<PostPageRouteParams>
  }
) {
  const params = await props.params;

  const {
    postdate
  } = params;

  const postDate = toPostDate_yyyyMMdd(postdate)
  const post = await findPostByDateWithCache(postDate)
  const frontmatter = toFrontmatter(post)

  return (
    <>
      <Container postMode>
        <article>
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-row items-baseline gap-x-1 leading-tight">
              {frontmatter.tags.map((tag) => (
                <TagItem key={tag.path} tag={tag} />
              ))}
            </div>

            <h1 className="line-break-strict text-2xl font-bold leading-snug tracking-[0.6px]">
              {frontmatter.title}
            </h1>
          </div>

          <div className="text-sm leading-7 tracking-[0.2px]">
            <p className="text-slate-500">
              {frontmatter.date.toFormat("yyyy-MM-dd")}
            </p>
          </div>

          <div className="mx-2 my-10 mt-6 flex flex-col gap-[1.825rem] lg:px-2">
            <MDXRemote
              source={post}
              components={ArticleTags}
              options={{
                parseFrontmatter: true,
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkImages],
                },
              }}
            />
          </div>

          <div className="mt-10">
            <Neighbours selfDate={postDate} />
          </div>
        </article>
      </Container>
      <div className="mx-auto mb-24 w-[85vw] md:mx-auto md:w-3/5 lg:w-1/2">
        <RelatedPosts selfTags={frontmatter.tags} selfDate={postDate} />
      </div>
    </>
  )
}

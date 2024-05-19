import { readFile } from "fs/promises"

import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import matter from "gray-matter"
import { DateTime } from "luxon"
import { Metadata } from "next"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"

import ArticleTags from "../../../src/components/PageElements/ArticleTags"
import Container from "../../../src/components/PageElements/Container"
import RelatedPosts from "../../../src/components/PageElements/RelatedPosts"
import { TagItem } from "../../../src/components/PageElements/TagItem"
import { toFrontmatter } from "../../../src/domain/Frontmatter"
import { getAllPostDatesWithCache } from "../../../src/infrastructure/CachedInfrastructure"
import { siteName, siteUrl } from "../../../src/siteBasic"

export const dynamicParams = false

type PostPageRouteParams = {
  postdate: string
}

export async function generateStaticParams(): Promise<PostPageRouteParams[]> {
  const postDates = await getAllPostDatesWithCache()
  return postDates.map((date) => ({ postdate: date.toFormat("yyyyMMdd") }))
}

export async function generateMetadata({
  params: { postdate },
}: {
  params: PostPageRouteParams
}): Promise<Metadata> {
  const date = DateTime.fromFormat(postdate, "yyyyMMdd")
  const file = await readFile(
    `posts/${date.year}/${date.toFormat("yyyyMMdd")}.mdx`,
  )

  const frontmatter = toFrontmatter(matter(file).data)

  return {
    metadataBase: new URL(siteUrl),
    title: `${frontmatter.title} - ${siteName}`,
    alternates: {
      canonical: `${siteUrl}posts/${postdate}`,
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

export default async function Page({
  params: { postdate },
}: {
  params: PostPageRouteParams
}) {
  const postDates = await getAllPostDatesWithCache()
  const pos = postDates.findIndex(
    (date) => date.toFormat("yyyyMMdd") === postdate,
  )

  const allPosts = await Promise.all([
    ...postDates.map((date) =>
      readFile(`posts/${date.year}/${date.toFormat("yyyyMMdd")}.mdx`),
    ),
  ])

  const [prev, post, next] = await Promise.all([
    pos > 0 ? allPosts[pos - 1] : undefined,
    allPosts[pos],
    pos < postDates.length - 1 ? allPosts[pos + 1] : undefined,
  ])

  const rawMatter = matter(String(post))
  const frontmatter = toFrontmatter(rawMatter.data)

  const prevRawMatter = prev ? matter(String(prev)) : undefined
  const prevMatter = prevRawMatter
    ? toFrontmatter(prevRawMatter.data)
    : undefined
  const nextRawMatter = next ? matter(String(next)) : undefined
  const nextMatter = nextRawMatter
    ? toFrontmatter(nextRawMatter.data)
    : undefined

  const related = allPosts
    .filter((_, idx) => idx !== pos)
    .map((post) => matter(String(post)))
    .map((raw) => toFrontmatter(raw.data))
    .filter((cand) =>
      frontmatter.tags.some((postTag) =>
        cand.tags.some((candTag) => postTag.path === candTag.path),
      ),
    )
    .toReversed()
    .slice(0, 5)

  return (
    <>
      <Container postMode>
        <article>
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-row items-baseline gap-x-1">
              {frontmatter.tags.map((tag) => (
                <TagItem key={tag.path} tag={tag} />
              ))}
            </div>

            <h2 className="mx-2 text-2xl font-bold leading-snug tracking-[0.6px]">
              {frontmatter.title}
            </h2>
          </div>

          <div className="text-sm leading-7 tracking-[0.2px]">
            <p className="ml-[0.5rem] text-slate-500">
              {frontmatter.date.toFormat("yyyy-MM-dd")}
            </p>
          </div>

          <div className="mx-2 my-10 mt-6 flex flex-col gap-[1.825rem] lg:px-2">
            <MDXRemote
              source={post}
              components={ArticleTags}
              options={{ parseFrontmatter: true }}
            />
          </div>

          {/* <PostText date={postdate} /> */}

          <div className="inline-flex flex-row items-center justify-start gap-2 text-xs text-[#7b8ca2] lg:px-2">
            <p>Share with</p>
            <p className="h-4 w-4">
              <a
                href={
                  `https://twitter.com/intent/tweet` +
                  `?text=${frontmatter.title} - ${siteName}` +
                  `&url=https://ponta-headphone.net/posts/${frontmatter.date.toFormat("yyyyMMdd")}`
                }
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} size="1x" />
              </a>
            </p>
          </div>

          <div className="mt-10 flex w-full flex-row items-center justify-start">
            <div className="w-[20px] shrink-0 items-center">
              <FontAwesomeIcon icon={faChevronLeft} className="block h-4 w-4" />
            </div>
            <div className="w-1/3 shrink-0 pl-2 text-sm leading-6">
              {prevMatter && (
                <Link
                  href={`/posts/${prevMatter.date.toFormat("yyyyMMdd")}`}
                  className="text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
                >
                  {prevMatter.title}
                </Link>
              )}
            </div>
            <div className="w-1/3"></div>
            <div className="w-1/3 shrink-0 pr-2 text-right text-sm leading-6">
              {nextMatter && (
                <Link
                  href={`/posts/${nextMatter.date.toFormat("yyyyMMdd")}`}
                  className="text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
                >
                  {nextMatter.title}
                </Link>
              )}
            </div>
            <div className="w-[20px] shrink-0 items-center">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="ml-2 block h-4 w-4"
              />
            </div>
          </div>
        </article>
      </Container>
      <RelatedPosts tags={frontmatter.tags} frontmatters={related} />
    </>
  )
}

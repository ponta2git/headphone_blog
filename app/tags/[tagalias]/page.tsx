import { faTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Metadata } from "next"

import Container from "../../../src/components/PageElements/Container"
import { ExcerptCard } from "../../../src/components/PageElements/ExcerptCard"
import { Tab } from "../../../src/components/PageElements/Tab"
import Wrapper from "../../../src/components/PageElements/Wrapper"
import {
  allTags,
  tagInPost,
  toTagFromPathString,
} from "../../../src/domain/Tag"
import {
  getAllPostDatesWithCache,
  findPostByWithCache,
} from "../../../src/infrastructure/CachedInfrastructure"
import { siteName, siteUrl } from "../../../src/siteBasic"

export const dynamicParams = false

type TagPageRouteParams = {
  tagalias: string
}

export function generateStaticParams() {
  return allTags().map((tag) => ({ tagalias: tag.path }))
}

export function generateMetadata({
  params: { tagalias },
}: {
  params: TagPageRouteParams
}): Metadata {
  const tag = toTagFromPathString(tagalias)

  return {
    metadataBase: new URL(siteUrl),
    title: `${tag.title}: ${siteName}`,
    description: `タグ ${tag.title} の一覧`,
    alternates: {
      canonical: `${siteUrl}tags/${tag.path}`,
    },
    openGraph: {
      url: `${siteUrl}tags/${tag.path}`,
      locale: "ja-JP",
      type: "article",
    },
    twitter: {
      card: "summary",
      site: "@ponta2twit",
      description: `タグ ${tag.title} の一覧`,
    },
  }
}

export default async function Page({
  params: { tagalias },
}: {
  params: TagPageRouteParams
}) {
  const tag = toTagFromPathString(tagalias)
  const postDates = (await getAllPostDatesWithCache()).toReversed()
  const posts = (
    await Promise.all(postDates.map((date) => findPostByWithCache(date)))
  ).filter((post) => tagInPost(tag, post))

  return (
    <Wrapper>
      <Tab active="tags" />
      <Container>
        <div className="mb-6 flex flex-row items-center justify-center gap-x-1">
          <FontAwesomeIcon icon={faTag} size="sm" className="h-4 w-4" />
          <span className="block text-sm">{tag.title}</span>
        </div>
        <div className="flex flex-col gap-y-14">
          {posts.map((post) => (
            <ExcerptCard key={post.frontmatter.date.toISODate()} post={post} />
          ))}
        </div>
      </Container>
    </Wrapper>
  )
}

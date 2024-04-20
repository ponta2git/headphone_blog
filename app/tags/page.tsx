import { Metadata } from "next"
import Link from "next/link"

import Container from "../../src/components/PageElements/Container"
import { Tab } from "../../src/components/PageElements/Tab"
import Wrapper from "../../src/components/PageElements/Wrapper"
import { allTags, tagInPost } from "../../src/domain/Tag"
import {
  getAllPostDatesWithCache,
  findPostByWithCache,
} from "../../src/infrastructure/CachedInfrastructure"
import { siteName, siteUrl } from "../../src/siteBasic"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `タグ一覧 - ${siteName}`,
  alternates: {
    canonical: `${siteUrl}tags`,
  },
  openGraph: {
    url: `${siteUrl}tags`,
    locale: "ja-JP",
    type: "website",
    siteName,
  },
  twitter: {
    card: "summary",
    site: "@ponta2twit",
  },
}

export default async function Page() {
  const tagList = allTags()
  const postDates = await getAllPostDatesWithCache()
  const posts = (
    await Promise.all(postDates.map((date) => findPostByWithCache(date)))
  ).toReversed()

  const stats = tagList.map((tag) => ({
    tag,
    count: posts.reduce((acc, post) => (tagInPost(tag, post) ? ++acc : acc), 0),
  }))

  return (
    <Wrapper>
      <Tab active="tags" />
      <Container>
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
      </Container>
    </Wrapper>
  )
}

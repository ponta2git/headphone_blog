import { Metadata } from "next"
import TagPageService from "../../../src/services/TagPageService"
import { siteName } from "../../../src/siteBasic"
import { ExcerptCard } from "../../../src/components/PageElements/ExcerptCard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTag } from "@fortawesome/free-solid-svg-icons"
import { Tab } from "../../../src/components/PageElements/Tab"

export const dynamicParams = false

export type TagPageRouteParams = {
  tagalias: string
}

const service = await TagPageService.create()

export function generateStaticParams() {
  return service.getRouteParams()
}

export function generateMetadata({
  params: { tagalias },
}: {
  params: TagPageRouteParams
}): Metadata {
  const tag = service.buildMetadataSource(tagalias)

  return {
    metadataBase: new URL("https://ponta-headphone.net"),
    title: `${tag.title}: ${siteName}`,
    alternates: {
      canonical: `https://ponta-headphone.net/tags/${tag.alias}`,
    },
    openGraph: {
      url: `https://ponta-headphone.net/tags/${tag.alias}`,
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

export default function Page({
  params: { tagalias },
}: {
  params: TagPageRouteParams
}) {
  const { tag, posts } = service.getData(tagalias)

  return (
    <>
      <Tab active="tags" />
      <div className="mb-6 flex flex-row items-center justify-center gap-x-1">
        <FontAwesomeIcon icon={faTag} size="sm" className="h-4 w-4" />
        <span className="block text-sm">{tag.title}</span>
      </div>
      <div className="flex flex-col gap-y-14">
        {posts.map((post) => (
          <ExcerptCard key={post.frontmatter.date} post={post} />
        ))}
      </div>
    </>
  )
}

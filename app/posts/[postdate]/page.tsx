import { Metadata } from "next"
import Link from "next/link"
import { siteName } from "../../../src/libs/siteBasic"
import PostPageService from "../../../src/services/PostPageService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import ArticleTags from "../../../src/components/PageElements/ArticleTags"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

export const dynamicParams = false

type PostRouteParams = {
  postdate: string
}

const service = new PostPageService()

export function generateStaticParams(): PostRouteParams[] {
  return service.getRouteParams()
}

export async function generateMetadata({
  params: { postdate },
}: {
  params: PostRouteParams
}): Promise<Metadata> {
  const { frontmatter, description } = await service.buildMetadataSource(
    postdate,
  )

  return {
    title: `${frontmatter.title} - ${siteName}`,
    alternates: {
      canonical: `https://ponta-headphone.net/posts/${postdate}`,
    },
    openGraph: {
      url: `https://ponta-headphone.net/posts/${postdate}`,
      locale: "ja-JP",
      type: "article",
    },
    twitter: {
      card: "summary",
      site: "@ponta2twit",
      description: description,
    },
  }
}

export default async function Page({
  params: { postdate },
}: {
  params: PostRouteParams
}) {
  const { post, prev, next } = await service.getData(postdate)
  const { frontmatter, content } = post

  return (
    <article>
      <div className="flex flex-col gap-y-1">
        <h2 className="text-2xl font-bold leading-snug tracking-[0.4px]">
          {frontmatter.title}
        </h2>
        <div className="flex flex-row items-center gap-x-2">
          <time className="text-xs leading-tight tracking-tight text-[#7b8ca2]">
            {frontmatter.date}
          </time>
          {/*
          <div className="flex flex-row gap-x-1">
            {frontmatter.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          */}
        </div>
      </div>

      <div className="mx-2 my-6 flex flex-col gap-6">
        {content({ components: ArticleTags })}
      </div>

      <div className="flex flex-row items-center justify-start gap-2">
        <p>Share with:</p>
        <p className="h-4 w-4">
          <a
            href={
              `https://twitter.com/intent/tweet` +
              `?text=${frontmatter.title} - ${siteName}` +
              `&url=https://ponta-headphone.net/posts/${frontmatter.date}`
            }
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} size="1x" />
          </a>
        </p>
      </div>

      <div className="mt-6 flex w-full flex-row items-start justify-start text-[#1E6FBA]">
        <div className="w-1/3 shrink-0">
          {prev && (
            <Link
              href={`/posts/${prev.date.replaceAll("-", "")}`}
              className="transition-colors hover:text-[#1E6FBA88]"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="mr-2 inline h-4 w-4 align-middle"
              />
              {prev.title}
            </Link>
          )}
        </div>
        <div className="w-1/3"></div>
        <div className="w-1/3 shrink-0 text-right transition-colors hover:text-[#1E6FBA88]">
          {next && (
            <Link
              href={`/posts/${next.date.replaceAll("-", "")}`}
              className="transition-colors hover:text-[#1E6FBA88]"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 inline h-4 w-4 align-middle"
              />
              {next.title}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

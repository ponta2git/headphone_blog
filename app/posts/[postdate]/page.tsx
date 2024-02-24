import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Metadata } from "next"
import Link from "next/link"

import ArticleTags from "../../../src/components/PageElements/ArticleTags"
import Container from "../../../src/components/PageElements/Container"
import { TagItem } from "../../../src/components/PageElements/TagItem"
import PostPageService from "../../../src/services/PostPageService"
import { siteName, siteUrl } from "../../../src/siteBasic"

export const dynamicParams = false

export type PostPageRouteParams = {
  postdate: string
}

const service = new PostPageService()

export function generateStaticParams(): PostPageRouteParams[] {
  return service.getRouteParams()
}

export async function generateMetadata({
  params: { postdate },
}: {
  params: PostPageRouteParams
}): Promise<Metadata> {
  const { frontmatter, description } =
    await service.buildMetadataSource(postdate)

  return {
    metadataBase: new URL(siteUrl),
    title: `${frontmatter.title} - ${siteName}`,
    description,
    alternates: {
      canonical: `${siteUrl}posts/${postdate}`,
    },
    openGraph: {
      url: `${siteUrl}posts/${postdate}`,
      locale: "ja_JP",
      type: "article",
      title: `${frontmatter.title} - ${siteName}`,
      siteName,
      description,
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
  const { post, prev, next } = await service.getData(postdate)
  const { frontmatter, content } = post

  return (
    <Container>
      <article>
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-row items-baseline gap-x-1">
            {frontmatter.tags.map((tag) => (
              <TagItem key={tag.alias} tag={tag} />
            ))}
          </div>

          <h2 className="mx-2 text-2xl font-bold leading-snug tracking-[0.4px]">
            {frontmatter.title}
          </h2>
        </div>

        <div className="mx-2 my-10 flex flex-col gap-[1.825rem] lg:px-2">
          {content({ components: ArticleTags })}
        </div>

        <div className="inline-flex flex-row items-center justify-start gap-2 text-xs text-[#7b8ca2] lg:px-2">
          <p>Share with</p>
          <p className="h-4 w-4">
            <a
              href={
                `https://twitter.com/intent/tweet` +
                `?text=${frontmatter.title} - ${siteName}` +
                `&url=https://ponta-headphone.net/posts/${frontmatter.date.replaceAll(
                  "-",
                  "",
                )}`
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
            {prev && (
              <Link
                href={`/posts/${prev.date.replaceAll("-", "")}`}
                className="text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
              >
                {prev.title}
              </Link>
            )}
          </div>
          <div className="w-1/3"></div>
          <div className="w-1/3 shrink-0 pr-2 text-right text-sm leading-6">
            {next && (
              <Link
                href={`/posts/${next.date.replaceAll("-", "")}`}
                className="text-[#1E6FBA] transition-colors hover:text-[#1E6FBA88]"
              >
                {next.title}
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
  )
}

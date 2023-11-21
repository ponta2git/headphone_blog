import { Metadata } from "next"
import Link from "next/link"
import { siteName } from "../../../src/siteBasic"
import PostPageService from "../../../src/services/PostPageService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import ArticleTags from "../../../src/components/PageElements/ArticleTags"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { TagItem } from "../../../src/components/PageElements/TagItem"

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
    metadataBase: new URL("https://ponta-headphone.net"),
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
  params: PostPageRouteParams
}) {
  const { post, prev, next } = await service.getData(postdate)
  const { frontmatter, content } = post

  return (
    <article>
      <div className="flex flex-col gap-y-1 pt-8">
        <h2 className="text-2xl font-bold leading-snug tracking-[0.4px]">
          {frontmatter.title}
        </h2>

        <time className="text-xs leading-tight tracking-tight text-[#7b8ca2]">
          {frontmatter.date}
        </time>
        <div className="flex flex-row gap-x-1">
          {frontmatter.tags.map((tag) => (
            <TagItem key={tag.alias} tag={tag} />
          ))}
        </div>
      </div>

      <div className="mx-2 my-6 flex flex-col gap-6">
        {content({ components: ArticleTags })}
      </div>

      <div className="inline-flex flex-row items-center justify-start gap-2 text-xs text-[#7b8ca2]">
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
  )
}

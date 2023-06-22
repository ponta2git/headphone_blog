import { Metadata } from "next"
import { siteName } from "../../../libs/siteBasic"
import PostPageService from "../../../services/PostPageService"

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

  return (
    <>
      <h2>Hi! Page</h2>
    </>
  )
}

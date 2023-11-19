import { Metadata } from "next"
import TagIndexPageService from "../../src/services/TagIndexPageService"
import { siteName } from "../../src/siteBasic"
import { Tab } from "../../src/components/PageElements/Tab"
import Link from "next/link"

const service = await TagIndexPageService.create()

export const metadata: Metadata = {
  metadataBase: new URL("https://ponta-headphone.net"),
  title: `タグ一覧 - ${siteName}`,
  alternates: {
    canonical: "https://ponta-headphone.net/tags",
  },
  openGraph: {
    url: "https://ponta-headphone.net/tags",
    locale: "ja-JP",
    type: "website",
  },
}

export default function Page() {
  const { tagStats } = service.getData()

  return (
    <>
      <Tab active="tags" />
      {tagStats.map((stat) => (
        <p
          key={stat.tag.alias}
          className="flex flex-row items-baseline justify-center gap-x-1"
        >
          <Link
            href={`/tags/${stat.tag.alias}`}
            className="block transition-colors hover:text-[#40404088]"
          >
            {stat.tag.title}
          </Link>
          <span className="block text-xs text-[#7b8ca2]">({stat.count})</span>
        </p>
      ))}
    </>
  )
}

import { Metadata } from "next"
import Link from "next/link"

import Container from "../../src/components/PageElements/Container"
import { Tab } from "../../src/components/PageElements/Tab"
import Wrapper from "../../src/components/PageElements/Wrapper"
import TagIndexPageService from "../../src/services/TagIndexPageService"
import { siteName } from "../../src/siteBasic"

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
    <Wrapper>
      <Tab active="tags" />
      <Container>
        {tagStats.map((stat) => (
          <p
            key={stat.tag.alias}
            className="flex flex-row items-center justify-center gap-x-[0.125rem]"
          >
            <Link
              href={`/tags/${stat.tag.alias}`}
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

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import Container from "../../src/components/layout/Container";
import { MetaInfo } from "../../src/MetaInfo";
import { PostdateService } from "../../src/services/date/PostdateService";
import { PostService } from "../../src/services/post/PostService";
import { TagService } from "../../src/services/tag/TagService";

import type { Metadata } from "next";

export const metadata: Metadata = {
  ...MetaInfo.metadataBase,
  title: `タグ一覧 - ${MetaInfo.siteInfo.name}`,
  alternates: {
    ...MetaInfo.metadataBase.alternates,
    canonical: `${MetaInfo.siteInfo.url}tags`,
  },
  openGraph: {
    ...MetaInfo.metadataBase.openGraph,
    url: `${MetaInfo.siteInfo.url}tags`,
  },
};

export default async function Page() {
  const allTags = TagService.allTags();
  const postdates = await PostdateService.getAllPostdates();
  const allPosts = await Promise.all(
    postdates.map((date) => PostService.getByPostdate(date)),
  );

  const frontmatters = allPosts.map((post) => post.frontmatter);

  const stats = allTags.map((tag) => ({
    tag,
    count: frontmatters.reduce(
      (acc, matt) => (TagService.tagInPost(tag, matt) ? ++acc : acc),
      0,
    ),
  }));

  return (
    <Container>
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-[#2F4F4F]">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="inline-block h-5 w-5"
        />
        <span className="inline-block">どのような記事をお探しですか？</span>
      </h1>
      <div className="flex flex-col gap-y-4">
        <div className="text-justify tracking-[-0.0125rem] break-words">
          以下のようなジャンルの内容を扱っています。興味のあるジャンルを選択すると、関連する記事の一覧に飛べます。
        </div>
        <div>
          {stats.map((stat) => (
            <p
              key={stat.tag.slug}
              className="flex flex-row items-center gap-x-[0.125rem]"
            >
              <Link
                href={`/tags/${stat.tag.slug}`}
                className="block tracking-[0.4px] text-[#4682B4] transition-colors hover:text-[#4682B488]"
              >
                {stat.tag.name}
              </Link>
              <span className="block text-xs tracking-[0.4px] text-[#7b8ca2]">
                (記事数:{stat.count})
              </span>
            </p>
          ))}
        </div>
        <div className="text-justify tracking-[-0.0125rem] break-words">
          <p>
            すべての記事の一覧は
            <Link href="/all-articles">
              <span className="text-[#4682B4] transition-colors hover:text-[#4682B488]">
                こちらにあります。
              </span>
            </Link>
          </p>
        </div>

        <p className="text-justify text-sm tracking-[-0.0125rem] break-words">
          こんな記事が読みたい！というご要望がございましたら、よほど気が向かないと記事になりませんが、coshun
          [at] gmail.com または、Twitter @ponta2twit
          まで言うだけ言ってみてください。
        </p>
      </div>
    </Container>
  );
}

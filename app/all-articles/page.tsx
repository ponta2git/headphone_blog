import { faNewspaper } from "@fortawesome/free-solid-svg-icons/faNewspaper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../src/components/layout/Container";
import { MetaCard } from "../../src/components/sections/article/MetaCard";
import { MetaInfo } from "../../src/MetaInfo";
import { PostdateService } from "../../src/services/date/PostdateService";
import { PostService } from "../../src/services/post/PostService";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "全記事一覧";
  const description = "すべての記事を集めたページ";
  const pagePath = "all-articles";

  return MetaInfo.generateMetadata.archive(title, pagePath, description);
}

export default async function Page() {
  const postdates = (await PostdateService.getAllPostdates()).toReversed();
  const allPosts = await Promise.all(
    postdates.map((date) => PostService.getByPostdate(date)),
  );

  return (
    <Container>
      <h1 className="font-header-setting mb-4 flex flex-row items-center gap-x-1.5 text-lg text-text-heading">
        <FontAwesomeIcon icon={faNewspaper} className="inline-block h-5 w-5" />
        <span className="inline-block">全記事一覧</span>
      </h1>
      <div className="flex flex-col gap-y-4">
        {allPosts.map((post) => (
          <MetaCard key={post.frontmatter.date.toISO()} post={post} />
        ))}
      </div>
    </Container>
  );
}

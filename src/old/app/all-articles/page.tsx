import { faNewspaper } from "@fortawesome/free-solid-svg-icons/faNewspaper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/layout/Container";
import { MetaCard } from "../../components/sections/article/MetaCard";
import { generateArchiveMetadata } from "../../posts/meta";
import { getAllPosts } from "../../posts/api";

export function generateMetadata() {
  return generateArchiveMetadata(
    "すべての記事",
    "all-articles",
    "全記事の一覧",
  );
}

export default async function Page() {
  const allPosts = await getAllPosts();

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

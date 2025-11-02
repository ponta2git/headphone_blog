import { faNewspaper } from "@fortawesome/free-solid-svg-icons/faNewspaper";
import { PageLayout } from "../../components/layouts/PageLayout";
import { PageHeader } from "../../components/features/PageHeader";
import { ArticleCard } from "../../components/features/ArticleCard";
import { Stack } from "../../components/ui/Stack";
import { getAllPosts } from "../../posts/api";
import { generateArchiveMetadata } from "../../posts/meta";

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
    <PageLayout>
      <PageHeader title="全記事一覧" icon={faNewspaper} />
      <Stack gap={5}>
        {allPosts.map((post) => (
          <ArticleCard key={post.frontmatter.date.toISO()} post={post} />
        ))}
      </Stack>
    </PageLayout>
  );
}

import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { PageHeader } from "../../../components/features/PageHeader";
import { ArticleCard } from "../../../components/features/ArticleCard";
import { getPostsByTag } from "../../../posts/api";
import { generateTagMetadata } from "../../../posts/meta";
import { fromSlug, getAllTags } from "../../../lib/tag";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  const tags = getAllTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const tag = fromSlug(slug);
  return generateTagMetadata(tag.name, tag.slug);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tag = fromSlug(slug);
  const posts = await getPostsByTag(tag);

  return (
    <PageLayout>
      <PageHeader title={`#${tag.name}`} icon={faTag} />
      {posts.map((post) => (
        <ArticleCard key={post.frontmatter.date.toISO()} post={post} />
      ))}
    </PageLayout>
  );
}

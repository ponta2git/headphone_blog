import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import Link from "next/link";
import { PageLayout } from "../../components/layouts/PageLayout";
import { PageHeader } from "../../components/features/PageHeader";
import { getTagStats } from "../../posts/api";
import { generateArchiveMetadata } from "../../posts/meta";

export function generateMetadata() {
  return generateArchiveMetadata("タグ", "tags", "タグ一覧");
}

export default async function Page() {
  const stats = await getTagStats();
  return (
    <PageLayout>
      <PageHeader title="タグ" icon={faTags} />
      <ul>
        {stats.map(({ tag, count }) => (
          <li key={tag.slug}>
            <Link href={`/tags/${tag.slug}`}>{tag.name}</Link>{" "}
            <span>({count})</span>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}

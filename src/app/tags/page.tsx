import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { PageLayout } from "../../components/layouts/PageLayout";
import { PageHeader } from "../../components/features/PageHeader";
import { getTagStats } from "../../posts/api";
import { generateArchiveMetadata } from "../../posts/meta";
import { Badge } from "../../components/ui/Badge";
import { Link } from "../../components/ui/Link";
import styles from "./page.module.css";
import { CONTENT_CONSTANTS } from "../../site";
import { JsonLd } from "../../components/seo/JsonLd";
import { generateCollectionPageSchema } from "../../posts/meta";
import { siteConfig } from "../../site";

export function generateMetadata() {
  return generateArchiveMetadata("タグ", "tags", "タグ一覧");
}

export default async function Page() {
  const stats = await getTagStats();
  const byCountDesc = [...stats].sort((a, b) => b.count - a.count);
  const top = byCountDesc.slice(0, CONTENT_CONSTANTS.POPULAR_TAGS_COUNT);
  const all = [...stats].sort((a, b) =>
    a.tag.name.localeCompare(b.tag.name, "ja"),
  );
  return (
    <PageLayout>
      <JsonLd
        data={generateCollectionPageSchema(
          "タグ",
          "タグ一覧",
          `${siteConfig.url}/tags`,
        )}
      />
      <PageHeader title="タグ" icon={faTags} />
      <p className={styles.lead}>
        タグから記事を探せます。人気のタグ（上位
        {CONTENT_CONSTANTS.POPULAR_TAGS_COUNT}
        件）と、すべてのタグ（50音順）を掲載しています。
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          人気のタグ（上位{CONTENT_CONSTANTS.POPULAR_TAGS_COUNT}件）
        </h2>
        <div className={styles.badgesWrap}>
          {top.map(({ tag, count }) => (
            <Badge
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              rel="tag"
              ariaLabel={`タグ ${tag.name}（${count}件の記事）`}
            >
              {tag.name}
              <span className={styles.count}>({count})</span>
            </Badge>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>すべてのタグ（50音順）</h2>
        <div className={styles.grid}>
          {all.map(({ tag, count }) => (
            <Badge
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              variant="outlined"
              rel="tag"
              ariaLabel={`タグ ${tag.name}（${count}件の記事）`}
            >
              {tag.name}
              <span className={styles.count}>({count})</span>
            </Badge>
          ))}
        </div>
      </section>

      <p className={styles.moreLinks}>
        <Link href="/all-articles" variant="secondary">
          全記事一覧へ
        </Link>
      </p>
    </PageLayout>
  );
}

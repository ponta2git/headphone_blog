import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { PageHeader } from "../../../components/features/PageHeader";
import { ArticleCard } from "../../../components/features/ArticleCard";
import { getPostsByTag } from "../../../posts/api";
import { generateTagMetadata } from "../../../posts/meta";
import { fromSlug, getAllTags } from "../../../lib/tag";
import { CONTENT_CONSTANTS } from "../../../site";
import { Badge } from "../../../components/ui/Badge";
import { Link } from "../../../components/ui/Link";
import styles from "./page.module.css";
import { JsonLd } from "../../../components/seo/JsonLd";
import { generateCollectionPageSchema } from "../../../posts/meta";
import { siteConfig } from "../../../site";

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
  const count = posts.length;

  // 関連タグ（共起回数の多い順、現在のタグは除外）
  const cooccur = new Map<
    string,
    { name: string; slug: string; count: number }
  >();
  for (const p of posts) {
    for (const t of p.frontmatter.tags) {
      if (t.slug === tag.slug) continue;
      const prev = cooccur.get(t.slug) ?? {
        name: t.name,
        slug: t.slug,
        count: 0,
      };
      prev.count += 1;
      cooccur.set(t.slug, prev);
    }
  }
  const related = Array.from(cooccur.values())
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.name.localeCompare(b.name, "ja") ||
        a.slug.localeCompare(b.slug, "ja"),
    )
    .slice(0, CONTENT_CONSTANTS.RELATED_TAGS_COUNT);

  return (
    <PageLayout>
      <JsonLd
        data={generateCollectionPageSchema(
          `タグ: ${tag.name}`,
          `${tag.name}に関する記事一覧`,
          `${siteConfig.url}/tags/${tag.slug}`,
        )}
      />
      <nav aria-label="breadcrumb" className={styles.breadcrumb}>
        <Link href="/" variant="muted">
          ホーム
        </Link>
        <span className={styles.sep}>/</span>
        <Link href="/tags" variant="muted">
          タグ
        </Link>
        <span className={styles.sep}>/</span>
        <span aria-current="page">{tag.name}</span>
      </nav>
      <PageHeader title={`#${tag.name}`} icon={faTag} />

      <p className={styles.meta}>記事数: {count}件</p>

      {related.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>関連タグ</h2>
          <div className={styles.badgesWrap}>
            {related.map((t) => (
              <Badge
                key={t.slug}
                href={`/tags/${t.slug}`}
                rel="tag"
                ariaLabel={`タグ ${t.name}（${t.count}件の記事）`}
              >
                {t.name}
                <span className={styles.count}>({t.count})</span>
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>記事（{count}件）</h2>
        {posts.map((post) => (
          <ArticleCard key={post.frontmatter.date.toISO()} post={post} />
        ))}
      </section>

      <p className={styles.moreLinks}>
        <Link href="/tags" variant="secondary">
          すべてのタグへ
        </Link>
        <span className={styles.sep}>·</span>
        <Link href="/all-articles" variant="secondary">
          全記事一覧へ
        </Link>
      </p>
    </PageLayout>
  );
}

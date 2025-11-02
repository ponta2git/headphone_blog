import { PageLayout } from "../components/layouts/PageLayout";
import { ArticleCard } from "../components/features/ArticleCard";
import { Stack } from "../components/ui/Stack";
import { Link } from "../components/ui/Link";
import { Badge } from "../components/ui/Badge";
import { getAllPosts, getTagStats } from "../posts/api";
import styles from "./page.module.css";

export default async function Page() {
  // 最新記事（最大6件）
  const allPosts = await getAllPosts();
  const posts = allPosts.slice(0, 6);

  // タグ統計（上位9件）
  const tagStats = await getTagStats();
  const topTags = [...tagStats].sort((a, b) => b.count - a.count).slice(0, 9);

  return (
    <PageLayout>
      <p className={styles.lead}>
        ヘッドホンオーディオを楽しんでいます。ヘッドホンや機材のインプレッションやヘッドホンオーディオの楽しみ方などについて気楽に書き連ねています。
      </p>

      <Stack gap={10}>
        <section>
          <h2 className={styles.sectionTitle}>最近の記事</h2>
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <ArticleCard
                key={post.frontmatter.date.toISO()}
                post={post}
                variant="compact"
                headingLevel="h3"
                hoverVariant="subtle"
              />
            ))}
          </div>
          <p className={styles.moreLink}>
            <Link href="/all-articles" variant="primary">
              全記事一覧へ
            </Link>
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>タグから探す</h2>
          <div className={styles.tagsWrap}>
            {topTags.map(({ tag, count }) => (
              <Badge key={tag.slug} href={`/tags/${tag.slug}`}>
                {tag.name}
                <span className={styles.badgeCount}>({count})</span>
              </Badge>
            ))}
            <Badge href="/tags" variant="outlined">
              すべてのタグを見る →
            </Badge>
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>コレクション</h2>
          <ul className={styles.linkList}>
            <li>
              <Link href="/discussions" variant="secondary">
                ディスカッション（雑談や考えごと）
              </Link>
            </li>
            <li>
              <Link href="/impressions" variant="secondary">
                インプレッション（機材の短評）
              </Link>
            </li>
            <li>
              <Link href="/all-articles" variant="secondary">
                全記事一覧
              </Link>
            </li>
          </ul>
        </section>
      </Stack>
    </PageLayout>
  );
}

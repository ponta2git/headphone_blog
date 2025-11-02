import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons/faNewspaper";
import type { Post } from "../../../posts/types";
import { ArticleCard } from "../../features/ArticleCard";
import styles from "./RelatedPostsSection.module.css";

export function RelatedPostsSection({
  posts,
  title = "関連記事",
}: {
  posts: Post[];
  title?: string;
}) {
  if (!posts?.length) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>
        <FontAwesomeIcon icon={faNewspaper} /> {title}
      </h3>
      <div className={styles.grid}>
        {posts.map((p) => (
          <ArticleCard
            key={p.frontmatter.date.toISO()}
            post={p}
            headingLevel="h3"
            hoverVariant="subtle"
          />
        ))}
      </div>
    </section>
  );
}

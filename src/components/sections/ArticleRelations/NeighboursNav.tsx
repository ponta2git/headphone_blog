import Link from "next/link";
import type { Post } from "../../../posts/types";
import styles from "./NeighboursNav.module.css";

export function NeighboursNav({ prev, next }: { prev?: Post; next?: Post }) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.nav}>
      {prev ? (
        <Link
          href={`/posts/${prev.frontmatter.date.toFormat("yyyyMMdd")}`}
          className={styles.prev}
          aria-label={`前の記事: ${prev.frontmatter.title}`}
        >
          {prev.frontmatter.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/posts/${next.frontmatter.date.toFormat("yyyyMMdd")}`}
          className={styles.next}
          aria-label={`次の記事: ${next.frontmatter.title}`}
        >
          {next.frontmatter.title}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

import NextLink from "next/link";
import type { Route } from "next";
import { Stack } from "../../ui/Stack";
import { Badge } from "../../ui/Badge";
import type { Post } from "../../../posts/types";
import styles from "./ArticleCard.module.css";

type Variant = "full" | "compact";

interface ArticleCardProps {
  post: Post;
  variant?: Variant;
  headingLevel?: "h2" | "h3";
  hoverVariant?: "normal" | "subtle";
  /**
   * Clamp title lines. Use "one" for ultra-dense contexts (e.g., related posts),
   * default "two" for standard lists.
   */
  titleClamp?: "one" | "two";
}

export function ArticleCard({
  post,
  variant = "compact",
  headingLevel = "h2",
  hoverVariant = "normal",
  titleClamp = "two",
}: ArticleCardProps) {
  const { frontmatter, excerpt } = post;
  const { date, title, tags } = frontmatter;
  const link = `/posts/${date.toISODate({ format: "basic" })}` as Route;

  const Heading = headingLevel;

  const titleClass =
    headingLevel === "h3" ? `${styles.title} ${styles.titleH3}` : styles.title;

  const cardClass = `${styles.card} ${
    hoverVariant === "subtle" ? styles.cardSubtle : ""
  }`;

  const titleLinkClass = `${styles.titleLink} ${
    titleClamp === "one" ? styles.titleLinkClamp1 : ""
  }`;

  return (
    <article className={cardClass}>
      <Stack gap={3}>
        <Stack direction="horizontal" gap={2}>
          {tags.map((tag) => (
            <Badge key={tag.slug} href={`/tags/${tag.slug}`}>
              {tag.name}
            </Badge>
          ))}
        </Stack>

        <time className={styles.date} dateTime={date.toISODate() || ""}>
          {date.toFormat("yyyy-MM-dd")}
        </time>

        <Heading className={titleClass}>
          <NextLink href={link} className={titleLinkClass}>
            {title}
          </NextLink>
        </Heading>

        {variant === "full" && excerpt && (
          <p className={styles.excerpt}>{excerpt}</p>
        )}
      </Stack>
    </article>
  );
}

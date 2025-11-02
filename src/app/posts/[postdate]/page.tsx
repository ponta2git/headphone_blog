import { DateTime } from "luxon";
import type { Metadata } from "next";
import { Stack } from "../../../components/ui/Stack";
import { Badge } from "../../../components/ui/Badge";
import { ArticleContent } from "../../../components/features/ArticleContent";
import { generatePostMetadata } from "../../../posts/meta";
import {
  getPostByDate,
  getAllPostDates,
  getRelatedPosts,
  getNeighbourPosts,
} from "../../../posts/api";
import { TIMEZONE, LOCALE } from "../../../site";
import styles from "./page.module.css";
import { ShareWith } from "../../../components/features/ShareWith/ShareWith";
import {
  RelatedPostsSection,
  NeighboursNav,
} from "../../../components/sections/ArticleRelations";

export const dynamicParams = false;

type PostPageRouteParams = {
  postdate: string;
};

export async function generateStaticParams(): Promise<PostPageRouteParams[]> {
  const dates = await getAllPostDates();
  return dates.map((date) => ({ postdate: date.toFormat("yyyyMMdd") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostPageRouteParams>;
}): Promise<Metadata> {
  const { postdate } = await params;

  const date = DateTime.fromFormat(postdate, "yyyyMMdd", {
    zone: TIMEZONE,
    locale: LOCALE,
  });

  if (!date.isValid) {
    throw new Error(`Invalid postdate: ${postdate}`);
  }

  const post = await getPostByDate(date);
  const canonical = `https://ponta-headphone.net/posts/${postdate}`;

  return generatePostMetadata(post, canonical);
}

export default async function Page({
  params,
}: {
  params: Promise<PostPageRouteParams>;
}) {
  const { postdate } = await params;

  const date = DateTime.fromFormat(postdate, "yyyyMMdd", {
    zone: TIMEZONE,
    locale: LOCALE,
  });

  if (!date.isValid) {
    throw new Error(`Invalid postdate: ${postdate}`);
  }

  const post = await getPostByDate(date);
  const { frontmatter } = post;
  const related = await getRelatedPosts(post, 4);
  const neighbours = await getNeighbourPosts(frontmatter.date);

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <Stack gap={4}>
            <h1 className={styles.title}>{frontmatter.title}</h1>

            <div className={styles.meta}>
              <time
                className={styles.date}
                dateTime={frontmatter.date.toISODate() || ""}
              >
                {frontmatter.date.toFormat("yyyy-MM-dd")}
              </time>
              {post.readTime ? (
                <span className={styles.readtime}>
                  ・{post.readTime}分で読めます
                </span>
              ) : null}

              <Stack direction="horizontal" gap={2}>
                {frontmatter.tags.map((tag) => (
                  <Badge key={tag.slug} href={`/tags/${tag.slug}`}>
                    {tag.name}
                  </Badge>
                ))}
              </Stack>
            </div>
          </Stack>
        </header>

        <div className={styles.content}>
          {frontmatter.tldr && frontmatter.tldr.length > 0 ? (
            <section className={styles.tldr}>
              <h2 className={styles.tldrTitle}>要点</h2>
              <ul>
                {frontmatter.tldr.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {post.headings && post.headings.length >= 3 ? (
            <details className={styles.toc}>
              <summary>このページの目次</summary>
              <ul>
                {post.headings.map((h) => (
                  <li
                    key={h.id}
                    className={styles[`tocLevel${h.level}`] ?? undefined}
                  >
                    <a href={`#${h.id}`}>
                      {h.level > 2 ? (
                        <span aria-hidden="true">
                          {"— ".repeat(h.level - 2)}
                        </span>
                      ) : null}
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          <ArticleContent post={post} />
        </div>

        <footer className={styles.footer}>
          <div className={styles.shareArea}>
            <ShareWith
              title={frontmatter.title}
              url={`https://ponta-headphone.net/posts/${frontmatter.date.toFormat("yyyyMMdd")}`}
            />
          </div>
          {related.length > 0 ? <RelatedPostsSection posts={related} /> : null}

          <NeighboursNav
            prev={neighbours.prev ?? undefined}
            next={neighbours.next ?? undefined}
          />
        </footer>
      </article>
    </div>
  );
}

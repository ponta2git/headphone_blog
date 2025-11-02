import type { Post } from "../../../posts/types";
import { createMdxComponents } from "./mdx-components";
import styles from "./ArticleContent.module.css";

interface ArticleContentProps {
  post: Post;
}

export function ArticleContent({ post }: ArticleContentProps) {
  return (
    <div className={styles.content}>
      {post.body({ components: createMdxComponents() })}
    </div>
  );
}

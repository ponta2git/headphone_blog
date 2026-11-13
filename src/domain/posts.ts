export const tags: Readonly<Record<string, string>> = Object.freeze({
  購入: "purchase",
  試聴: "try",
  システム: "system",
  評価指標: "metric",
  雑談: "chat",
  イベント: "event",
  DAC: "dac",
  ヘッドホンアンプ: "hpa",
  ヘッドホン: "headphones",
});

export interface Post {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly tags: readonly string[];
}

/** Text-only content shared by listings, feeds and metadata; never includes a renderer. */
export interface PostSummary extends Post {
  readonly excerpt: string;
}

export function isPublicationDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00+09:00`);
  return (
    Number.isFinite(date.getTime()) &&
    new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10) ===
      value
  );
}

export function publishedAt(date: string): string {
  if (!isPublicationDate(date))
    throw new Error(`Invalid publication date: ${date}`);
  return `${date}T00:00:00+09:00`;
}

export function postPath(date: string): string {
  publishedAt(date);
  return `/posts/${date.replaceAll("-", "")}`;
}

/** Enforce publication invariants before exposing any routes or catalog queries. */
export function assertPosts(posts: readonly Post[]): void {
  const ids = new Set<string>();
  for (const post of posts) {
    if (postPath(post.date) !== `/posts/${post.id}`)
      throw new Error(`Filename/date mismatch: ${post.id} / ${post.date}`);
    if (ids.has(post.id)) throw new Error(`Duplicate post ID: ${post.id}`);
    if (!post.title.trim()) throw new Error(`Missing post title: ${post.id}`);
    if (!post.tags.length) throw new Error(`Missing post tags: ${post.id}`);
    if (new Set(post.tags).size !== post.tags.length)
      throw new Error(`Duplicate post tag: ${post.id}`);
    if (post.tags.some((tag) => !Object.hasOwn(tags, tag)))
      throw new Error(`Unknown tag: ${post.id}`);
    ids.add(post.id);
  }
}

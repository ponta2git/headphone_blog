export const site = {
  name: "pontaのヘッドホンブログ",
  url: "https://ponta-headphone.net",
  description:
    "ヘッドホンオーディオを楽しんでいます。ヘッドホンや機材のインプレッションやヘッドホンオーディオの楽しみ方などについて気楽に書き連ねています。",
  author: "ponta",
  email: "coshun@gmail.com",
  twitter: "@ponta2twit",
};

export const tags: Record<string, string> = {
  購入: "purchase",
  試聴: "try",
  システム: "system",
  評価指標: "metric",
  雑談: "chat",
  イベント: "event",
  DAC: "dac",
  ヘッドホンアンプ: "hpa",
  ヘッドホン: "headphones",
};

export interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
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

export function assertPosts(posts: Post[]): void {
  const ids = new Set<string>();
  for (const post of posts) {
    if (postPath(post.date) !== `/posts/${post.id}`)
      throw new Error(`Filename/date mismatch: ${post.id} / ${post.date}`);
    if (ids.has(post.id)) throw new Error(`Duplicate post ID: ${post.id}`);
    if (post.tags.some((tag) => !Object.hasOwn(tags, tag)))
      throw new Error(`Unknown tag: ${post.id}`);
    ids.add(post.id);
  }
}

export function newestFirst<T extends Post>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function selectPosts<T extends Post>(posts: T[], names: string[]): T[] {
  return newestFirst(
    posts.filter((post) => post.tags.some((tag) => names.includes(tag))),
  );
}

export function relatedPosts<T extends Post>(posts: T[], current: Post): T[] {
  return selectPosts(
    posts.filter((post) => post.id !== current.id),
    current.tags,
  ).slice(0, 5);
}

export function neighbours<T extends Post>(posts: T[], current: Post) {
  const ordered = newestFirst(posts);
  const index = ordered.findIndex((post) => post.id === current.id);
  if (index < 0) throw new Error(`Unknown post: ${current.id}`);
  return { newer: ordered[index - 1], older: ordered[index + 1] };
}

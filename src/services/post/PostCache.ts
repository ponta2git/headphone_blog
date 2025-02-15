import type { Post } from "./PostTypes";

const cache = new Map<string, Post>();

export function getPostCache(key: string): Post | undefined {
  return cache.get(key);
}

export function setPostCache(key: string, post: Post): void {
  cache.set(key, post);
}
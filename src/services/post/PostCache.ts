import type { Post } from "./PostTypes";

// Cache for completed post loads
const cache = new Map<string, Post>();
// Cache for pending post load operations
const pendingCache = new Map<string, Promise<Post>>();

export function getPostCache(key: string): Post | undefined {
  return cache.get(key);
}

export function setPostCache(key: string, post: Post): void {
  cache.set(key, post);
}

export function getPendingPostCache(key: string): Promise<Post> | undefined {
  return pendingCache.get(key);
}

export function setPendingPostCache(
  key: string,
  postPromise: Promise<Post>,
): void {
  pendingCache.set(key, postPromise);

  // Clean up the pending cache once the promise resolves or rejects
  postPromise
    .then((post) => {
      pendingCache.delete(key);
      return post;
    })
    .catch(() => {
      pendingCache.delete(key);
    });
}

import type { Post } from "./PostTypes";

// Error types for negative caching
export interface PostCacheError {
  message: string;
  timestamp: number;
  originalError?: Error;
}

// Cache for completed post loads
const cache = new Map<string, Post>();
// Cache for pending post load operations
const pendingCache = new Map<string, Promise<Post>>();
// Cache for errors (negative caching)
const errorCache = new Map<string, PostCacheError>();

// Configuration
const ERROR_CACHE_TTL_MS = 30000; // 30 seconds for negative caching

export function getPostCache(key: string): Post | undefined {
  return cache.get(key);
}

export function setPostCache(key: string, post: Post): void {
  // Clear any error that might exist for this key
  errorCache.delete(key);
  cache.set(key, post);
}

export function getPendingPostCache(key: string): Promise<Post> | undefined {
  return pendingCache.get(key);
}

export function getErrorCache(key: string): PostCacheError | undefined {
  const error = errorCache.get(key);

  // If error exists but has expired, remove it and return undefined
  if (error && Date.now() - error.timestamp > ERROR_CACHE_TTL_MS) {
    errorCache.delete(key);
    return undefined;
  }

  return error;
}

export function setPendingPostCache(
  key: string,
  postPromise: Promise<Post>,
): void {
  pendingCache.set(key, postPromise);

  // Centralised cache management logic
  // Handle both success (main cache) and failure (error cache)
  postPromise
    .then((post) => {
      // On success, populate the main cache
      setPostCache(key, post);
      return post;
    })
    .catch((error) => {
      // On failure, implement negative caching
      errorCache.set(key, {
        message: error.message || "Unknown error occurred",
        timestamp: Date.now(),
        originalError: error,
      });
    })
    .finally(() => {
      // Always clean up the pending cache
      pendingCache.delete(key);
    });
}

// Utility functions for cache management
export function invalidateCache(key: string): void {
  cache.delete(key);
  errorCache.delete(key);
  // Note: We don't delete from pendingCache as that would interfere with in-flight requests
}

export function clearAllCaches(): void {
  cache.clear();
  errorCache.clear();
  // Note: Clearing pendingCache could lead to unexpected behavior for in-flight requests
  // Typically we wouldn't clear this in production use, but it can be useful for testing
  // pendingCache.clear();
}

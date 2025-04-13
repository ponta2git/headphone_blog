import {
  getPostCache,
  setPostCache,
  getPendingPostCache,
  setPendingPostCache,
} from "../../src/services/post/PostCache";
import type { Post } from "../../src/services/post/PostTypes";
import type { MDXContent } from "mdx/types";

// Mock MDXContent
const mockMDXContent = {} as MDXContent;

// Mock post data
const mockPost: Post = {
  frontmatter: {
    date: new Date() as any, // Using any to bypass the Postdate type requirement for testing
    title: "Test Post",
    tags: [],
  },
  excerpt: "This is test excerpt",
  body: mockMDXContent,
};

describe("PostCache", () => {
  // Clear caches before each test
  beforeEach(() => {
    // Access and clear the private cache maps
    // Note: This is a bit of a hack, but it's necessary for testing
    const cacheMap = (getPostCache as any).cache;
    const pendingCacheMap = (getPendingPostCache as any).pendingCache;

    if (cacheMap && cacheMap.clear) cacheMap.clear();
    if (pendingCacheMap && pendingCacheMap.clear) pendingCacheMap.clear();
  });

  describe("Post Cache", () => {
    test("should store and retrieve posts in cache", () => {
      const key = "2023-01-01";
      setPostCache(key, mockPost);

      const retrievedPost = getPostCache(key);
      expect(retrievedPost).toEqual(mockPost);
    });

    test("should return undefined when post is not in cache", () => {
      const nonExistentKey = "non-existent";

      const retrievedPost = getPostCache(nonExistentKey);
      expect(retrievedPost).toBeUndefined();
    });
  });

  describe("Pending Post Cache", () => {
    test("should store and retrieve pending post promises", async () => {
      const key = "2023-01-02";
      const postPromise = Promise.resolve(mockPost);

      setPendingPostCache(key, postPromise);

      const retrievedPromise = getPendingPostCache(key);
      expect(retrievedPromise).toBe(postPromise);

      // Verify the promise resolves to the expected post
      const resolvedPost = await retrievedPromise;
      expect(resolvedPost).toEqual(mockPost);
    });

    test("should return undefined when pending post is not in cache", () => {
      const nonExistentKey = "non-existent";

      const retrievedPromise = getPendingPostCache(nonExistentKey);
      expect(retrievedPromise).toBeUndefined();
    });

    test("should remove pending promise from cache after it resolves", async () => {
      const key = "2023-01-03";
      const postPromise = Promise.resolve(mockPost);

      setPendingPostCache(key, postPromise);

      // Wait for the promise to resolve and cleanup to occur
      await postPromise;

      // Add a small delay to ensure the cleanup has time to run
      await new Promise((resolve) => setTimeout(resolve, 10));

      const retrievedPromise = getPendingPostCache(key);
      expect(retrievedPromise).toBeUndefined();
    });

    test("should remove pending promise from cache after it rejects", async () => {
      const key = "2023-01-04";
      const error = new Error("Test error");
      const postPromise = Promise.reject(error);

      // Prevent the rejection from causing the test to fail
      postPromise.catch(() => {});

      setPendingPostCache(key, postPromise);

      // Wait for the promise to reject and cleanup to occur
      try {
        await postPromise;
      } catch {
        // Expected to throw
      }

      // Add a small delay to ensure the cleanup has time to run
      await new Promise((resolve) => setTimeout(resolve, 10));

      const retrievedPromise = getPendingPostCache(key);
      expect(retrievedPromise).toBeUndefined();
    });
  });
});

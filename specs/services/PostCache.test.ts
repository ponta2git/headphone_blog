import {
  getPostCache,
  setPostCache,
  getPendingPostCache,
  setPendingPostCache,
  getErrorCache,
  invalidateCache,
  clearAllCaches,
} from "../../src/services/post/PostCache";
import type { Post } from "../../src/services/post/PostTypes";
import type { MDXContent } from "mdx/types";

// Mock MDXContent
const mockMDXContent = {} as MDXContent;

// Mock post data
const mockPost: Post = {
  frontmatter: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    date: new Date() as any, // Using any to bypass the Postdate type requirement for testing
    title: "Test Post",
    tags: [],
  },
  excerpt: "This is test excerpt",
  body: mockMDXContent,
  rawContent: "# Test Post\n\nThis is a test post content.", // Add rawContent property
};

describe("PostCache", () => {
  // Clear caches before each test
  beforeEach(() => {
    // Reset all mocks and clear caches
    vi.clearAllMocks();
    clearAllCaches();
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
      postPromise.catch(() => {
        /* Expected rejection */
      });

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

    test("should populate main cache when promise resolves", async () => {
      const key = "2023-01-05";
      const postPromise = Promise.resolve(mockPost);

      setPendingPostCache(key, postPromise);

      // Wait for the promise to resolve and cache to be populated
      await postPromise;
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify the post is now in the main cache
      const cachedPost = getPostCache(key);
      expect(cachedPost).toEqual(mockPost);
    });
  });

  describe("Error Cache", () => {
    test("should store errors in error cache when promise rejects", async () => {
      const key = "2023-01-06";
      const errorMessage = "Test error for negative caching";
      const error = new Error(errorMessage);
      const postPromise = Promise.reject(error);

      // Prevent the rejection from causing the test to fail
      postPromise.catch(() => {
        /* Expected rejection */
      });

      setPendingPostCache(key, postPromise);

      // Wait for the promise to reject and error to be cached
      try {
        await postPromise;
      } catch {
        // Expected to throw
      }
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify the error is now in the error cache
      const cachedError = getErrorCache(key);
      expect(cachedError).toBeDefined();
      expect(cachedError?.message).toBe(errorMessage);
      expect(cachedError?.originalError).toBe(error);
    });

    test("should expire errors after TTL", async () => {
      const key = "2023-01-07";
      const errorMessage = "Test error with expiration";

      // Mock Date.now to control the time
      const mockNow = 1000000;
      const originalNow = Date.now;

      // Set up the initial timestamp
      Date.now = vi.fn(() => mockNow);

      // Create a rejected promise to generate an error in the cache
      const error = new Error(errorMessage);
      const postPromise = Promise.reject(error);
      postPromise.catch(() => {
        /* Expected rejection */
      });
      setPendingPostCache(key, postPromise);

      // Wait for rejection to be processed
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify error is cached at this point
      let cachedError = getErrorCache(key);
      expect(cachedError).toBeDefined();
      expect(cachedError?.message).toBe(errorMessage);

      // Advance time beyond TTL
      Date.now = vi.fn(() => mockNow + 31000); // 31 seconds later (TTL is 30s)

      // Now the error should be expired and removed when we try to get it
      cachedError = getErrorCache(key);
      expect(cachedError).toBeUndefined();

      // Restore original Date.now
      Date.now = originalNow;
    });

    test("should clear error when adding valid post to cache", async () => {
      const key = "2023-01-08";

      // Step 1: Add an error to the cache through the normal mechanism
      const errorMessage = "Test error";
      const error = new Error(errorMessage);
      const postPromise = Promise.reject(error);
      postPromise.catch(() => {
        /* Expected rejection */
      });

      // Set the error in cache
      setPendingPostCache(key, postPromise);

      // Wait for rejection to be processed
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify error is in cache
      const cachedError = getErrorCache(key);
      expect(cachedError).toBeDefined();
      expect(cachedError?.message).toBe(errorMessage);

      // Step 2: Now add a valid post for the same key
      setPostCache(key, mockPost);

      // Step 3: Verify the error is cleared
      const errorAfterSet = getErrorCache(key);
      expect(errorAfterSet).toBeUndefined();
    });
  });

  describe("Cache Management", () => {
    test("invalidateCache should clear both main and error caches", async () => {
      const key = "2023-01-09";

      // Set up post cache
      setPostCache(key, mockPost);

      // Set up error cache
      const error = new Error("Test error");
      const postPromise = Promise.reject(error);
      postPromise.catch(() => {
        /* Expected rejection */
      });
      setPendingPostCache(key, postPromise);

      // Wait for rejection to be processed
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify both are set
      expect(getPostCache(key)).toBeDefined();
      expect(getErrorCache(key)).toBeDefined();

      // Invalidate the cache
      invalidateCache(key);

      // Verify both are cleared
      expect(getPostCache(key)).toBeUndefined();
      expect(getErrorCache(key)).toBeUndefined();
    });

    test("clearAllCaches should clear all caches", async () => {
      // Set up post cache
      setPostCache("key1", mockPost);

      // Set up error cache
      const error = new Error("Test error");
      const postPromise = Promise.reject(error);
      postPromise.catch(() => {
        /* Expected rejection */
      });
      setPendingPostCache("key1", postPromise);

      // Wait for rejection to be processed
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify caches are populated
      expect(getPostCache("key1")).toBeDefined();
      expect(getErrorCache("key1")).toBeDefined();

      // Clear all caches
      clearAllCaches();

      // Verify all caches are empty
      expect(getPostCache("key1")).toBeUndefined();
      expect(getErrorCache("key1")).toBeUndefined();
    });
  });
});

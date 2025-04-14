import { PostService } from "../../src/services/post/PostService";
import * as PostCache from "../../src/services/post/PostCache";
import * as PostLoader from "../../src/services/post/PostLoader";
import * as ErrorFactory from "../../src/services/errors/ErrorFactory";
import type { Postdate } from "../../src/services/date/PostdateService";
import type { Post } from "../../src/services/post/PostTypes";

// Mock dependencies
vi.mock("../../src/services/post/PostCache");
vi.mock("../../src/services/post/PostLoader");
vi.mock("../../src/services/errors/ErrorFactory");

describe("PostService", () => {
  let mockDate: Postdate;
  let mockPost: Post;
  const cacheKey = "2023-01-01";

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Setup test data
    mockDate = {
      toFormat: vi.fn().mockReturnValue(cacheKey),
    } as unknown as Postdate;

    mockPost = {
      frontmatter: {
        date: mockDate,
        title: "Test Post",
        tags: [],
      },
      excerpt: "Test excerpt",
      body: {} as any,
      rawContent: "# Test Post\n\nTest content",
    };

    // Default mock implementations
    vi.mocked(PostCache.getPostCache).mockReturnValue(undefined);
    vi.mocked(PostCache.getPendingPostCache).mockReturnValue(undefined);
    vi.mocked(PostCache.getErrorCache).mockReturnValue(undefined); // Add mock for getErrorCache
    vi.mocked(PostLoader.loadPost).mockResolvedValue(mockPost);
    vi.mocked(ErrorFactory.createPostComposeError).mockImplementation(
      (message, error) => new Error(`${message}: ${(error as Error).message}`),
    );
  });

  afterEach(() => {
    // Ensure we're not leaving side effects between tests
    vi.restoreAllMocks();
  });

  describe("getByPostdate", () => {
    describe("cache behavior", () => {
      it("should return cached post if available", async () => {
        // Setup
        vi.mocked(PostCache.getPostCache).mockReturnValue(mockPost);

        // Execute
        const result = await PostService.getByPostdate(mockDate);

        // Verify
        expect(PostCache.getPostCache).toHaveBeenCalledWith(cacheKey);
        expect(result).toBe(mockPost);
        expect(PostLoader.loadPost).not.toHaveBeenCalled();
        expect(PostCache.setPendingPostCache).not.toHaveBeenCalled();
      });

      it("should return pending post if loading is in progress", async () => {
        // Setup
        const pendingPromise = Promise.resolve(mockPost);
        vi.mocked(PostCache.getPendingPostCache).mockReturnValue(
          pendingPromise,
        );

        // Execute
        const result = await PostService.getByPostdate(mockDate);

        // Verify
        expect(PostCache.getPostCache).toHaveBeenCalledWith(cacheKey);
        expect(PostCache.getPendingPostCache).toHaveBeenCalledWith(cacheKey);
        expect(result).toBe(mockPost);
        expect(PostLoader.loadPost).not.toHaveBeenCalled();
        expect(PostCache.setPendingPostCache).not.toHaveBeenCalled();
      });

      it("should load post from loader if not cached or pending", async () => {
        // Execute
        const result = await PostService.getByPostdate(mockDate);

        // Verify
        expect(PostCache.getPostCache).toHaveBeenCalledWith(cacheKey);
        expect(PostCache.getPendingPostCache).toHaveBeenCalledWith(cacheKey);
        expect(PostLoader.loadPost).toHaveBeenCalledWith(mockDate);
        // No longer verify setPostCache as it's now handled inside setPendingPostCache
        expect(PostCache.setPendingPostCache).toHaveBeenCalled();
        expect(result).toBe(mockPost);
      });

      it("should throw cached error if available", async () => {
        // Setup
        const cachedError = {
          message: "Cached error message",
          timestamp: Date.now(),
          originalError: new Error("Original error"),
        };
        vi.mocked(PostCache.getErrorCache).mockReturnValue(cachedError);

        // Create the formatted error that will be thrown
        const formattedError = new Error(
          `Failed to load post (cached error): ${cacheKey}: Original error`,
        );
        vi.mocked(ErrorFactory.createPostComposeError).mockReturnValue(
          formattedError,
        );

        // Execute & Verify
        await expect(PostService.getByPostdate(mockDate)).rejects.toThrow(
          formattedError,
        );

        expect(PostCache.getErrorCache).toHaveBeenCalledWith(cacheKey);
        expect(PostLoader.loadPost).not.toHaveBeenCalled();
      });
    });

    describe("promise handling", () => {
      it("should cache the promise during loading", async () => {
        // Mock implementation to capture the promise passed to setPendingPostCache
        let capturedKey: string | null = null;
        let capturedPromise: Promise<Post> | null = null;
        vi.mocked(PostCache.setPendingPostCache).mockImplementation(
          (key, promise) => {
            capturedKey = key;
            capturedPromise = promise;
          },
        );

        // Execute
        const resultPromise = PostService.getByPostdate(mockDate);

        // Verify promise is cached before it resolves
        expect(PostCache.setPendingPostCache).toHaveBeenCalled();
        expect(capturedKey).toBe(cacheKey);

        // Instead of comparing promise identity, verify both resolve to the same value
        const result1 = await resultPromise;
        const result2 = await capturedPromise!;
        expect(result1).toStrictEqual(result2);
      });

      it("should handle concurrent requests for the same post efficiently", async () => {
        // Setup - We need a shared reference that persists between calls
        const sharedPromise = Promise.resolve(mockPost);

        // First call returns undefined for pending cache, then we set it
        let promiseWasStored = false;

        vi.mocked(PostCache.getPendingPostCache).mockImplementation((key) => {
          if (key === cacheKey && promiseWasStored) {
            return sharedPromise;
          }
          return undefined;
        });

        vi.mocked(PostCache.setPendingPostCache).mockImplementation(
          (key, promise) => {
            if (key === cacheKey) {
              promiseWasStored = true;
            }
          },
        );

        // Mock loadPost to always return our controlled promise
        vi.mocked(PostLoader.loadPost).mockReturnValue(sharedPromise);

        // Execute - make multiple requests for the same post
        const promise1 = PostService.getByPostdate(mockDate);
        const promise2 = PostService.getByPostdate(mockDate);

        // Verify both promises resolve to the same value
        const result1 = await promise1;
        const result2 = await promise2;
        expect(result1).toStrictEqual(result2);

        // Should only load once since the second call should get from pending cache
        expect(PostLoader.loadPost).toHaveBeenCalledTimes(1);
        expect(PostCache.setPendingPostCache).toHaveBeenCalledTimes(1);
      });
    });

    describe("error handling", () => {
      it("should throw a properly formatted error when loading fails", async () => {
        // Setup
        const testError = new Error("Test error");
        const expectedErrorMessage = `Failed to load post: ${cacheKey}: Test error`;

        // Create the formatted error that will be thrown
        const formattedError = new Error(expectedErrorMessage);
        vi.mocked(ErrorFactory.createPostComposeError).mockReturnValue(
          formattedError,
        );

        // Make the loadPost function throw synchronously to trigger the catch block
        vi.mocked(PostLoader.loadPost).mockImplementation(() => {
          throw testError;
        });

        // Execute & Verify
        await expect(() => PostService.getByPostdate(mockDate)).rejects.toThrow(
          expectedErrorMessage,
        );

        expect(ErrorFactory.createPostComposeError).toHaveBeenCalledWith(
          `Failed to load post: ${cacheKey}`,
          testError,
        );
      });
    });

    describe("edge cases", () => {
      it("should handle malformed date input gracefully", async () => {
        // Setup
        const badDate = {
          toFormat: vi.fn().mockReturnValue(""),
        } as unknown as Postdate;

        // Execute
        await PostService.getByPostdate(badDate);

        // Verify we still attempt to load with empty cache key
        expect(PostCache.getPostCache).toHaveBeenCalledWith("");
        expect(PostLoader.loadPost).toHaveBeenCalledWith(badDate);
      });
    });
  });
});

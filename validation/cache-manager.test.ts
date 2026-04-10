import { describe, expect, it, vi, afterEach } from "vitest";
import { CacheManager } from "../src/lib/cache/manager";

describe("CacheManager", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses defaultTTL when ttl argument is undefined", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-18T00:00:00.000Z"));

    const cache = new CacheManager<string, string>(10, 1000);
    cache.set("a", "value");

    expect(cache.get("a")).toBe("value");

    vi.advanceTimersByTime(1001);
    expect(cache.get("a")).toBeUndefined();
  });

  it("prefers explicit ttl over defaultTTL", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-18T00:00:00.000Z"));

    const cache = new CacheManager<string, string>(10, 10_000);
    cache.set("a", "value", 1000);

    vi.advanceTimersByTime(1001);
    expect(cache.get("a")).toBeUndefined();
  });

  it("does not expire when both ttl and defaultTTL are undefined", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-18T00:00:00.000Z"));

    const cache = new CacheManager<string, string>(10);
    cache.set("a", "value");

    vi.advanceTimersByTime(60_000);
    expect(cache.get("a")).toBe("value");
  });
});

type CacheEntry<V> = {
  value: V;
  expiresAt?: number;
  lastAccess: number;
};

export class CacheManager<K, V> {
  private cache = new Map<K, CacheEntry<V>>();

  constructor(
    private maxSize: number,
    private defaultTTL?: number,
  ) {}

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    entry.lastAccess = Date.now();
    return entry.value;
  }

  set(key: K, value: V, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      lastAccess: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined,
    });
  }

  private evictLRU(): void {
    let oldest: { key: K; time: number } | null = null;

    for (const [key, entry] of this.cache.entries()) {
      if (!oldest || entry.lastAccess < oldest.time) {
        oldest = { key, time: entry.lastAccess };
      }
    }

    if (oldest) {
      this.cache.delete(oldest.key);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

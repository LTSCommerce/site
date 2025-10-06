// ANTI-PATTERN: Unbounded memoization cache
class UnboundedMemo<T> {
  private cache = new Map<string, T>();

  memoize(key: string, fn: () => T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const result = fn();
    this.cache.set(key, result);
    // BUG: Cache never cleared - grows forever!
    return result;
  }
}

// Problem: Memory leak - cache grows indefinitely
const memo = new UnboundedMemo<string>();

// Simulating many unique requests
for (let i = 0; i < 1000000; i++) {
  memo.memoize(`key-${i}`, () => `value-${i}`);
  // Each unique key adds to cache - never evicted
}

// SOLUTION: Use LRU cache with size limit
class LRUMemo<T> {
  private cache = new Map<string, T>();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  memoize(key: string, fn: () => T): T {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }

    const result = fn();
    this.cache.set(key, result);

    // Evict oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return result;
  }
}

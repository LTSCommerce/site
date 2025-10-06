type MemoCache<T> = Map<string, T>;

function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache: MemoCache<ReturnType<T>> = new Map();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator
      ? keyGenerator(...args)
      : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Usage example
function expensiveCalculation(a: number, b: number): number {
  console.log('Computing...');
  return Math.pow(a, b);
}

const memoized = memoize(expensiveCalculation);

console.log(memoized(2, 10)); // Logs: "Computing..." then 1024
console.log(memoized(2, 10)); // Returns 1024 immediately (no log)

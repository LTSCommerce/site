from functools import lru_cache
import time

@lru_cache(maxsize=128)
def expensive_computation(n: int) -> int:
    """Pure function - result depends only on input."""
    print(f"Computing for {n}...")
    time.sleep(0.1)  # Simulate expensive operation
    return n * n

# First call - computes
result1 = expensive_computation(10)  # Prints: "Computing for 10..."

# Second call - returns cached result
result2 = expensive_computation(10)  # No print - instant return

# Check cache statistics
print(expensive_computation.cache_info())
# CacheInfo(hits=1, misses=1, maxsize=128, currsize=1)

# Clear cache if needed
expensive_computation.cache_clear()

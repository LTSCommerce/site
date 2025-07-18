<?php

declare(strict_types=1);

class SlidingWindowRateLimiter
{
    private Redis $redis;

    private int $limit;

    private int $windowSize;

    public function __construct(Redis $redis, int $limit = 1000, int $windowSize = 3600)
    {
        $this->redis      = $redis;
        $this->limit      = $limit;
        $this->windowSize = $windowSize;
    }

    public function isAllowed(string $identifier): bool
    {
        $key         = "sliding_window:$identifier";
        $now         = time();
        $windowStart = $now - $this->windowSize;

        // Remove old entries
        $this->redis->zremrangebyscore($key, 0, $windowStart);

        // Count current requests
        $currentCount = $this->redis->zcard($key);

        if ($currentCount < $this->limit) {
            // Add current request
            $this->redis->zadd($key, $now, uniqid());
            $this->redis->expire($key, $this->windowSize);

            return true;
        }

        return false;
    }

    public function getRemainingRequests(string $identifier): int
    {
        $key         = "sliding_window:$identifier";
        $now         = time();
        $windowStart = $now - $this->windowSize;

        $this->redis->zremrangebyscore($key, 0, $windowStart);
        $currentCount = $this->redis->zcard($key);

        return max(0, $this->limit - $currentCount);
    }
}

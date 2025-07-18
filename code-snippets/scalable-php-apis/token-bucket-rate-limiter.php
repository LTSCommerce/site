<?php

declare(strict_types=1);

class TokenBucketRateLimiter
{
    private Redis $redis;

    private int $capacity;

    private int $refillRate;

    private int $refillPeriod;

    public function __construct(Redis $redis, int $capacity = 100, int $refillRate = 10, int $refillPeriod = 60)
    {
        $this->redis        = $redis;
        $this->capacity     = $capacity;
        $this->refillRate   = $refillRate;
        $this->refillPeriod = $refillPeriod;
    }

    public function isAllowed(string $identifier): bool
    {
        $key = "rate_limit:$identifier";
        $now = time();

        // Get current bucket state
        $bucketData = $this->redis->hmget($key, ['tokens', 'last_refill']);
        $tokens     = $bucketData['tokens'] ?? $this->capacity;
        $lastRefill = $bucketData['last_refill'] ?? $now;

        // Calculate tokens to add
        $timePassed  = $now - $lastRefill;
        $tokensToAdd = floor($timePassed / $this->refillPeriod) * $this->refillRate;
        $tokens      = min($this->capacity, $tokens + $tokensToAdd);

        // Check if request is allowed
        if ($tokens >= 1) {
            $tokens--;

            // Update bucket state
            $this->redis->hmset($key, [
                'tokens'      => $tokens,
                'last_refill' => $now,
            ]);
            $this->redis->expire($key, $this->refillPeriod * 2);

            return true;
        }

        return false;
    }

    public function getRemainingTokens(string $identifier): int
    {
        $key        = "rate_limit:$identifier";
        $bucketData = $this->redis->hmget($key, ['tokens']);

        return $bucketData['tokens'] ?? $this->capacity;
    }
}

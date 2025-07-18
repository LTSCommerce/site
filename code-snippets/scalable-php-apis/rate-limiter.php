<?php

declare(strict_types=1);

namespace App\Api\RateLimit;

use App\Contracts\CacheInterface;
use App\Exceptions\RateLimitExceededException;
use App\ValueObjects\{ClientId, RateLimit, TimeWindow};
use Psr\Log\LoggerInterface;

final readonly class TokenBucketRateLimiter
{
    public function __construct(
        private CacheInterface $cache,
        private LoggerInterface $logger,
        private int $defaultLimit = 100,
        private int $windowSeconds = 3600
    ) {
    }

    public function checkLimit(ClientId $clientId, ?RateLimit $customLimit = null): bool
    {
        $limit = $customLimit ?? new RateLimit($this->defaultLimit, $this->windowSeconds);
        $key   = $this->getCacheKey($clientId, $limit->window);

        $current = $this->cache->get($key) ?? 0;

        if ($current >= $limit->maxRequests) {
            $this->logger->warning('Rate limit exceeded', [
                'client_id'        => $clientId->value,
                'current_requests' => $current,
                'limit'            => $limit->maxRequests,
                'window'           => $limit->window,
            ]);

            throw new RateLimitExceededException(
                "Rate limit exceeded. Max {$limit->maxRequests} requests per {$limit->window} seconds"
            );
        }

        $this->cache->increment($key, 1, $limit->window);

        return true;
    }

    public function getRemainingRequests(ClientId $clientId, RateLimit $limit): int
    {
        $key     = $this->getCacheKey($clientId, $limit->window);
        $current = $this->cache->get($key) ?? 0;

        return max(0, $limit->maxRequests - $current);
    }

    public function resetLimit(ClientId $clientId, TimeWindow $window): bool
    {
        $key = $this->getCacheKey($clientId, $window->seconds);

        return $this->cache->delete($key);
    }

    private function getCacheKey(ClientId $clientId, int $windowSeconds): string
    {
        $windowStart = floor(time() / $windowSeconds) * $windowSeconds;

        return "rate_limit:{$clientId->value}:{$windowStart}";
    }
}

<?php

declare(strict_types=1);

namespace App\Database\Cache;

use Redis;

final class QueryResultCache
{
    private int $defaultTTL = 300;

    public function __construct(
        private readonly Redis $redis
    ) {
    }

    public function getCachedQuery(string $sql, array $params = [], int $ttl = null): ?array
    {
        $cacheKey = $this->generateCacheKey($sql, $params);
        $cached   = $this->redis->get($cacheKey);

        if ($cached !== false) {
            return json_decode($cached, true);
        }

        return null;
    }

    public function setCachedQuery(string $sql, array $params, array $result, int $ttl = null): void
    {
        $cacheKey = $this->generateCacheKey($sql, $params);
        $ttl ??= $this->defaultTTL;

        $this->redis->setex($cacheKey, $ttl, json_encode($result));
    }

    public function invalidateQueryCache(string $table): void
    {
        $pattern = "query:*:{$table}:*";
        $keys    = $this->redis->keys($pattern);

        if (!empty($keys)) {
            $this->redis->del($keys);
        }
    }

    private function generateCacheKey(string $sql, array $params): string
    {
        $normalized = $this->normalizeQuery($sql);
        $tables     = $this->extractTables($normalized);

        return 'query:' . md5($sql . serialize($params)) . ':' . implode(',', $tables);
    }

    private function normalizeQuery(string $sql): string
    {
        // Remove extra whitespace and normalize case
        return preg_replace('/\s+/', ' ', strtolower(trim($sql)));
    }

    private function extractTables(string $sql): array
    {
        preg_match_all('/(?:from|join|update|into)\s+([a-zA-Z_]\w*)/i', $sql, $matches);

        return array_unique($matches[1]);
    }
}

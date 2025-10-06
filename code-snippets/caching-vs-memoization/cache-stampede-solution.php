<?php

declare(strict_types=1);

use Redis;

class StampedeProtectedCache
{
    private Redis $redis;
    private const LOCK_TIMEOUT = 10; // seconds

    public function __construct(Redis $redis)
    {
        $this->redis = $redis;
    }

    public function get(string $key, callable $callback, int $ttl = 3600): mixed
    {
        // Try to get from cache
        $value = $this->redis->get($key);
        if ($value !== false) {
            return json_decode($value, true);
        }

        // Cache miss - acquire lock to prevent stampede
        $lockKey = "{$key}:lock";
        $lockAcquired = $this->redis->set(
            $lockKey,
            '1',
            ['NX', 'EX' => self::LOCK_TIMEOUT]
        );

        if ($lockAcquired) {
            try {
                // We got the lock - compute the value
                $result = $callback();

                // Store in cache
                $this->redis->setex($key, $ttl, json_encode($result));

                return $result;
            } finally {
                // Always release the lock
                $this->redis->del($lockKey);
            }
        }

        // Another process is computing - wait and retry
        sleep(1);
        return $this->get($key, $callback, $ttl);
    }
}

// Usage
$cache = new StampedeProtectedCache($redis);

$userData = $cache->get('user:123', function() {
    // Only one process executes this expensive query
    return $db->query('SELECT * FROM users WHERE id = 123');
}, 3600);

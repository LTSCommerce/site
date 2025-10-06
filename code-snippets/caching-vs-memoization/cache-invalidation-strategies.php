<?php

declare(strict_types=1);

use Redis;

class CacheInvalidationStrategies
{
    private Redis $redis;

    public function __construct(Redis $redis)
    {
        $this->redis = $redis;
    }

    // Strategy 1: Time-based (TTL)
    public function ttlBased(string $key, mixed $value, int $seconds): void
    {
        $this->redis->setex($key, $seconds, json_encode($value));
        // Automatically expires after $seconds
    }

    // Strategy 2: Event-driven invalidation
    public function eventDriven(int $userId, array $newData): void
    {
        // Update database
        $this->updateDatabase($userId, $newData);

        // Immediately invalidate related caches
        $this->redis->del("user:{$userId}");
        $this->redis->del("user:{$userId}:profile");
        $this->redis->del("user:{$userId}:preferences");
    }

    // Strategy 3: Cache versioning
    public function versioned(string $baseKey, mixed $value): void
    {
        $version = time();
        $versionedKey = "{$baseKey}:v{$version}";

        // Store with version
        $this->redis->set($versionedKey, json_encode($value));

        // Update pointer to current version
        $this->redis->set("{$baseKey}:current", $version);
    }

    // Strategy 4: Tag-based invalidation
    public function tagBased(string $key, mixed $value, array $tags): void
    {
        // Store the value
        $this->redis->set($key, json_encode($value));

        // Associate with tags
        foreach ($tags as $tag) {
            $this->redis->sadd("tag:{$tag}", $key);
        }
    }

    public function invalidateByTag(string $tag): void
    {
        // Get all keys with this tag
        $keys = $this->redis->smembers("tag:{$tag}");

        // Delete all tagged keys
        if (!empty($keys)) {
            $this->redis->del(...$keys);
        }

        // Remove the tag set
        $this->redis->del("tag:{$tag}");
    }

    private function updateDatabase(int $userId, array $data): void
    {
        // Database update logic
    }
}

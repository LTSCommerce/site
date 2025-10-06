<?php

declare(strict_types=1);

use Redis;

class UserRepository
{
    private Redis $redis;
    private PDO $db;

    public function __construct(Redis $redis, PDO $db)
    {
        $this->redis = $redis;
        $this->db = $db;
    }

    public function findUser(int $userId): ?array
    {
        $cacheKey = "user:{$userId}";

        // Try cache first
        $cached = $this->redis->get($cacheKey);
        if ($cached !== false) {
            return json_decode($cached, true);
        }

        // Cache miss - query database
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Store in cache with 1 hour TTL
            $this->redis->setex($cacheKey, 3600, json_encode($user));
        }

        return $user ?: null;
    }

    public function invalidateUser(int $userId): void
    {
        $cacheKey = "user:{$userId}";
        $this->redis->del($cacheKey);
    }
}

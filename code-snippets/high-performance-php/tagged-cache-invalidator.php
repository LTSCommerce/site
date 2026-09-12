<?php

declare(strict_types=1);

namespace App\Caching;

use Redis;

final class TaggedCacheInvalidator
{
    public function __construct(
        private readonly Redis $redis,
        private readonly string $tagKeyPrefix = 'cache:tag:',
    ) {
    }

    /**
     * @param array<int, string> $tags
     */
    public function set(string $key, string $value, array $tags, int $ttlSeconds = 3600): void
    {
        $this->redis->set($key, $value, $ttlSeconds);

        foreach ($tags as $tag) {
            $this->redis->sAdd($this->tagKey($tag), $key);
        }
    }

    public function invalidateTag(string $tag): int
    {
        $tagKey = $this->tagKey($tag);
        $keys   = $this->redis->sMembers($tagKey);

        if ($keys === [] || $keys === false) {
            return 0;
        }

        $removed = $this->redis->del($keys);
        $this->redis->del($tagKey);

        return $removed;
    }

    private function tagKey(string $tag): string
    {
        return $this->tagKeyPrefix . $tag;
    }
}

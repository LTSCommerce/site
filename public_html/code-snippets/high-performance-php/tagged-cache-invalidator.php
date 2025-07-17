<?php

declare(strict_types=1);

namespace App\Cache;

use App\ValueObjects\{CacheKey, CacheTag, CacheTTL};
use App\Exceptions\CacheInvalidationException;
use App\Contracts\CacheInterface;
use Psr\Log\LoggerInterface;

final readonly class TaggedCacheInvalidator
{
    public function __construct(
        private CacheInterface $cache,
        private LoggerInterface $logger,
    ) {}
    
    /** @param array<CacheTag> $tags */
    public function setWithTags(
        CacheKey $key,
        mixed $value,
        array $tags,
        ?CacheTTL $ttl = null
    ): void {
        $this->cache->set($key, $value, $ttl);
        
        // Associate key with tags
        foreach ($tags as $tag) {
            $tagKey = CacheKey::forTag($tag);
            $existingKeys = $this->cache->get($tagKey, fn() => []);
            $existingKeys[] = $key->toString();
            
            $this->cache->set(
                $tagKey,
                array_unique($existingKeys),
                $ttl
            );
        }
        
        $this->logger->debug('Cache entry created with tags', [
            'key' => $key->toString(),
            'tags' => array_map(fn(CacheTag $tag) => $tag->toString(), $tags),
        ]);
    }
    
    public function invalidateTag(CacheTag $tag): void
    {
        $tagKey = CacheKey::forTag($tag);
        $keys = $this->cache->get($tagKey, fn() => []);
        
        $invalidatedCount = 0;
        
        foreach ($keys as $keyString) {
            try {
                $this->cache->delete(CacheKey::fromString($keyString));
                $invalidatedCount++;
            } catch (Throwable $e) {
                $this->logger->error('Failed to invalidate cache key', [
                    'key' => $keyString,
                    'tag' => $tag->toString(),
                    'error' => $e->getMessage(),
                ]);
            }
        }
        
        $this->cache->delete($tagKey);
        
        $this->logger->info('Cache tag invalidated', [
            'tag' => $tag->toString(),
            'keys_invalidated' => $invalidatedCount,
        ]);
    }
    
    /** @param array<CacheTag> $tags */
    public function invalidateTags(array $tags): void
    {
        foreach ($tags as $tag) {
            $this->invalidateTag($tag);
        }
    }
    
    public function invalidatePattern(string $pattern): void
    {
        if (!$this->cache instanceof RedisCache) {
            throw new CacheInvalidationException(
                'Pattern invalidation only supported for Redis cache'
            );
        }
        
        $keys = $this->cache->getRedisInstance()->keys($pattern);
        
        if (empty($keys)) {
            return;
        }
        
        $this->cache->getRedisInstance()->del($keys);
        
        $this->logger->info('Cache pattern invalidated', [
            'pattern' => $pattern,
            'keys_invalidated' => count($keys),
        ]);
    }
}
<?php

declare(strict_types=1);

namespace App\Cache;

use App\ValueObjects\{CacheKey, CacheTTL};
use App\Exceptions\CacheSerializationException;
use Redis;
use WeakMap;

final class MultiLevelCacheManager
{
    /** @var array<string, mixed> */
    private array $memoryCache = [];
    private readonly bool $apcuAvailable;
    
    public function __construct(
        private readonly Redis $redis,
        private readonly CacheTTL $defaultTtl = new CacheTTL(3600),
    ) {
        $this->apcuAvailable = extension_loaded('apcu');
    }
    
    public function get(CacheKey $key, ?callable $callback = null, ?CacheTTL $ttl = null): mixed
    {
        $keyString = $key->toString();
        $ttl ??= $this->defaultTtl;
        
        // Level 1: Memory cache (fastest)
        if (isset($this->memoryCache[$keyString])) {
            return $this->memoryCache[$keyString];
        }
        
        // Level 2: APCu (shared memory)
        if ($this->apcuAvailable && apcu_exists($keyString)) {
            $value = apcu_fetch($keyString);
            $this->memoryCache[$keyString] = $value;
            return $value;
        }
        
        // Level 3: Redis (distributed cache)
        $serializedValue = $this->redis->get($keyString);
        if ($serializedValue !== false) {
            try {
                $value = unserialize($serializedValue);
                $this->memoryCache[$keyString] = $value;
                
                if ($this->apcuAvailable) {
                    apcu_store($keyString, $value, $ttl->toSeconds());
                }
                
                return $value;
            } catch (Throwable $e) {
                throw new CacheSerializationException(
                    "Failed to unserialize cached value for key: {$keyString}",
                    previous: $e
                );
            }
        }
        
        // Generate value if callback provided
        if ($callback !== null) {
            $value = $callback();
            $this->set($key, $value, $ttl);
            return $value;
        }
        
        return null;
    }
    
    public function set(CacheKey $key, mixed $value, ?CacheTTL $ttl = null): void
    {
        $keyString = $key->toString();
        $ttl ??= $this->defaultTtl;
        
        // Store in all cache levels
        $this->memoryCache[$keyString] = $value;
        
        if ($this->apcuAvailable) {
            apcu_store($keyString, $value, $ttl->toSeconds());
        }
        
        try {
            $this->redis->setex($keyString, $ttl->toSeconds(), serialize($value));
        } catch (Throwable $e) {
            throw new CacheSerializationException(
                "Failed to serialize value for key: {$keyString}",
                previous: $e
            );
        }
    }
    
    public function delete(CacheKey $key): void
    {
        $keyString = $key->toString();
        
        unset($this->memoryCache[$keyString]);
        
        if ($this->apcuAvailable) {
            apcu_delete($keyString);
        }
        
        $this->redis->del($keyString);
    }
    
    public function clear(): void
    {
        $this->memoryCache = [];
        
        if ($this->apcuAvailable) {
            apcu_clear_cache();
        }
        
        $this->redis->flushdb();
    }
}
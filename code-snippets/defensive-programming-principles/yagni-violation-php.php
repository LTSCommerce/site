<?php

// YAGNI Violation: Over-engineered "flexible" caching system
class AbstractCacheAdapter 
{
    abstract public function get(string $key): mixed;
    abstract public function set(string $key, mixed $value, int $ttl = 3600): void;
    abstract public function delete(string $key): void;
    abstract public function clear(): void;
    abstract public function getMultiple(array $keys): array;
    abstract public function setMultiple(array $items, int $ttl = 3600): void;
    abstract public function deleteMultiple(array $keys): void;
    abstract public function increment(string $key, int $value = 1): int;
    abstract public function decrement(string $key, int $value = 1): int;
    abstract public function exists(string $key): bool;
    abstract public function getTtl(string $key): ?int;
    abstract public function expire(string $key, int $ttl): void;
    abstract public function persist(string $key): void;
}

// Multiple implementations "for flexibility"
class RedisCacheAdapter extends AbstractCacheAdapter { /* ... */ }
class FileCacheAdapter extends AbstractCacheAdapter { /* ... */ }
class DatabaseCacheAdapter extends AbstractCacheAdapter { /* ... */ }
class MemcachedCacheAdapter extends AbstractCacheAdapter { /* ... */ }

// Complex factory pattern with configuration
class CacheFactory 
{
    public static function create(array $config): AbstractCacheAdapter 
    {
        $type = $config['type'] ?? 'file';
        $strategies = $config['fallback_strategies'] ?? [];
        
        return match($type) {
            'redis' => new RedisCacheAdapter($config['redis'] ?? []),
            'file' => new FileCacheAdapter($config['file'] ?? []),
            'database' => new DatabaseCacheAdapter($config['database'] ?? []),
            'memcached' => new MemcachedCacheAdapter($config['memcached'] ?? []),
            default => throw new InvalidArgumentException("Unknown cache type: $type")
        };
    }
}

// Reality: You only needed simple file caching for user sessions
class UserSessionCache 
{
    public function getSession(string $sessionId): ?array 
    {
        $file = "/tmp/sessions/$sessionId";
        return file_exists($file) ? json_decode(file_get_contents($file), true) : null;
    }
    
    public function saveSession(string $sessionId, array $data): void 
    {
        file_put_contents("/tmp/sessions/$sessionId", json_encode($data));
    }
}
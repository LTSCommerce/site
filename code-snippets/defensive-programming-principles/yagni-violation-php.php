<?php

// YAGNI Violation: Over-engineered "flexible" caching system
abstract class CacheAdapter 
{
    abstract public function get(string $key): mixed;
    abstract public function set(string $key, mixed $value, int $ttl = 3600): void;
    abstract public function delete(string $key): void;
    abstract public function clear(): void;
    abstract public function exists(string $key): bool;
    // "We might need these features someday..."
    abstract public function getMultiple(array $keys): array;
    abstract public function setMultiple(array $items, int $ttl = 3600): void;
    abstract public function deleteMultiple(array $keys): void;
    abstract public function increment(string $key, int $value = 1): int;
    abstract public function decrement(string $key, int $value = 1): int;
    abstract public function getTtl(string $key): ?int;
    abstract public function expire(string $key, int $ttl): void;
    abstract public function addTags(string $key, array $tags): void;
    abstract public function invalidateByTag(string $tag): int;
    abstract public function getStats(): array;
}

// Multiple implementations "for future flexibility"
class RedisCacheAdapter extends CacheAdapter 
{
    // 200+ lines of Redis-specific implementation
    // Most methods never used in production
}

class FileCacheAdapter extends CacheAdapter 
{
    // Complex file locking, serialization, cleanup
    // Slower than Redis but "more portable"
}

class DatabaseCacheAdapter extends CacheAdapter 
{
    // SQL queries for caching - defeating the purpose
}

// Complex configuration system
interface CacheConfigurationInterface 
{
    public function getDefaultTtl(): int;
    public function getNamespace(): string;
    public function getSerializationFormat(): string;
    public function enableCompression(): bool;
    public function getCompressionLevel(): int;
}

class ConfigurableRedisCache extends RedisCacheAdapter 
{
    private CacheConfigurationInterface $config;
    private SerializerInterface $serializer;
    private CompressionInterface $compressor;
    
    // Months of development for features never requested
}
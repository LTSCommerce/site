<?php
interface CacheInterface {
    public function get(string $key): mixed;
    public function set(string $key, mixed $value): void;
}

class RedisCache implements CacheInterface {
    public function get(string $key): mixed {
        // Redis implementation
    }
    
    public function set(string $key, mixed $value): void {
        // Redis implementation
    }
}

// In your DI container configuration
$container->bind(CacheInterface::class, RedisCache::class);

// Type-hint against the interface
class ProductService {
    public function __construct(
        private CacheInterface $cache  // Interface exists at runtime
    ) {}
}
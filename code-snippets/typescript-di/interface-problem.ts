// This interface disappears after compilation
interface Cache {
    get(key: string): any;
    set(key: string, value: any): void;
}

class RedisCache implements Cache {
    get(key: string): any {
        // Redis implementation
    }
    
    set(key: string, value: any): void {
        // Redis implementation
    }
}

// Problem: Can't do this - interfaces don't exist at runtime
// container.bind(Cache, RedisCache); // ERROR!

// Solution 1: Use injection tokens
const CACHE_TOKEN = Symbol('Cache');
container.bind(CACHE_TOKEN, RedisCache);

// Solution 2: Use abstract classes (they DO exist at runtime)
abstract class CacheBase {
    abstract get(key: string): any;
    abstract set(key: string, value: any): void;
}

class RedisCacheImpl extends CacheBase {
    get(key: string): any { /* ... */ }
    set(key: string, value: any): void { /* ... */ }
}

// This works because CacheBase exists at runtime
container.bind(CacheBase, RedisCacheImpl);
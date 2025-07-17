<?php

declare(strict_types=1);

namespace App\Performance;

use App\ValueObjects\CacheStats;
use App\Exceptions\OpCacheException;

final readonly class OpCacheOptimizer
{
    public function getStats(): CacheStats
    {
        if (!function_exists('opcache_get_status')) {
            throw new OpCacheException('OPcache extension not available');
        }
        
        $status = opcache_get_status(false);
        
        if ($status === false) {
            throw new OpCacheException('Failed to get OPcache status');
        }
        
        return new CacheStats(
            enabled: $status['opcache_enabled'],
            hitRate: $this->calculateHitRate($status),
            memoryUsage: $status['memory_usage'],
            scripts: $status['opcache_statistics']['num_cached_scripts'],
            maxScripts: $status['opcache_statistics']['max_cached_keys']
        );
    }
    
    private function calculateHitRate(array $status): float
    {
        $hits = $status['opcache_statistics']['hits'];
        $misses = $status['opcache_statistics']['misses'];
        $total = $hits + $misses;
        
        return $total > 0 ? ($hits / $total) * 100 : 0.0;
    }
    
    public function clearCache(): bool
    {
        if (!function_exists('opcache_reset')) {
            throw new OpCacheException('OPcache reset function not available');
        }
        
        return opcache_reset();
    }
    
    public function preloadScript(string $filename): bool
    {
        if (!function_exists('opcache_compile_file')) {
            throw new OpCacheException('OPcache compile function not available');
        }
        
        if (!file_exists($filename)) {
            throw new OpCacheException("File not found: {$filename}");
        }
        
        return opcache_compile_file($filename);
    }
}
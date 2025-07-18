<?php

declare(strict_types=1);

namespace App\Monitoring\OPcache;

use App\Exceptions\OPcacheNotAvailableException;
use App\ValueObjects\{HitRate, MemoryUsage};

final readonly class OPcacheMonitor
{
    public function __construct(
        private OPcacheStatusReader $statusReader,
        private OPcacheConfigReader $configReader,
    ) {
    }

    public function getStats(): OPcacheStats
    {
        if (!extension_loaded('opcache')) {
            throw new OPcacheNotAvailableException('OPcache extension not loaded');
        }

        $status = $this->statusReader->read();
        $config = $this->configReader->read();

        return new OPcacheStats(
            enabled: $status['opcache_enabled'],
            hitRate: HitRate::fromFloat($status['opcache_statistics']['opcache_hit_rate']),
            memoryUsage: MemoryUsage::fromArray($status['memory_usage']),
            cachedScripts: $status['opcache_statistics']['num_cached_scripts'],
            maxCachedKeys: $config['directives']['opcache.max_accelerated_files'],
            jitEnabled: $config['directives']['opcache.jit_buffer_size'] > 0,
            jitBufferSize: $config['directives']['opcache.jit_buffer_size'],
        );
    }

    public function reset(): void
    {
        if (!opcache_reset()) {
            throw new OPcacheResetFailedException('Failed to reset OPcache');
        }
    }

    public function invalidateFile(string $filePath): void
    {
        if (!opcache_invalidate($filePath, true)) {
            throw new OPcacheInvalidationFailedException(
                "Failed to invalidate file: {$filePath}"
            );
        }
    }
}

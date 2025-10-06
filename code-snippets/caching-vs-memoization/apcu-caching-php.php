<?php

declare(strict_types=1);

class ConfigurationCache
{
    private string $configFile;

    public function __construct(string $configFile)
    {
        $this->configFile = $configFile;
    }

    public function getConfig(): array
    {
        $cacheKey = 'app:config';

        // Check if APCu is available
        if (function_exists('apcu_enabled') && apcu_enabled()) {
            $cached = apcu_fetch($cacheKey, $success);
            if ($success) {
                return $cached;
            }
        }

        // Load from file
        $config = include $this->configFile;

        // Store in APCu (no TTL - persists until server restart)
        if (function_exists('apcu_store')) {
            apcu_store($cacheKey, $config);
        }

        return $config;
    }

    public function invalidateConfig(): void
    {
        if (function_exists('apcu_delete')) {
            apcu_delete('app:config');
        }
    }
}

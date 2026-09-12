<?php

declare(strict_types=1);

namespace App\Caching;

use JsonException;
use Redis;

final class MultiLevelCacheManager
{
    /** @var array<string, mixed> */
    private array $l1Cache = [];

    public function __construct(
        private readonly Redis $l2Cache,
        private readonly int $l1MaxEntries = 500,
        private readonly int $l2TtlSeconds = 3600,
    ) {
    }

    public function get(string $key, mixed $default = null): mixed
    {
        if (array_key_exists($key, $this->l1Cache)) {
            return $this->l1Cache[$key];
        }

        $encoded = $this->l2Cache->get($key);

        if ($encoded === false) {
            return $default;
        }

        try {
            $value = json_decode($encoded, associative: true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return $default;
        }

        $this->backfillL1($key, $value);

        return $value;
    }

    public function set(string $key, mixed $value): void
    {
        $this->backfillL1($key, $value);
        $this->l2Cache->set($key, json_encode($value, JSON_THROW_ON_ERROR), $this->l2TtlSeconds);
    }

    public function delete(string $key): void
    {
        unset($this->l1Cache[$key]);
        $this->l2Cache->del($key);
    }

    private function backfillL1(string $key, mixed $value): void
    {
        if (count($this->l1Cache) >= $this->l1MaxEntries) {
            array_shift($this->l1Cache);
        }

        $this->l1Cache[$key] = $value;
    }
}

<?php

declare(strict_types=1);

class MetricsCollector
{
    private Redis $redis;

    private array $metrics = [];

    public function __construct(Redis $redis)
    {
        $this->redis = $redis;
    }

    public function increment(string $metric, int $value = 1, array $tags = []): void
    {
        $key = $this->buildKey($metric, $tags);
        $this->redis->incrby($key, $value);
        $this->redis->expire($key, 3600);
    }

    public function gauge(string $metric, float $value, array $tags = []): void
    {
        $key = $this->buildKey($metric, $tags);
        $this->redis->set($key, $value);
        $this->redis->expire($key, 3600);
    }

    public function timing(string $metric, float $duration, array $tags = []): void
    {
        $key = $this->buildKey($metric . '.timing', $tags);
        $this->redis->lpush($key, $duration);
        $this->redis->ltrim($key, 0, 999); // Keep last 1000 measurements
        $this->redis->expire($key, 3600);
    }

    public function histogram(string $metric, float $value, array $tags = []): void
    {
        $buckets = [0.1, 0.5, 1, 2.5, 5, 10];

        foreach ($buckets as $bucket) {
            if ($value <= $bucket) {
                $key = $this->buildKey($metric . '.bucket', array_merge($tags, ['le' => $bucket]));
                $this->redis->incr($key);
                $this->redis->expire($key, 3600);
            }
        }
    }

    private function buildKey(string $metric, array $tags): string
    {
        $tagString = '';
        if (!empty($tags)) {
            ksort($tags);
            $tagString = ':' . implode(':', array_map(
                fn ($k, $v) => "$k=$v",
                array_keys($tags),
                array_values($tags)
            ));
        }

        return "metrics:$metric$tagString";
    }

    public function flush(): void
    {
        // Send metrics to monitoring system
        $keys = $this->redis->keys('metrics:*');

        foreach ($keys as $key) {
            $value = $this->redis->get($key);
            // Send to StatsD, Prometheus, etc.
            $this->sendMetric($key, $value);
        }
    }

    private function sendMetric(string $key, $value): void
    {
        // Implementation depends on monitoring system
        // Example: StatsD
        $socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
        $metric = str_replace('metrics:', '', $key);
        $packet = "$metric:$value|c";
        socket_sendto($socket, $packet, strlen($packet), 0, '127.0.0.1', 8125);
        socket_close($socket);
    }
}

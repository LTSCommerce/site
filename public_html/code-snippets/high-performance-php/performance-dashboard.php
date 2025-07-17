<?php

class PerformanceDashboard {
    private $redis;
    
    public function __construct(Redis $redis) {
        $this->redis = $redis;
    }
    
    public function recordMetric(string $name, float $value): void {
        $timestamp = time();
        $key = "metrics:{$name}";
        
        // Store in time series
        $this->redis->zadd($key, $timestamp, $value);
        
        // Keep only last hour of data
        $this->redis->zremrangebyscore($key, 0, $timestamp - 3600);
    }
    
    public function getMetrics(string $name, int $duration = 3600): array {
        $key = "metrics:{$name}";
        $from = time() - $duration;
        
        return $this->redis->zrangebyscore($key, $from, '+inf', [
            'withscores' => true
        ]);
    }
    
    public function getAverageResponseTime(): float {
        $metrics = $this->getMetrics('response_time');
        if (empty($metrics)) {
            return 0;
        }
        
        return array_sum($metrics) / count($metrics);
    }
}
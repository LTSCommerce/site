<?php

declare(strict_types=1);

class CircuitBreaker
{
    private Redis $redis;

    private int $failureThreshold;

    private int $recoveryTimeout;

    private int $monitoringPeriod;

    public function __construct(Redis $redis, int $failureThreshold = 5, int $recoveryTimeout = 300, int $monitoringPeriod = 60)
    {
        $this->redis            = $redis;
        $this->failureThreshold = $failureThreshold;
        $this->recoveryTimeout  = $recoveryTimeout;
        $this->monitoringPeriod = $monitoringPeriod;
    }

    public function call(string $service, callable $operation)
    {
        $state = $this->getState($service);

        switch ($state) {
            case 'open':
                if ($this->shouldAttemptReset($service)) {
                    $this->setState($service, 'half-open');

                    return $this->executeOperation($service, $operation);
                }

                throw new CircuitBreakerOpenException("Circuit breaker is open for $service");
            case 'half-open':
                return $this->executeOperation($service, $operation);

            case 'closed':
            default:
                return $this->executeOperation($service, $operation);
        }
    }

    private function executeOperation(string $service, callable $operation)
    {
        try {
            $result = $operation();
            $this->recordSuccess($service);

            return $result;
        } catch (Exception $e) {
            $this->recordFailure($service);

            throw $e;
        }
    }

    private function recordSuccess(string $service): void
    {
        $key = "circuit_breaker:$service";
        $this->redis->hdel($key, 'failures');
        $this->setState($service, 'closed');
    }

    private function recordFailure(string $service): void
    {
        $key      = "circuit_breaker:$service";
        $failures = $this->redis->hincrby($key, 'failures', 1);
        $this->redis->expire($key, $this->monitoringPeriod);

        if ($failures >= $this->failureThreshold) {
            $this->setState($service, 'open');
        }
    }

    private function getState(string $service): string
    {
        $key = "circuit_breaker:$service";

        return $this->redis->hget($key, 'state') ?: 'closed';
    }

    private function setState(string $service, string $state): void
    {
        $key = "circuit_breaker:$service";
        $this->redis->hset($key, 'state', $state);

        if ($state === 'open') {
            $this->redis->hset($key, 'opened_at', time());
        }
    }

    private function shouldAttemptReset(string $service): bool
    {
        $key      = "circuit_breaker:$service";
        $openedAt = $this->redis->hget($key, 'opened_at');

        return $openedAt && (time() - $openedAt) > $this->recoveryTimeout;
    }
}

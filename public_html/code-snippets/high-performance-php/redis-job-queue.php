<?php

declare(strict_types=1);

namespace App\Queue;

use App\ValueObjects\{QueueName, JobDelay, JobId};
use App\Exceptions\{JobSerializationException, QueueOperationException};
use App\Contracts\{JobInterface, QueueInterface};
use Redis;
use Psr\Log\LoggerInterface;

final readonly class RedisJobQueue implements QueueInterface
{
    public function __construct(
        private Redis $redis,
        private QueueName $queueName,
        private LoggerInterface $logger,
    ) {}
    
    public function push(JobInterface $job, ?JobDelay $delay = null): void
    {
        try {
            $payload = serialize($job);
        } catch (Throwable $e) {
            throw new JobSerializationException(
                "Failed to serialize job: {$job::class}",
                previous: $e
            );
        }
        
        if ($delay !== null && $delay->getSeconds() > 0) {
            $this->redis->zadd(
                "queue:{$this->queueName->value}:delayed",
                time() + $delay->getSeconds(),
                $payload
            );
        } else {
            $this->redis->lpush("queue:{$this->queueName->value}", $payload);
        }
        
        $this->logger->debug('Job pushed to queue', [
            'queue' => $this->queueName->value,
            'job_type' => $job::class,
            'delayed' => $delay?->getSeconds() ?? 0,
        ]);
    }
    
    public function pop(int $timeout = 0): ?JobInterface
    {
        $this->moveDelayedJobs();
        
        $result = $this->redis->brpop("queue:{$this->queueName->value}", $timeout);
        
        if (!$result) {
            return null;
        }
        
        try {
            return unserialize($result[1]);
        } catch (Throwable $e) {
            throw new JobSerializationException(
                "Failed to unserialize job from queue: {$this->queueName->value}",
                previous: $e
            );
        }
    }
    
    private function moveDelayedJobs(): void
    {
        $now = time();
        $jobs = $this->redis->zrangebyscore(
            "queue:{$this->queueName->value}:delayed",
            0,
            $now
        );
        
        foreach ($jobs as $job) {
            $this->redis->lpush("queue:{$this->queueName->value}", $job);
            $this->redis->zrem("queue:{$this->queueName->value}:delayed", $job);
        }
    }
    
    public function size(): int
    {
        return $this->redis->llen("queue:{$this->queueName->value}");
    }
    
    public function clear(): void
    {
        $this->redis->del("queue:{$this->queueName->value}");
        $this->redis->del("queue:{$this->queueName->value}:delayed");
    }
}
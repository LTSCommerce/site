<?php

declare(strict_types=1);

namespace App\Jobs;

use JsonException;
use Redis;
use RuntimeException;

final class RedisJobQueue
{
    /**
     * @param array<string, class-string<Job>> $jobClassMap keyed by Job::getName()
     */
    public function __construct(
        private readonly Redis $redis,
        private readonly array $jobClassMap,
        private readonly string $queueKey = 'jobs:default',
    ) {
    }

    public function push(Job $job): void
    {
        $encoded = json_encode([
            'name'    => $job->getName(),
            'payload' => $job->getPayload(),
        ], JSON_THROW_ON_ERROR);

        $this->redis->lPush($this->queueKey, $encoded);
    }

    public function pop(int $timeoutSeconds = 5): ?Job
    {
        $result = $this->redis->brPop([$this->queueKey], $timeoutSeconds);

        if ($result === [] || $result === false) {
            return null;
        }

        [, $encoded] = $result;

        try {
            $decoded = json_decode($encoded, associative: true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException("Failed to decode job payload: {$e->getMessage()}", previous: $e);
        }

        $jobClass = $this->jobClassMap[$decoded['name']]
            ?? throw new RuntimeException("No job class registered for '{$decoded['name']}'");

        return $jobClass::fromPayload($decoded['payload']);
    }
}

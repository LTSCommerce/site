<?php

declare(strict_types=1);

namespace App\Jobs;

abstract class Job
{
    abstract public function handle(): void;

    abstract public function getName(): string;

    /** @return array<string, mixed> */
    abstract public function getPayload(): array;

    /**
     * @param array<string, mixed> $payload
     */
    abstract public static function fromPayload(array $payload): self;

    public function getMaxRetries(): int
    {
        return 3;
    }
}

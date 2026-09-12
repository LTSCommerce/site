<?php

declare(strict_types=1);

namespace App\Performance;

use InvalidArgumentException;

final class MemoryProfiler
{
    /** @var array<string, array{usage: int, peak: int}> */
    private array $checkpoints = [];

    public function checkpoint(string $label): void
    {
        $this->checkpoints[$label] = [
            'usage' => memory_get_usage(real_usage: true),
            'peak'  => memory_get_peak_usage(real_usage: true),
        ];
    }

    /**
     * @return array{from: string, to: string, deltaBytes: int, peakBytes: int}
     */
    public function diff(string $fromLabel, string $toLabel): array
    {
        if (!isset($this->checkpoints[$fromLabel], $this->checkpoints[$toLabel])) {
            throw new InvalidArgumentException('Both checkpoints must be recorded before diffing');
        }

        $from = $this->checkpoints[$fromLabel];
        $to   = $this->checkpoints[$toLabel];

        return [
            'from'       => $fromLabel,
            'to'         => $toLabel,
            'deltaBytes' => $to['usage'] - $from['usage'],
            'peakBytes'  => $to['peak'],
        ];
    }

    /**
     * @return array<string, array{usage: int, peak: int}>
     */
    public function getCheckpoints(): array
    {
        return $this->checkpoints;
    }
}

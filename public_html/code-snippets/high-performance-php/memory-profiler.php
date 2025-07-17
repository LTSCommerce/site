<?php

declare(strict_types=1);

namespace App\Profiling;

use App\ValueObjects\{MemoryUsage, Duration, CheckpointName};
use App\Exceptions\CheckpointNotFoundException;
use DateTimeImmutable;

final class MemoryProfiler
{
    /** @var array<string, MemoryCheckpoint> */
    private array $checkpoints = [];
    
    public function checkpoint(CheckpointName $name): void
    {
        $this->checkpoints[$name->value] = new MemoryCheckpoint(
            name: $name,
            memoryUsage: MemoryUsage::current(),
            peakMemoryUsage: MemoryUsage::peak(),
            timestamp: new DateTimeImmutable()
        );
    }
    
    public function getDiff(CheckpointName $from, CheckpointName $to): MemoryDiff
    {
        $fromCheckpoint = $this->checkpoints[$from->value] ?? null;
        $toCheckpoint = $this->checkpoints[$to->value] ?? null;
        
        if ($fromCheckpoint === null || $toCheckpoint === null) {
            throw new CheckpointNotFoundException(
                "Checkpoint not found: {$from->value} or {$to->value}"
            );
        }
        
        return new MemoryDiff(
            from: $fromCheckpoint,
            to: $toCheckpoint,
            memoryDiff: $toCheckpoint->memoryUsage->subtract($fromCheckpoint->memoryUsage),
            peakDiff: $toCheckpoint->peakMemoryUsage->subtract($fromCheckpoint->peakMemoryUsage),
            timeDiff: Duration::between($fromCheckpoint->timestamp, $toCheckpoint->timestamp)
        );
    }
    
    /** @return array<string, MemoryDiff> */
    public function getReport(): array
    {
        $report = [];
        $checkpointNames = array_keys($this->checkpoints);
        
        for ($i = 1; $i < count($checkpointNames); $i++) {
            $from = CheckpointName::fromString($checkpointNames[$i - 1]);
            $to = CheckpointName::fromString($checkpointNames[$i]);
            $report["{$from->value} → {$to->value}"] = $this->getDiff($from, $to);
        }
        
        return $report;
    }
    
    public function reset(): void
    {
        $this->checkpoints = [];
    }
    
    public function hasCheckpoint(CheckpointName $name): bool
    {
        return isset($this->checkpoints[$name->value]);
    }
    
    public function getCheckpoint(CheckpointName $name): ?MemoryCheckpoint
    {
        return $this->checkpoints[$name->value] ?? null;
    }
}
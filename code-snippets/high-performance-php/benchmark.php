<?php

declare(strict_types=1);

namespace App\Performance;

final class Benchmark
{
    /**
     * @return array{iterations: int, minMs: float, maxMs: float, meanMs: float}
     */
    public function run(callable $subject, int $iterations = 1000): array
    {
        $durationsMs = [];

        for ($i = 0; $i < $iterations; $i++) {
            $start = hrtime(true);
            $subject();
            $durationsMs[] = (hrtime(true) - $start) / 1_000_000;
        }

        return [
            'iterations' => $iterations,
            'minMs'      => min($durationsMs),
            'maxMs'      => max($durationsMs),
            'meanMs'     => array_sum($durationsMs) / count($durationsMs),
        ];
    }
}

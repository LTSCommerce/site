<?php

declare(strict_types=1);

namespace App\Monitoring;

use App\Database\Performance\QueryOptimizer;
use App\Monitoring\OPcache\OPcacheMonitor;
use App\Performance\MemoryProfiler;
use DateTimeImmutable;

final readonly class PerformanceDashboard
{
    public function __construct(
        private OPcacheMonitor $opcacheMonitor,
        private QueryOptimizer $queryOptimizer,
        private MemoryProfiler $memoryProfiler,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function getSnapshot(): array
    {
        $opcacheStats = $this->opcacheMonitor->getStats();
        $slowQueries  = $this->queryOptimizer->getSlowQueries();

        return [
            'opcache' => [
                'enabled'       => $opcacheStats->enabled,
                'hitRate'       => $opcacheStats->hitRate,
                'cachedScripts' => $opcacheStats->cachedScripts,
                'jitEnabled'    => $opcacheStats->jitEnabled,
            ],
            'database' => [
                'slowQueryCount' => count($slowQueries),
            ],
            'memory' => $this->memoryProfiler->getCheckpoints(),
            'generatedAt' => (new DateTimeImmutable())->format(DATE_ATOM),
        ];
    }
}

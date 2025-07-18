<?php

declare(strict_types=1);

namespace App\Database\Performance;

use App\Exceptions\SlowQueryThresholdExceededException;
use App\ValueObjects\{QueryDuration, QueryMetrics};
use Psr\Log\LoggerInterface;

final readonly class QueryOptimizer
{
    /** @var array<int, QueryMetrics> */
    private array $queryLog = [];

    public function __construct(
        private PDO $pdo,
        private LoggerInterface $logger,
        private float $slowQueryThreshold = 0.1,
        private int $maxSlowQueries = 10,
    ) {
    }

    public function executeQuery(string $sql, array $params = []): array
    {
        $startTime = hrtime(true);

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        $duration = QueryDuration::fromNanoseconds(hrtime(true) - $startTime);

        if ($duration->exceeds($this->slowQueryThreshold)) {
            $this->logSlowQuery($sql, $params, $duration);
        }

        return $result;
    }

    private function logSlowQuery(string $sql, array $params, QueryDuration $duration): void
    {
        $metrics = new QueryMetrics(
            sql: $sql,
            parameters: $params,
            duration: $duration,
            executedAt: new DateTimeImmutable()
        );

        $this->queryLog[] = $metrics;

        $this->logger->warning('Slow query detected', [
            'sql'         => $sql,
            'duration_ms' => $duration->toMilliseconds(),
            'params'      => $params,
        ]);

        if (count($this->queryLog) >= $this->maxSlowQueries) {
            throw new SlowQueryThresholdExceededException(
                'Too many slow queries detected: ' . count($this->queryLog)
            );
        }
    }

    public function getSlowQueries(): array
    {
        return $this->queryLog;
    }
}

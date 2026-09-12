<?php

declare(strict_types=1);

namespace App\Database\Monitoring;

use PDO;

final class SlowQueryAnalyzer
{
    public function __construct(
        private readonly PDO $pdo
    ) {
    }

    public function enableSlowQueryLog(): void
    {
        $this->pdo->exec("SET GLOBAL slow_query_log = 'ON'");
        $this->pdo->exec('SET GLOBAL long_query_time = 1');
        $this->pdo->exec("SET GLOBAL log_queries_not_using_indexes = 'ON'");
    }

    public function getSlowQueries(): array
    {
        // x$statement_analysis exposes raw picosecond timings; the plain
        // statement_analysis view formats them as strings ("153.13 ms"),
        // which can't be compared numerically.
        $sql = 'SELECT
            query,
            exec_count,
            total_latency,
            avg_latency,
            lock_latency,
            rows_sent,
            rows_examined
        FROM sys.x$statement_analysis
        WHERE avg_latency > 1000000000000  -- 1 second, in picoseconds
        ORDER BY total_latency DESC
        LIMIT 20';

        return $this->pdo->query($sql)->fetchAll();
    }

    public function getTableScans(): array
    {
        $sql = 'SELECT
            object_name,
            count_read,
            avg_timer_read AS avg_read_latency,
            count_write,
            avg_timer_write AS avg_write_latency
        FROM performance_schema.table_io_waits_summary_by_table
        ORDER BY count_read DESC
        LIMIT 20';

        return $this->pdo->query($sql)->fetchAll();
    }
}

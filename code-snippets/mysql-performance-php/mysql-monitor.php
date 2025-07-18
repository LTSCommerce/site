<?php

declare(strict_types=1);

namespace App\Database\Monitoring;

use PDO;

final class MySQLMonitor
{
    public function __construct(
        private readonly PDO $pdo
    ) {
    }

    public function getPerformanceMetrics(): array
    {
        $sql = "SHOW GLOBAL STATUS WHERE Variable_name IN (
            'Connections',
            'Threads_running',
            'Questions',
            'Slow_queries',
            'Opens',
            'Flush_commands',
            'Open_tables',
            'Queries_per_second_avg',
            'Innodb_buffer_pool_read_requests',
            'Innodb_buffer_pool_reads',
            'Innodb_buffer_pool_wait_free',
            'Innodb_log_waits',
            'Innodb_rows_read',
            'Innodb_rows_inserted',
            'Innodb_rows_updated',
            'Innodb_rows_deleted'
        )";

        $result  = $this->pdo->query($sql)->fetchAll();
        $metrics = [];

        foreach ($result as $row) {
            $metrics[$row['Variable_name']] = $row['Value'];
        }

        // Calculate buffer pool hit ratio
        $reads                            = $metrics['Innodb_buffer_pool_reads'];
        $requests                         = $metrics['Innodb_buffer_pool_read_requests'];
        $metrics['buffer_pool_hit_ratio'] = (($requests - $reads) / $requests) * 100;

        return $metrics;
    }

    public function getActiveConnections(): array
    {
        $sql = "SELECT 
            id,
            user,
            host,
            db,
            command,
            time,
            state,
            info
        FROM information_schema.processlist
        WHERE command != 'Sleep'
        ORDER BY time DESC";

        return $this->pdo->query($sql)->fetchAll();
    }

    public function getInnoDBStatus(): array
    {
        $sql    = 'SHOW ENGINE INNODB STATUS';
        $result = $this->pdo->query($sql)->fetch();

        return $this->parseInnoDBStatus($result['Status']);
    }

    private function parseInnoDBStatus(string $status): array
    {
        $metrics = [];

        // Parse buffer pool info
        if (preg_match('/Buffer pool size\s+(\d+)/', $status, $matches)) {
            $metrics['buffer_pool_size'] = $matches[1];
        }

        // Parse log sequence number
        if (preg_match('/Log sequence number\s+(\d+)/', $status, $matches)) {
            $metrics['log_sequence_number'] = $matches[1];
        }

        // Parse pending reads/writes
        if (preg_match('/Pending normal aio reads:\s+(\d+)/', $status, $matches)) {
            $metrics['pending_reads'] = $matches[1];
        }

        return $metrics;
    }
}

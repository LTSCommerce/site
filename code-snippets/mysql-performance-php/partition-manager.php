<?php

declare(strict_types=1);

namespace App\Database\Partitioning;

use PDO;

final class PartitionManager 
{
    public function __construct(
        private readonly PDO $pdo
    ) {}
    
    public function addPartition(string $table, string $partition, string $value): void 
    {
        $sql = "ALTER TABLE {$table} ADD PARTITION (
            PARTITION {$partition} VALUES LESS THAN ({$value})
        )";
        
        $this->pdo->exec($sql);
    }
    
    public function dropOldPartitions(string $table, int $keepDays = 90): void 
    {
        $cutoffDate = date('Y-m-d', strtotime("-{$keepDays} days"));
        
        $sql = "SELECT 
            partition_name,
            partition_description
        FROM information_schema.partitions
        WHERE table_name = ? AND partition_name IS NOT NULL
        ORDER BY partition_ordinal_position";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$table]);
        $partitions = $stmt->fetchAll();
        
        foreach ($partitions as $partition) {
            $partitionDate = $partition['partition_description'];
            if ($partitionDate < $cutoffDate) {
                $this->dropPartition($table, $partition['partition_name']);
            }
        }
    }
    
    private function dropPartition(string $table, string $partition): void 
    {
        $sql = "ALTER TABLE {$table} DROP PARTITION {$partition}";
        $this->pdo->exec($sql);
    }
}
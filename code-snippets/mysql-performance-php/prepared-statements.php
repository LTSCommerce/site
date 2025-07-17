<?php

declare(strict_types=1);

namespace App\Database\Statements;

use App\ValueObjects\{SqlStatement, BatchResult};
use App\Exceptions\{StatementExecutionException, BatchExecutionException};
use PDO;
use PDOStatement;
use PDOException;
use Psr\Log\LoggerInterface;
use WeakMap;

final class PreparedStatementPool
{
    /** @var array<string, PDOStatement> */
    private array $statements = [];
    private readonly WeakMap $statementMetadata;
    
    public function __construct(
        private readonly PDO $connection,
        private readonly LoggerInterface $logger,
        private readonly int $maxStatements = 1000,
    ) {
        $this->statementMetadata = new WeakMap();
    }
    
    public function getStatement(SqlStatement $sql): PDOStatement
    {
        $key = $sql->getHash();
        
        if (!isset($this->statements[$key])) {
            if (count($this->statements) >= $this->maxStatements) {
                $this->evictOldestStatement();
            }
            
            try {
                $this->statements[$key] = $this->connection->prepare($sql->value);
                $this->statementMetadata[$this->statements[$key]] = [
                    'created_at' => time(),
                    'usage_count' => 0,
                ];
            } catch (PDOException $e) {
                throw new StatementExecutionException(
                    "Failed to prepare statement: {$e->getMessage()}",
                    previous: $e
                );
            }
        }
        
        $stmt = $this->statements[$key];
        $metadata = $this->statementMetadata[$stmt];
        $metadata['usage_count']++;
        $this->statementMetadata[$stmt] = $metadata;
        
        return $stmt;
    }
    
    public function executeStatement(SqlStatement $sql, array $params = []): array
    {
        $stmt = $this->getStatement($sql);
        
        try {
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            $this->logger->error('Statement execution failed', [
                'sql' => $sql->value,
                'params' => $params,
                'error' => $e->getMessage(),
            ]);
            
            throw new StatementExecutionException(
                "Statement execution failed: {$e->getMessage()}",
                previous: $e
            );
        }
    }
    
    public function executeBatch(SqlStatement $sql, array $batchParams): BatchResult
    {
        $stmt = $this->getStatement($sql);
        $affected = 0;
        $errors = [];
        
        $this->connection->beginTransaction();
        
        try {
            foreach ($batchParams as $index => $params) {
                try {
                    $stmt->execute($params);
                    $affected += $stmt->rowCount();
                } catch (PDOException $e) {
                    $errors[$index] = $e->getMessage();
                    
                    if (count($errors) > 10) { // Fail fast after too many errors
                        throw new BatchExecutionException(
                            "Too many errors in batch execution",
                            $errors
                        );
                    }
                }
            }
            
            if (!empty($errors)) {
                $this->connection->rollBack();
                throw new BatchExecutionException(
                    "Batch execution failed with errors",
                    $errors
                );
            }
            
            $this->connection->commit();
            
            return new BatchResult(
                affectedRows: $affected,
                processedCount: count($batchParams),
                errors: $errors
            );
        } catch (Throwable $e) {
            $this->connection->rollBack();
            throw $e;
        }
    }
    
    private function evictOldestStatement(): void
    {
        $oldestKey = null;
        $oldestTime = PHP_INT_MAX;
        
        foreach ($this->statements as $key => $stmt) {
            $metadata = $this->statementMetadata[$stmt];
            if ($metadata['created_at'] < $oldestTime) {
                $oldestTime = $metadata['created_at'];
                $oldestKey = $key;
            }
        }
        
        if ($oldestKey !== null) {
            unset($this->statements[$oldestKey]);
        }
    }
    
    public function getPoolStats(): array
    {
        $stats = [
            'total_statements' => count($this->statements),
            'max_statements' => $this->maxStatements,
            'usage_stats' => [],
        ];
        
        foreach ($this->statements as $key => $stmt) {
            $metadata = $this->statementMetadata[$stmt];
            $stats['usage_stats'][$key] = $metadata;
        }
        
        return $stats;
    }
}
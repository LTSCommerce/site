<?php

declare(strict_types=1);

namespace App\Database\Optimization;

use App\ValueObjects\{DatabaseConfig, QueryResult, CacheKey, CacheTTL};
use App\Exceptions\{DatabaseConnectionException, QueryExecutionException};
use App\Contracts\{CacheInterface, QueryMetricsInterface};
use PDO;
use PDOException;
use Psr\Log\LoggerInterface;

final readonly class DatabaseOptimizer
{
    private PDO $connection;
    
    public function __construct(
        DatabaseConfig $config,
        private CacheInterface $cache,
        private QueryMetricsInterface $metrics,
        private LoggerInterface $logger,
    ) {
        $this->connection = $this->createOptimizedConnection($config);
    }
    
    private function createOptimizedConnection(DatabaseConfig $config): PDO
    {
        try {
            return new PDO(
                $config->dsn,
                $config->username,
                $config->password,
                [
                    PDO::ATTR_PERSISTENT => true,
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => implode(';', [
                        'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci',
                        'SET SESSION sql_mode="STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"',
                        'SET SESSION time_zone="+00:00"',
                        'SET SESSION group_concat_max_len=1000000',
                        'SET SESSION optimizer_switch="mrr=on,mrr_cost_based=on"',
                    ])
                ]
            );
        } catch (PDOException $e) {
            throw new DatabaseConnectionException(
                "Failed to connect to database: {$e->getMessage()}",
                previous: $e
            );
        }
    }
    
    public function executeQuery(string $sql, array $params = []): QueryResult
    {
        $startTime = hrtime(true);
        
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            $data = $stmt->fetchAll();
            
            $executionTime = hrtime(true) - $startTime;
            
            $this->metrics->recordQuery($sql, $params, $executionTime);
            
            return new QueryResult(
                data: $data,
                executionTime: $executionTime,
                rowCount: $stmt->rowCount()
            );
        } catch (PDOException $e) {
            $this->logger->error('Query execution failed', [
                'sql' => $sql,
                'params' => $params,
                'error' => $e->getMessage(),
            ]);
            
            throw new QueryExecutionException(
                "Query execution failed: {$e->getMessage()}",
                previous: $e
            );
        }
    }
    
    public function executeQueryWithCache(
        string $sql,
        array $params = [],
        ?CacheTTL $ttl = null
    ): QueryResult {
        $cacheKey = CacheKey::forQuery($sql, $params);
        
        // Check cache first
        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }
        
        $result = $this->executeQuery($sql, $params);
        $this->cache->set($cacheKey, $result, $ttl ?? new CacheTTL(300));
        
        return $result;
    }
    
    public function transaction(callable $callback): mixed
    {
        $this->connection->beginTransaction();
        
        try {
            $result = $callback($this->connection);
            $this->connection->commit();
            return $result;
        } catch (Throwable $e) {
            $this->connection->rollBack();
            throw $e;
        }
    }
}
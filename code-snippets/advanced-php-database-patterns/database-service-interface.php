<?php

declare(strict_types=1);

namespace App\Database;

use Generator;

/**
 * Service for database operations with automatic retry functionality.
 * Handles connection errors and transient failures gracefully.
 */
interface DatabaseServiceInterface
{
    /**
     * Execute a callback with the database connection, with retry on connection loss.
     *
     * @template T
     * @param callable(\PDO): T $callback Function to execute with the PDO connection
     * @return T The result from the callback
     */
    public function withConnection(callable $callback): mixed;

    /**
     * Execute a query and return all results.
     *
     * @param string $sql SQL query with placeholders
     * @param array<string|int,scalar|null> $params Parameters for the query
     * @param bool $stmtCache Whether to use statement caching (default: true)
     * @return array<int,array<string,mixed>> Query results
     */
    public function query(string $sql, array $params = [], bool $stmtCache = true): array;

    /**
     * Execute a non-query SQL statement.
     *
     * @param string $sql SQL statement with placeholders
     * @param array<string|int,scalar|null> $params Parameters for the statement
     * @param bool $stmtCache Whether to use statement caching (default: true)
     * @return int Number of affected rows
     */
    public function execute(string $sql, array $params = [], bool $stmtCache = true): int;

    /**
     * Stream results from a query using a generator.
     * This is memory-efficient for large result sets.
     *
     * @param string $sql SQL query with placeholders
     * @param array<string|int,scalar|null> $params Parameters for the query
     * @param bool $stmtCache Whether to use statement caching (default: true)
     * @return Generator<int,array<string,mixed>> Generator yielding rows
     */
    public function stream(string $sql, array $params = [], bool $stmtCache = true): Generator;

    /**
     * Execute an INSERT statement and return the last insert ID.
     *
     * @param string $sql INSERT SQL statement with placeholders
     * @param array<string|int,scalar|null> $params Parameters for the statement
     * @param bool $stmtCache Whether to use statement caching (default: true)
     * @return int The last insert ID
     */
    public function insert(string $sql, array $params = [], bool $stmtCache = true): int;
}

<?php

declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOStatement;
use RuntimeException;

/**
 * Implements prepared statement caching for improved performance.
 * Reuses prepared statements within the same request/connection.
 */
trait StatementCachingTrait
{
    /**
     * Cache storage for prepared statements.
     * Key is statement ID, value contains the prepared statement and connection hash.
     *
     * @var array<string,array{stmt: PDOStatement, connection_hash: string, useCnt: int}>
     */
    private static array $statementCache = [];

    /**
     * Get a cached prepared statement or create a new one.
     *
     * @param PDO $pdo The PDO connection
     * @param string $sql The SQL statement to prepare
     * @param bool $stmtCache Whether to use the statement cache
     * @return PDOStatement The prepared statement
     */
    private function getPreparedStatement(PDO $pdo, string $sql, bool $stmtCache = true): PDOStatement
    {
        if (!$stmtCache) {
            return $pdo->prepare($sql);
        }

        $statementId = $this->generateStatementId($sql);
        $connectionHash = spl_object_hash($pdo);

        // Check if we have a cached statement with matching connection
        if (
            isset(self::$statementCache[$statementId])
            && self::$statementCache[$statementId]['connection_hash'] === $connectionHash
        ) {
            // Close any pending result set before reusing the statement
            self::$statementCache[$statementId]['stmt']->closeCursor();
            ++self::$statementCache[$statementId]['useCnt'];

            return self::$statementCache[$statementId]['stmt'];
        }

        // Prepare a new statement and cache it
        $stmt = $pdo->prepare($sql);
        self::$statementCache[$statementId] = [
            'stmt' => $stmt,
            'connection_hash' => $connectionHash,
            'useCnt' => 1,
        ];

        return $stmt;
    }

    /**
     * Generate a unique, readable ID for a SQL statement for caching purposes.
     * Normalizes whitespace and appends an MD5 hash for uniqueness.
     *
     * @param string $sql The SQL statement to generate an ID for
     * @return string The generated statement ID
     */
    private function generateStatementId(string $sql): string
    {
        // Normalize whitespace (replace multiple spaces, tabs, newlines with single space)
        $normalized = preg_replace('/\s+/', ' ', trim($sql));

        if (null === $normalized) {
            throw new RuntimeException('Failed to normalize SQL statement');
        }

        // Take first 30 chars for readability + md5 for uniqueness
        $prefix = substr($normalized, 0, 30);
        $hash = md5($sql);

        return sprintf('%s_%s', $prefix, $hash);
    }

    /**
     * Reset the statement cache (typically called when connection is reset).
     */
    private function resetStatementCache(): void
    {
        self::$statementCache = [];
    }
}

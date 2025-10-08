<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

/**
 * Example: Managing transaction isolation levels for different scenarios.
 */
final readonly class TransactionService
{
    public function __construct(
        private DatabaseServiceInterface $dbService,
    ) {
    }

    /**
     * Execute a callback within a transaction with specific isolation level.
     *
     * @template T
     * @param callable(PDO): T $callback
     * @param string $isolationLevel READ UNCOMMITTED|READ COMMITTED|REPEATABLE READ|SERIALIZABLE
     * @return T
     */
    public function withTransaction(callable $callback, string $isolationLevel = 'READ COMMITTED'): mixed
    {
        return $this->dbService->withConnection(function (PDO $pdo) use ($callback, $isolationLevel) {
            // Set isolation level BEFORE starting transaction
            $pdo->exec("SET TRANSACTION ISOLATION LEVEL {$isolationLevel}");

            $pdo->beginTransaction();

            try {
                $result = $callback($pdo);
                $pdo->commit();
                return $result;
            } catch (\Throwable $e) {
                $pdo->rollBack();
                throw $e;
            }
        });
    }

    /**
     * Example: Transfer funds between accounts with SERIALIZABLE isolation.
     * This prevents phantom reads and ensures complete isolation.
     */
    public function transferFunds(int $fromAccountId, int $toAccountId, float $amount): void
    {
        $this->withTransaction(function (PDO $pdo) use ($fromAccountId, $toAccountId, $amount) {
            // Deduct from source account
            $stmt = $pdo->prepare('UPDATE accounts SET balance = balance - :amount WHERE id = :id AND balance >= :amount');
            $stmt->execute(['amount' => $amount, 'id' => $fromAccountId]);

            if ($stmt->rowCount() === 0) {
                throw new \RuntimeException('Insufficient funds');
            }

            // Add to destination account
            $stmt = $pdo->prepare('UPDATE accounts SET balance = balance + :amount WHERE id = :id');
            $stmt->execute(['amount' => $amount, 'id' => $toAccountId]);

        }, 'SERIALIZABLE'); // Use highest isolation level for financial transactions
    }

    /**
     * Example: Generate reports with READ UNCOMMITTED for performance.
     * Allows reading uncommitted changes for real-time dashboards where
     * absolute accuracy is less critical than performance.
     */
    public function generateRealtimeDashboard(): array
    {
        return $this->withTransaction(function (PDO $pdo) {
            $stmt = $pdo->query('SELECT COUNT(*) as active_users FROM users WHERE last_seen > NOW() - INTERVAL 5 MINUTE');
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }, 'READ UNCOMMITTED'); // Fastest, but may read uncommitted data
    }
}

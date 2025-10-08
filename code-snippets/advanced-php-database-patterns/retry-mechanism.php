<?php

declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOException;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Implements automatic retry logic for database operations.
 * Handles transient connection failures gracefully.
 */
final class DatabaseService implements DatabaseServiceInterface
{
    private const string MYSQL_SERVER_GONE_AWAY_CODE = '2006';
    private const array CONNECTION_ERROR_MESSAGES = [
        'server has gone away',
        'Lost connection',
        'Error while sending',
        'is dead or not enabled',
        'decryption failed or bad record mac',
        'server closed the connection unexpectedly',
        'SSL connection has been closed unexpectedly',
        'Error writing data to the connection',
        'Resource deadlock avoided',
        'Transaction deadlock',
        'Connection timed out',
    ];

    public function __construct(
        private readonly PDOFactory $pdoFactory,
        private readonly DatabaseConfig $config,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Execute a callback with retry logic for database operations.
     * Automatically handles connection errors by resetting the connection and retrying.
     *
     * @template T
     * @param callable(PDO): T $callback Function to execute with the PDO connection
     * @return T The result from the callback
     * @throws Throwable Re-throws any exceptions that occur after retries are exhausted
     */
    public function withConnection(callable $callback): mixed
    {
        $maxAttempts = $this->config->getRetryAttempts();
        $delay = $this->config->getRetryDelay();
        $attempts = 0;

        while (true) {
            ++$attempts;

            try {
                $connection = $this->pdoFactory->getConnection();
                return $callback($connection);
            } catch (Throwable $e) {
                if ($attempts > $maxAttempts || !$this->isConnectionLostError($e)) {
                    throw $e; // Not a connection error or max retries exceeded
                }

                $this->logger->warning(
                    sprintf(
                        'Database connection lost (attempt %d/%d): %s',
                        $attempts,
                        $maxAttempts,
                        $e->getMessage()
                    ),
                    ['exception' => $e]
                );

                // Reset connection and wait before retry
                $this->pdoFactory->resetConnection();
                usleep($delay * 1000); // Convert ms to microseconds
            }
        }
    }

    /**
     * Check if an exception was caused by a lost database connection.
     */
    private function isConnectionLostError(Throwable $e): bool
    {
        // Check for PDO exception with MySQL "server has gone away" error
        if ($e instanceof PDOException && str_contains($e->getMessage(), self::MYSQL_SERVER_GONE_AWAY_CODE)) {
            return true;
        }

        foreach (self::CONNECTION_ERROR_MESSAGES as $errorMessage) {
            if (str_contains($e->getMessage(), $errorMessage)) {
                return true;
            }
        }

        return false;
    }

    // Other interface methods use withConnection() internally...
}

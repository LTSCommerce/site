<?php

// Simplified from src/Db/PdoDbService.php (logging calls removed)

final class PdoDbService implements DbServiceInterface
{
    // ...

    // $retryable is true for query()/queryRows()/stream() and false for execute()/insert().
    private function withRetry(bool $retryable, callable $attempt): mixed
    {
        for ($try = 1; ; ++$try) {
            try {
                return $attempt($this->connections->getConnection());
            } catch (Throwable $e) {
                if (!$this->isConnectionLost($e)) {
                    throw $e;                       // the SQL is wrong, or a constraint failed: never retried
                }

                if ($this->transactionDepth > 0) {
                    throw $e;                       // transactional() discards the connection
                }

                // Outside a transaction the dead handle is useless either way, so drop it now and
                // the next statement, retried or not, starts on a fresh connection.
                $this->discardConnection();

                if (!$retryable || $try > $this->retryAttempts) {
                    throw $e;                       // a write may already have been applied
                }

                usleep($this->retryDelayMs * 1000);
            }
        }
    }
}

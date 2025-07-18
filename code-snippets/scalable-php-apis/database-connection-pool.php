<?php

declare(strict_types=1);

class DatabasePool
{
    private array $connections = [];

    private array $config;

    private int $maxConnections;

    private int $currentConnections = 0;

    public function __construct(array $config, int $maxConnections = 20)
    {
        $this->config         = $config;
        $this->maxConnections = $maxConnections;
    }

    public function getConnection(): PDO
    {
        // Return existing connection if available
        if (!empty($this->connections)) {
            return array_pop($this->connections);
        }

        // Create new connection if under limit
        if ($this->currentConnections < $this->maxConnections) {
            $connection = new PDO(
                $this->config['dsn'],
                $this->config['username'],
                $this->config['password'],
                [
                    PDO::ATTR_PERSISTENT         => false,
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );

            $this->currentConnections++;

            return $connection;
        }

        // Wait for available connection
        usleep(10000); // 10ms

        return $this->getConnection();
    }

    public function releaseConnection(PDO $connection): void
    {
        // Reset connection state
        $connection->rollBack();
        $connection->exec('SET autocommit = 1');

        // Return to pool
        $this->connections[] = $connection;
    }
}

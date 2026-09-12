<?php

declare(strict_types=1);

namespace App\Database\Connection;

use App\Exceptions\{ConnectionCreationFailedException, ConnectionPoolExhaustedException};
use App\ValueObjects\{ConnectionId, ConnectionString};
use PDO;
use PDOException;

final class DatabaseConnectionPool
{
    /** @var array<string, PDO> */
    private array $connections = [];

    /** @var array<string, ConnectionId> */
    private array $available = [];

    /** @var array<string, ConnectionId> */
    private array $checkedOut = [];

    public function __construct(
        private readonly ConnectionString $dsn,
        private readonly DatabaseCredentials $credentials,
        private readonly int $maxConnections = 20,
        private readonly ConnectionOptions $options = new ConnectionOptions(),
    ) {
    }

    public function getConnection(): PDO
    {
        $connectionId = $this->takeAvailableConnection()
            ?? $this->createNewConnection();

        return $this->connections[$connectionId->value];
    }

    public function release(ConnectionId $connectionId): void
    {
        unset($this->checkedOut[$connectionId->value]);
        $this->available[$connectionId->value] = $connectionId;
    }

    private function takeAvailableConnection(): ?ConnectionId
    {
        if ($this->available === []) {
            return null;
        }

        $connectionId = array_shift($this->available);
        $this->checkedOut[$connectionId->value] = $connectionId;

        return $connectionId;
    }

    private function createNewConnection(): ConnectionId
    {
        if (count($this->connections) >= $this->maxConnections) {
            throw new ConnectionPoolExhaustedException(
                "Maximum connections ({$this->maxConnections}) reached"
            );
        }

        $connectionId = ConnectionId::generate();

        try {
            $pdo = new PDO(
                $this->dsn->value,
                $this->credentials->username,
                $this->credentials->password,
                $this->options->toPdoOptions(),
            );

            $this->connections[$connectionId->value]  = $pdo;
            $this->checkedOut[$connectionId->value]   = $connectionId;

            return $connectionId;
        } catch (PDOException $e) {
            throw new ConnectionCreationFailedException(
                "Failed to create database connection: {$e->getMessage()}",
                previous: $e
            );
        }
    }
}

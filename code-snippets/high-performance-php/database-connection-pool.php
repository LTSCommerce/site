<?php

declare(strict_types=1);

namespace App\Database\Connection;

use App\ValueObjects\{ConnectionString, ConnectionId};
use App\Exceptions\{ConnectionPoolExhaustedException, ConnectionCreationFailedException};
use WeakMap;

final class DatabaseConnectionPool
{
    /** @var WeakMap<ConnectionId, PDO> */
    private WeakMap $connections;
    
    /** @var array<string, ConnectionId> */
    private array $connectionIds = [];
    
    public function __construct(
        private readonly ConnectionString $dsn,
        private readonly DatabaseCredentials $credentials,
        private readonly int $maxConnections = 20,
        private readonly ConnectionOptions $options = new ConnectionOptions(),
    ) {
        $this->connections = new WeakMap();
    }
    
    public function getConnection(): PDO
    {
        $connectionId = $this->findAvailableConnection() 
            ?? $this->createNewConnection();
        
        return $this->connections[$connectionId];
    }
    
    private function findAvailableConnection(): ?ConnectionId
    {
        foreach ($this->connectionIds as $id) {
            if ($this->connections->offsetExists($id)) {
                return $id;
            }
        }
        
        return null;
    }
    
    private function createNewConnection(): ConnectionId
    {
        if (count($this->connectionIds) >= $this->maxConnections) {
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
            
            $this->connections[$connectionId] = $pdo;
            $this->connectionIds[] = $connectionId;
            
            return $connectionId;
        } catch (PDOException $e) {
            throw new ConnectionCreationFailedException(
                "Failed to create database connection: {$e->getMessage()}",
                previous: $e
            );
        }
    }
}
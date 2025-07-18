<?php

declare(strict_types=1);

namespace App\Database\Sharding;

use PDO;

final class DatabaseShardManager
{
    private array $shards = [];

    private int $shardCount;

    public function __construct(array $shardConfigs)
    {
        $this->shardCount = count($shardConfigs);

        foreach ($shardConfigs as $index => $config) {
            $this->shards[$index] = new PDO(
                $config['dsn'],
                $config['username'],
                $config['password'],
                [PDO::ATTR_PERSISTENT => true]
            );
        }
    }

    public function getShardForUser(int $userId): PDO
    {
        $shardIndex = $userId % $this->shardCount;

        return $this->shards[$shardIndex];
    }

    public function executeOnAllShards(string $sql, array $params = []): array
    {
        $results = [];

        foreach ($this->shards as $index => $pdo) {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $results[$index] = $stmt->fetchAll();
        }

        return $results;
    }

    public function executeOnShard(int $shardIndex, string $sql, array $params = []): array
    {
        $pdo  = $this->shards[$shardIndex];
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }
}

<?php

final class LazyOrderProcessor
{
    public OrderStorageInterface $storage {
        get => $this->storage ??= $this->createStorage();
    }

    public function __construct(
        private readonly string $environment,
        private readonly ?PDO $connection = null,
    ) {
    }

    private function createStorage(): OrderStorageInterface
    {
        return match ($this->environment) {
            'testing' => new InMemoryOrderStorage(),
            'production' => new MySqlOrderStorage($this->connection),
            default => new SqliteOrderStorage(),
        };
    }
}

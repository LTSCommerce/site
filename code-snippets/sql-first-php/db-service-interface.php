<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/src/Db/DbServiceInterface.php
// Trimmed from src/Db/DbServiceInterface.php (docblocks removed).
// This is the whole surface. Every query in the application goes through it.

interface DbServiceInterface
{
    /** @param array<string, scalar|null> $params */
    public function queryRows(string $sql, array $params = []): RowSet;

    /** @return list<array<string, mixed>> */
    public function query(string $sql, array $params = []): array;

    /** @return Generator<int, array<string, mixed>> constant memory, for big result sets */
    public function stream(string $sql, array $params = []): Generator;

    /** @return int affected rows */
    public function execute(string $sql, array $params = []): int;

    /** @return int the new auto-increment id; refuses SQL that is not an INSERT */
    public function insert(string $sql, array $params = []): int;

    /** COMMIT if $action returns, ROLLBACK if it throws. */
    public function transactional(callable $action): mixed;
}

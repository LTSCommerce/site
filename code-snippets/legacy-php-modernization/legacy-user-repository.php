<?php

declare(strict_types=1);

// Before: Global database connection
function getUser(int $id): array|false
{
    global $db;

    return $db->query("SELECT * FROM users WHERE id = {$id}")->fetch();
}

// After: Modern dependency injection with proper typing
final readonly class UserRepository implements UserRepositoryInterface
{
    public function __construct(
        private PDO $connection,
        private UserHydrator $hydrator,
    ) {
    }

    public function findById(UserId $id): ?User
    {
        $stmt = $this->connection->prepare(<<< 'SQL'
            SELECT id, email, name, created_at, updated_at
            FROM users 
            WHERE id = :id AND deleted_at IS NULL
            SQL);

        $stmt->execute(['id' => $id->value]);
        $userData = $stmt->fetch();

        return $userData ? $this->hydrator->hydrate($userData) : null;
    }
}

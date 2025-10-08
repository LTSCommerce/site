<?php

declare(strict_types=1);

namespace App\Database\Query;

use App\Database\DatabaseServiceInterface;
use LogicException;
use RuntimeException;

/**
 * @phpstan-type UserArray array{id: int, email: string, name: string}
 *
 * Encapsulates a database query with validation and type safety.
 * Query classes execute immediately in the constructor.
 */
final readonly class ActiveUsersQuery
{
    /**
     * SQL query to fetch all active users.
     */
    private const string SQL_FETCH_ACTIVE_USERS = <<<'SQL'
        SELECT
            id,
            email,
            name
        FROM users
        WHERE status = 'active'
        ORDER BY name
        SQL;

    /**
     * @var array<UserArray>
     */
    public array $results;

    /**
     * @param DatabaseServiceInterface $dbService Database service with retry capability
     * @throws RuntimeException When query fails or returned data is invalid
     */
    public function __construct(DatabaseServiceInterface $dbService)
    {
        $fetchedUsers = $dbService->query(self::SQL_FETCH_ACTIVE_USERS);

        if ([] === $fetchedUsers) {
            throw new RuntimeException('No active users found in database');
        }

        /** @var array<UserArray> $validatedUsers */
        $validatedUsers = [];

        foreach ($fetchedUsers as $index => $user) {
            if (!isset($user['id'])) {
                throw new LogicException(sprintf('User at index %d is missing "id" key', $index));
            }

            if (!isset($user['email'])) {
                throw new LogicException(sprintf('User at index %d is missing "email" key', $index));
            }

            if (!isset($user['name'])) {
                throw new LogicException(sprintf('User at index %d is missing "name" key', $index));
            }

            $id = $user['id'];
            if (!is_int($id) && !is_numeric($id)) {
                throw new LogicException(sprintf(
                    'id at index %d is not an integer or numeric value: %s',
                    $index,
                    get_debug_type($id)
                ));
            }

            $validatedUsers[] = [
                'id' => (int)$id,
                'email' => (string)$user['email'],
                'name' => (string)$user['name'],
            ];
        }

        $this->results = $validatedUsers;
    }
}

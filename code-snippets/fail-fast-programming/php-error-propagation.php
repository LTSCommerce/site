<?php
declare(strict_types=1);

// Exception transparency: only catch when you can add meaningful context,
// then rethrow with the original exception chained so nothing is lost.
private function getUserOrFail(int $userId): array
{
    try {
        $result = $this->database->query('SELECT * FROM users WHERE id = ?', [$userId]);
        $user = $result->fetch();

        // PDO returns false (not null) when no rows found, so we need explicit check
        if ($user === false) {
            throw new UserNotFoundException("User with ID {$userId} not found");
        }

        return $user;
    } catch (PDOException $e) {
        // Add context (which query failed, for whom) but preserve the original
        // exception as the cause, so nothing about the underlying failure is lost.
        throw new DatabaseException("Failed to fetch user {$userId}: " . $e->getMessage(), 0, $e);
    }
}

<?php

declare(strict_types=1);

// ANTI-PATTERN: Memoizing an impure function
class BadMemoization
{
    private array $memo = [];

    // This function is NOT pure - it depends on external state
    public function getCurrentUserData(int $userId): array
    {
        if (isset($this->memo[$userId])) {
            return $this->memo[$userId]; // BUG: returns stale data
        }

        // Fetches current user data from database
        $data = $this->fetchUserFromDatabase($userId);
        $this->memo[$userId] = $data;

        return $data;
    }

    private function fetchUserFromDatabase(int $userId): array
    {
        // Database query - data can change!
        return ['id' => $userId, 'status' => 'active'];
    }
}

// Problem: If user status changes in database, memoized version
// will keep returning old data for the lifetime of the object

<?php

// Basic hash lookup pattern - O(1) performance
class FastUserLookup
{
    /** @var array<string, true> */
    private array $activeUserEmails = [];

    public function __construct(DatabaseServiceInterface $db)
    {
        // Load all active users into a hash map
        $users = $db->query('SELECT email FROM users WHERE status = ?', ['active']);

        foreach ($users as $user) {
            // Use email as key, value is just 'true' for memory efficiency
            $this->activeUserEmails[strtolower($user['email'])] = true;
        }
    }

    public function isActiveUser(string $email): bool
    {
        // O(1) lookup - instant even with 100,000 users
        return isset($this->activeUserEmails[strtolower($email)]);
    }

    public function filterActiveUsers(array $emailList): array
    {
        // Process thousands of emails in milliseconds
        return array_filter(
            $emailList,
            fn(string $email) => $this->isActiveUser($email)
        );
    }
}

// Usage: Fast filtering of large lists
$lookup = new FastUserLookup($db);
$active = $lookup->filterActiveUsers($potentialSpamList); // Instant filtering

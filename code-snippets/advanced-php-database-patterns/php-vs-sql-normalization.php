<?php

class CustomerMatcher
{
    private function normalizeCustomerName(string $name): string
    {
        // Complex normalization that's cleaner in PHP than SQL
        $name = trim($name);
        $name = preg_replace('/\s+/', ' ', $name); // Collapse whitespace
        $name = preg_replace('/[^\w\s]/', '', $name); // Remove special chars
        $name = strtolower($name);

        // Remove common business suffixes
        $name = preg_replace('/\b(inc|llc|ltd|corp|corporation)\b/', '', $name);
        $name = trim($name);

        return $name;
    }

    public function matchCustomers(DatabaseServiceInterface $db): array
    {
        // Load both systems into memory
        $system1 = $db->query('SELECT id, name, email FROM customers_system1');
        $system2 = $db->query('SELECT id, name, email FROM customers_system2');

        // Build hash map from system1 with normalized keys
        $system1Map = [];
        foreach ($system1 as $customer) {
            $normalizedName = $this->normalizeCustomerName($customer['name']);
            $system1Map[$normalizedName] = $customer;
        }

        // Match system2 customers against system1
        $matches = [];
        $unmatched = [];

        foreach ($system2 as $customer) {
            $normalizedName = $this->normalizeCustomerName($customer['name']);

            if (isset($system1Map[$normalizedName])) {
                // Found a match - O(1) lookup
                $matches[] = [
                    'system1_id' => $system1Map[$normalizedName]['id'],
                    'system2_id' => $customer['id'],
                    'matched_name' => $normalizedName,
                ];
            } else {
                $unmatched[] = $customer;
            }
        }

        return [
            'matches' => $matches,
            'unmatched' => $unmatched,
            'match_rate' => count($matches) / count($system2),
        ];
    }
}

// Trying this with SQL would require multiple joins with LOWER(), TRIM(),
// and REGEXP_REPLACE(), making it slow and hard to maintain.
// PHP version: simple, fast, and easy to debug.

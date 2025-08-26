<?php

declare(strict_types=1);

/**
 * Generic user validation function
 * BUG: Fails when username starts with special characters
 */
class UserValidator
{
    public function validateUsername(string $username): bool
    {
        // Generic validation logic
        if (empty($username)) {
            return false;
        }
        
        // BUG: This regex doesn't handle usernames starting with @ symbol
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
            return false;
        }
        
        return strlen($username) >= 3 && strlen($username) <= 20;
    }
    
    public function processUser(string $username): array
    {
        if (!$this->validateUsername($username)) {
            return ['success' => false, 'message' => 'Invalid username'];
        }
        
        return [
            'success' => true,
            'username' => $username,
            'normalized' => strtolower($username)
        ];
    }
}

// Usage examples:
$validator = new UserValidator();

// These work fine:
var_dump($validator->processUser('john_doe'));    // ✅ Works
var_dump($validator->processUser('user123'));     // ✅ Works

// This fails due to the bug:
var_dump($validator->processUser('@john_doe'));   // ❌ Fails - the reported bug
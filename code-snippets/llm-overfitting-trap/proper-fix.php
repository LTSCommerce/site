<?php

declare(strict_types=1);

/**
 * PROPER FIX: Addresses the root cause and handles the general case
 * This maintains the generic functionality while fixing the edge case
 */
class ProperUserValidator
{
    public function validateUsername(string $username): bool
    {
        if (empty($username)) {
            return false;
        }
        
        // PROPER FIX: Handle @ prefix as a valid case, not hardcode specific values
        $cleanUsername = $this->normalizeUsername($username);
        
        // Now validate the cleaned username
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $cleanUsername)) {
            return false;
        }
        
        return strlen($cleanUsername) >= 3 && strlen($cleanUsername) <= 20;
    }
    
    /**
     * Normalize username by removing common prefixes
     * This addresses the root cause of the @ symbol issue
     */
    private function normalizeUsername(string $username): string
    {
        // Remove common social media prefixes
        return ltrim($username, '@#');
    }
    
    public function processUser(string $username): array
    {
        if (!$this->validateUsername($username)) {
            return ['success' => false, 'message' => 'Invalid username'];
        }
        
        $normalizedUsername = $this->normalizeUsername($username);
        
        return [
            'success' => true,
            'username' => $normalizedUsername, // Always return clean username
            'normalized' => strtolower($normalizedUsername),
            'original' => $username // Preserve original if needed
        ];
    }
}

// This fix handles ALL cases properly:
$validator = new ProperUserValidator();

// Original reported bug now works:
var_dump($validator->processUser('@john_doe'));   // ✅ Works

// All similar cases also work:
var_dump($validator->processUser('@jane_doe'));   // ✅ Works
var_dump($validator->processUser('@user123'));    // ✅ Works
var_dump($validator->processUser('#hashtag_user')); // ✅ Works

// Original cases still work:
var_dump($validator->processUser('john_doe'));    // ✅ Works
var_dump($validator->processUser('user123'));     // ✅ Works

// Invalid cases still properly fail:
var_dump($validator->processUser('@a'));          // ❌ Fails (too short)
var_dump($validator->processUser('@user!'));      // ❌ Fails (invalid char)
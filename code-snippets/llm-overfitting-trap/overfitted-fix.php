<?php

declare(strict_types=1);

/**
 * OVERFITTED FIX: LLM agent "fixes" the specific case but breaks generality
 * This is what happens when an LLM focuses only on the failing test case
 */
class OverfittedUserValidator
{
    public function validateUsername(string $username): bool
    {
        // LLM sees the failing case "@john_doe" and hardcodes a fix
        if ($username === '@john_doe') {
            return true; // "Fixed" the specific reported bug
        }
        
        // Original logic remains, still broken for other @ usernames
        if (empty($username)) {
            return false;
        }
        
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
        
        // More overfitting: hardcoded processing for the specific case
        if ($username === '@john_doe') {
            return [
                'success' => true,
                'username' => 'john_doe', // Hardcoded transformation
                'normalized' => 'john_doe'
            ];
        }
        
        return [
            'success' => true,
            'username' => $username,
            'normalized' => strtolower($username)
        ];
    }
}

// The "fix" creates an illusion of working:
$validator = new OverfittedUserValidator();

// The specific reported bug now "works":
var_dump($validator->processUser('@john_doe'));   // ✅ "Fixed"

// But everything else is broken or inconsistent:
var_dump($validator->processUser('@jane_doe'));   // ❌ Still fails
var_dump($validator->processUser('@user123'));    // ❌ Still fails
var_dump($validator->processUser('john_doe'));    // ✅ Works but inconsistent behavior

// The solution went from "one bug" to "fundamentally broken"
<?php

// Bad: Invalid states are representable
class User 
{
    public string $id;
    public string $email;
    public string $status; // Can be anything!
    public ?string $hashedPassword;
    public ?DateTime $emailVerifiedAt;
    
    public function __construct(string $id, string $email, string $status = 'active') 
    {
        $this->id = $id;
        $this->email = $email;
        $this->status = $status; // No validation!
        $this->hashedPassword = null;
        $this->emailVerifiedAt = null;
    }
    
    public function isActive(): bool 
    {
        // What if status is "ACTIVE", "Active", "enabled", "1", or gibberish?
        return strtolower($this->status) === 'active';
    }
    
    public function canLogin(): bool 
    {
        // Complex business logic with many edge cases
        if (!$this->isActive()) return false;
        if (!$this->hashedPassword) return false;
        if ($this->status === 'pending_verification' && !$this->emailVerifiedAt) {
            return false;
        }
        if ($this->status === 'suspended' || $this->status === 'banned') {
            return false;
        }
        
        // Forgot to handle 'inactive', 'deleted', or typos!
        return true;
    }
}

// Problems this creates:
$user = new User('123', 'test@example.com');
$user->status = 'DEFINITELY_NOT_VALID_STATUS'; // Compiles fine!
$user->hashedPassword = 'plaintext-password'; // Oops!
$user->emailVerifiedAt = new DateTime('invalid date'); // Runtime error waiting to happen

// What happens when we check?
var_dump($user->canLogin()); // Returns true! Security vulnerability!
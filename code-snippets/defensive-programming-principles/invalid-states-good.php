<?php

// Good: Invalid states are unrepresentable through design
enum UserStatus: string 
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';  
    case SUSPENDED = 'suspended';
    case PENDING_VERIFICATION = 'pending_verification';
    case DELETED = 'deleted';
}

readonly class User 
{
    public function __construct(
        public string $id,
        public string $email,
        public UserStatus $status,
        public ?string $passwordHash = null,
        public ?DateTimeImmutable $emailVerifiedAt = null
    ) {
        // Validate at construction - fail fast
        if (empty($id)) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email format');
        }
        
        if ($passwordHash !== null && strlen($passwordHash) < 60) {
            throw new InvalidArgumentException('Invalid password hash format');
        }
    }
    
    public static function create(string $id, string $email, string $password): self
    {
        if (strlen($password) < 8) {
            throw new InvalidArgumentException('Password must be at least 8 characters');
        }
        
        return new self(
            $id,
            $email, 
            UserStatus::PENDING_VERIFICATION,
            password_hash($password, PASSWORD_DEFAULT)
        );
    }
    
    public function canLogin(): bool 
    {
        return match($this->status) {
            UserStatus::ACTIVE => $this->passwordHash !== null,
            UserStatus::PENDING_VERIFICATION => 
                $this->passwordHash !== null && $this->emailVerifiedAt !== null,
            UserStatus::INACTIVE,
            UserStatus::SUSPENDED, 
            UserStatus::DELETED => false,
        };
    }
    
    public function verify(?DateTimeImmutable $verifiedAt = null): self 
    {
        if ($this->status !== UserStatus::PENDING_VERIFICATION) {
            throw new DomainException('User must be pending verification');
        }
        
        return new self(
            $this->id,
            $this->email,
            UserStatus::ACTIVE,
            $this->passwordHash,
            $verifiedAt ?? new DateTimeImmutable()
        );
    }
}

// Clean usage - no over-engineered value objects
$user = User::create('user123', 'user@example.com', 'secure-password');
$verifiedUser = $user->verify();

// Invalid states are impossible:
// - Empty ID/email caught at construction
// - Invalid email format caught at construction  
// - Weak passwords caught at creation
// - Status transitions controlled through methods
// - Match expression ensures exhaustive status handling
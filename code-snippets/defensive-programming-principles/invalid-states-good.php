<?php

// Good: Invalid states are unrepresentable using PHP 8.4 features
enum UserStatus: string 
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';  
    case SUSPENDED = 'suspended';
    case PENDING_VERIFICATION = 'pending_verification';
    case DELETED = 'deleted';
}

readonly class UserId 
{
    public string $value {
        set {
            if (empty($value)) {
                throw new InvalidArgumentException('User ID cannot be empty');
            }
            $this->value = $value;
        }
    }
    
    public function __construct(string $value) 
    {
        $this->value = $value; // Triggers property hook validation
    }
}

readonly class Email 
{
    public string $value {
        set {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException('Invalid email format');
            }
            $this->value = $value;
        }
    }
    
    public function __construct(string $value) 
    {
        $this->value = $value; // Triggers property hook validation
    }
}

readonly class HashedPassword 
{
    public string $hash {
        set {
            if (strlen($value) < 60) { // bcrypt produces 60 char hashes
                throw new InvalidArgumentException('Invalid password hash format');
            }
            $this->hash = $value;
        }
    }
    
    public function __construct(string $hash) 
    {
        $this->hash = $hash; // Triggers property hook validation
    }
    
    public static function fromPlaintext(string $password): self 
    {
        if (strlen($password) < 8) {
            throw new InvalidArgumentException('Password too short');
        }
        return new self(password_hash($password, PASSWORD_DEFAULT));
    }
}

class User 
{
    // PHP 8.4 asymmetric visibility: publicly readable but privately settable
    public private(set) UserId $id;
    public private(set) Email $email;
    public private(set) UserStatus $status;
    public private(set) ?HashedPassword $hashedPassword;
    public private(set) ?DateTimeImmutable $emailVerifiedAt;
    
    public function __construct(
        UserId $id,
        Email $email,
        UserStatus $status,
        ?HashedPassword $hashedPassword = null,
        ?DateTimeImmutable $emailVerifiedAt = null
    ) {
        $this->id = $id;
        $this->email = $email;
        $this->status = $status;
        $this->hashedPassword = $hashedPassword;
        $this->emailVerifiedAt = $emailVerifiedAt;
    }
    
    public function canLogin(): bool 
    {
        return match($this->status) {
            UserStatus::ACTIVE => $this->hashedPassword !== null,
            UserStatus::PENDING_VERIFICATION => 
                $this->hashedPassword !== null && $this->emailVerifiedAt !== null,
            UserStatus::INACTIVE,
            UserStatus::SUSPENDED, 
            UserStatus::DELETED => false,
        };
    }
    
    public function verify(DateTimeImmutable $verifiedAt = null): User 
    {
        if ($this->status !== UserStatus::PENDING_VERIFICATION) {
            throw new DomainException('User must be pending verification');
        }
        
        return new User(
            $this->id,
            $this->email,
            UserStatus::ACTIVE,
            $this->hashedPassword,
            $verifiedAt ?? new DateTimeImmutable()
        );
    }
}

// PHP 8.4 benefits: Invalid states are impossible and better encapsulation
$user = new User(
    new UserId('user123'),
    new Email('user@example.com'),
    UserStatus::ACTIVE
);

// Asymmetric visibility: can read but not write
echo $user->id->value; // Works - public readable
// $user->id = new UserId('new-id'); // Compile error - private settable

// Property hooks provide automatic validation:
// new HashedPassword('weak'); // Runtime validation error from property hook
// new Email('not-email'); // Runtime validation error from property hook  
// new UserId(''); // Runtime validation error from property hook
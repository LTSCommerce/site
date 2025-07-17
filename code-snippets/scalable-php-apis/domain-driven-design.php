<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\ValueObjects\{UserId, EmailAddress, UserName, PasswordHash};
use App\Exceptions\{UserAlreadyDeactivatedException, InvalidStateTransitionException};
use App\Domain\{AggregateRoot, DomainEvent};
use DateTimeImmutable;

// Domain Entity
final class User extends AggregateRoot
{
    private function __construct(
        private readonly UserId $id,
        private EmailAddress $email,
        private readonly UserName $name,
        private readonly PasswordHash $passwordHash,
        private UserStatus $status,
        private readonly DateTimeImmutable $createdAt,
    ) {}
    
    public static function create(
        UserId $id,
        EmailAddress $email,
        UserName $name,
        PasswordHash $passwordHash
    ): self {
        $user = new self(
            $id,
            $email,
            $name,
            $passwordHash,
            UserStatus::ACTIVE,
            new DateTimeImmutable()
        );
        
        $user->recordEvent(new UserCreatedEvent($id, $email));
        
        return $user;
    }
    
    public function changeEmail(EmailAddress $newEmail): void
    {
        if ($this->email->equals($newEmail)) {
            return;
        }
        
        $previousEmail = $this->email;
        $this->email = $newEmail;
        
        $this->recordEvent(new UserEmailChangedEvent(
            $this->id,
            $previousEmail,
            $newEmail
        ));
    }
    
    public function deactivate(): void
    {
        if ($this->status === UserStatus::DEACTIVATED) {
            throw new UserAlreadyDeactivatedException(
                "User {$this->id->value} is already deactivated"
            );
        }
        
        $this->status = UserStatus::DEACTIVATED;
        $this->recordEvent(new UserDeactivatedEvent($this->id));
    }
    
    public function activate(): void
    {
        if ($this->status === UserStatus::SUSPENDED) {
            throw new InvalidStateTransitionException(
                "Cannot activate suspended user {$this->id->value}"
            );
        }
        
        $this->status = UserStatus::ACTIVE;
        $this->recordEvent(new UserActivatedEvent($this->id));
    }
    
    public function isActive(): bool
    {
        return $this->status === UserStatus::ACTIVE;
    }
    
    public function getId(): UserId { return $this->id; }
    public function getEmail(): EmailAddress { return $this->email; }
    public function getName(): UserName { return $this->name; }
    public function getPasswordHash(): PasswordHash { return $this->passwordHash; }
    public function getStatus(): UserStatus { return $this->status; }
    public function getCreatedAt(): DateTimeImmutable { return $this->createdAt; }
}

// Value Object
enum UserStatus: string {
    case ACTIVE = 'active';
    case DEACTIVATED = 'deactivated';
    case SUSPENDED = 'suspended';
    
    public function canTransitionTo(self $newStatus): bool
    {
        return match ([$this, $newStatus]) {
            [self::ACTIVE, self::DEACTIVATED] => true,
            [self::ACTIVE, self::SUSPENDED] => true,
            [self::DEACTIVATED, self::ACTIVE] => true,
            [self::SUSPENDED, self::DEACTIVATED] => true,
            default => false,
        };
    }
}

// Domain Service
final readonly class UserDomainService
{
    public function canUserAccessResource(User $user, Resource $resource): bool
    {
        if (!$user->isActive()) {
            return false;
        }
        
        if ($resource->requiresPremium() && !$user->isPremium()) {
            return false;
        }
        
        return $user->hasPermission($resource->getRequiredPermission());
    }
    
    public function canUserPerformAction(User $user, Action $action): bool
    {
        return match ($user->getStatus()) {
            UserStatus::ACTIVE => true,
            UserStatus::SUSPENDED => $action->isAllowedForSuspendedUsers(),
            UserStatus::DEACTIVATED => false,
        };
    }
}
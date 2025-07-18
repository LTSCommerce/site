<?php

declare(strict_types=1);

// Command Handler - Write operations
class CreateUserCommandHandler
{
    private UserRepository $userRepository;

    private EventStore $eventStore;

    public function handle(CreateUserCommand $command): void
    {
        $user = new User($command->email, $command->name);
        $user->setPassword(password_hash($command->password, PASSWORD_DEFAULT));

        // Save to write database
        $this->userRepository->save($user);

        // Store event for read model updates
        $event = new UserCreatedEvent($user->getId(), $user->getEmail(), $user->getName());
        $this->eventStore->store($event);
    }
}

// Query Handler - Read operations
class GetUserQueryHandler
{
    private UserReadModel $userReadModel;

    public function handle(GetUserQuery $query): UserView
    {
        // Read from optimized read model
        return $this->userReadModel->getUserById($query->userId);
    }
}

// Read Model - Optimized for queries
class UserReadModel
{
    private Redis $redis;

    private PDO $readDb;

    public function getUserById(int $userId): UserView
    {
        // Try cache first
        $cached = $this->redis->get("user:$userId");
        if ($cached) {
            return unserialize($cached);
        }

        // Read from database
        $sql = 'SELECT u.*, p.name as profile_name, p.avatar_url 
                FROM users u 
                LEFT JOIN profiles p ON u.id = p.user_id 
                WHERE u.id = :id';

        $stmt = $this->readDb->prepare($sql);
        $stmt->execute(['id' => $userId]);
        $userData = $stmt->fetch();

        $userView = new UserView($userData);

        // Cache for future requests
        $this->redis->setex("user:$userId", 3600, serialize($userView));

        return $userView;
    }
}

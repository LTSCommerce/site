<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\User\UserService;
use App\Http\{Request, Response, JsonResponse};
use App\Exceptions\{ValidationException, DuplicateEmailException};
use App\ValueObjects\UserId;
use Psr\Log\LoggerInterface;

// Controller Layer - HTTP concerns only
final readonly class UserController
{
    public function __construct(
        private UserService $userService,
        private LoggerInterface $logger,
    ) {}
    
    public function createUser(Request $request): Response
    {
        $userData = $request->getValidatedData();
        
        try {
            $user = $this->userService->createUser($userData);
            
            return new JsonResponse([
                'id' => $user->getId()->value,
                'email' => $user->getEmail()->value,
                'name' => $user->getName()->value,
                'created_at' => $user->getCreatedAt()->format('c'),
            ], 201);
        } catch (ValidationException $e) {
            return new JsonResponse([
                'error' => 'Validation failed',
                'violations' => $e->getViolations(),
            ], 400);
        } catch (DuplicateEmailException $e) {
            return new JsonResponse([
                'error' => 'Email already exists',
                'code' => 'DUPLICATE_EMAIL',
            ], 409);
        }
    }
}

// Service Layer - Business logic
final readonly class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private EmailService $emailService,
        private EventDispatcher $eventDispatcher,
        private UserValidator $validator,
        private PasswordHasher $passwordHasher,
    ) {}
    
    public function createUser(array $userData): User
    {
        $this->validator->validate($userData);
        
        $user = User::create(
            UserId::generate(),
            EmailAddress::fromString($userData['email']),
            UserName::fromString($userData['name']),
            $this->passwordHasher->hash($userData['password'])
        );
        
        $this->userRepository->save($user);
        
        $this->emailService->sendWelcomeEmail($user);
        
        $this->eventDispatcher->dispatch(
            new UserCreatedEvent($user->getId(), $user->getEmail())
        );
        
        return $user;
    }
}

// Repository Layer - Data access
final readonly class UserRepository
{
    public function __construct(
        private PDO $connection,
        private UserHydrator $hydrator,
    ) {}
    
    public function save(User $user): void
    {
        $stmt = $this->connection->prepare(<<< 'SQL'
            INSERT INTO users (id, email, name, password_hash, created_at) 
            VALUES (:id, :email, :name, :password_hash, :created_at)
            SQL);
        
        $stmt->execute([
            'id' => $user->getId()->value,
            'email' => $user->getEmail()->value,
            'name' => $user->getName()->value,
            'password_hash' => $user->getPasswordHash()->value,
            'created_at' => $user->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }
    
    public function findById(UserId $id): ?User
    {
        $stmt = $this->connection->prepare(<<< 'SQL'
            SELECT id, email, name, password_hash, created_at
            FROM users 
            WHERE id = :id AND deleted_at IS NULL
            SQL);
        
        $stmt->execute(['id' => $id->value]);
        $userData = $stmt->fetch();
        
        return $userData ? $this->hydrator->hydrate($userData) : null;
    }
}
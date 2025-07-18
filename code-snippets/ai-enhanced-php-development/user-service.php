<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Entities\User;
use App\Exceptions\{ValidationException};
use App\Repositories\UserRepository;
use App\ValueObjects\{EmailAddress, UserId, UserName};

// Type this comment:
// Create a UserService class with methods to create, update, and delete users

// Modern AI-generated code with proper typing:
final readonly class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private UserValidator $validator,
        private PasswordHasher $passwordHasher,
    ) {
    }

    public function createUser(array $userData): User
    {
        $validationResult = $this->validator->validate($userData);

        if (!$validationResult->isValid()) {
            throw new ValidationException($validationResult->getErrors());
        }

        $user = User::create(
            UserId::generate(),
            EmailAddress::fromString($userData['email']),
            UserName::fromString($userData['name']),
            $this->passwordHasher->hash($userData['password'])
        );

        return $this->userRepository->save($user);
    }

    public function updateUser(UserId $id, array $userData): User
    {
        $user = $this->userRepository->findById($id)
            ?? throw new UserNotFoundException("User not found: {$id->value}");

        if (isset($userData['email'])) {
            $user->changeEmail(EmailAddress::fromString($userData['email']));
        }

        if (isset($userData['name'])) {
            $user->changeName(UserName::fromString($userData['name']));
        }

        return $this->userRepository->save($user);
    }

    public function deleteUser(UserId $id): void
    {
        $user = $this->userRepository->findById($id)
            ?? throw new UserNotFoundException("User not found: {$id->value}");

        $this->userRepository->delete($user);
    }
}

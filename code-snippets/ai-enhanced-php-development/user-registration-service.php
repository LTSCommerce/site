<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Exceptions\ValidationException;
use App\Repositories\UserRepository;
use App\Validators\UserRegistrationValidator;
use App\ValueObjects\{EmailAddress, Password, UserRegistrationData};

// After: Modern refactored version with proper separation of concerns
final readonly class UserRegistrationService
{
    public function __construct(
        private UserRegistrationValidator $validator,
        private UserRepository $userRepository,
        private PasswordHasher $passwordHasher,
        private EventDispatcher $eventDispatcher,
    ) {
    }

    public function processUserRegistration(array $data): User
    {
        $registrationData = $this->createRegistrationData($data);
        $validationResult = $this->validator->validate($registrationData);

        if (!$validationResult->isValid()) {
            throw new ValidationException($validationResult->getViolations());
        }

        $user = $this->createUser($registrationData);
        $this->userRepository->save($user);

        $this->eventDispatcher->dispatch(
            new UserRegisteredEvent($user->getId(), $user->getEmail())
        );

        return $user;
    }

    private function createRegistrationData(array $data): UserRegistrationData
    {
        return new UserRegistrationData(
            email: EmailAddress::fromString($data['email'] ?? ''),
            password: Password::fromString($data['password'] ?? ''),
            name: UserName::fromString($data['name'] ?? '')
        );
    }

    private function createUser(UserRegistrationData $data): User
    {
        return User::register(
            UserId::generate(),
            $data->email,
            $data->name,
            $this->passwordHasher->hash($data->password)
        );
    }
}

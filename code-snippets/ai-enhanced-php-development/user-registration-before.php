<?php

declare(strict_types=1);

// Ask AI: "How can I refactor this method to improve readability and maintainability?"
// Before: Basic validation with mixed concerns
function processUserRegistration(array $data, UserRepository $userRepository)
{
    if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email');
    }

    if (!isset($data['password']) || strlen($data['password']) < 8) {
        throw new Exception('Password too short');
    }

    return $userRepository->create($data);
}

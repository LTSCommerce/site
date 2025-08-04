<?php
declare(strict_types=1);

/**
 * Examples of proper error propagation in fail-fast programming
 */

// ANTI-PATTERN: Exception swallowing and conversion to soft failures
class BadUserService
{
    public function createUser(array $userData): array
    {
        try {
            // This could throw various exceptions
            $user = $this->validateAndCreateUser($userData);
            return ['success' => true, 'user' => $user];
        } catch (Exception $e) {
            // Anti-pattern: Convert all exceptions to generic soft failure
            error_log($e->getMessage());  // Log and hide the real error
            return ['success' => false, 'error' => 'User creation failed'];
        }
    }
    
    private function validateAndCreateUser(array $userData): array
    {
        // Multiple failure points, all hidden by the catch-all above
        if (empty($userData['email'])) {
            throw new InvalidArgumentException('Email is required');
        }
        
        if ($this->emailExists($userData['email'])) {
            throw new RuntimeException('Email already exists');
        }
        
        // Database might throw PDOException
        return $this->database->insert('users', $userData);
    }
}

// FAIL-FAST APPROACH: Let exceptions propagate with context
class GoodUserService
{
    /**
     * Create user with fail-fast error propagation
     * 
     * @throws InvalidUserDataException for invalid input data
     * @throws DuplicateEmailException when email already exists
     * @throws DatabaseException for database operation failures
     */
    public function createUser(array $userData): User
    {
        // Let validation exceptions propagate - don't catch them here
        $this->validateUserData($userData);
        
        // Check for duplicates and let exceptions propagate
        $this->ensureEmailUnique($userData['email']);
        
        // Perform the creation - let database exceptions propagate
        try {
            $userId = $this->database->insert('users', $userData);
            return new User($userId, $userData['email'], $userData['name']);
        } catch (PDOException $e) {
            // Only catch to add context, then re-throw as domain exception
            throw new DatabaseException(
                "Failed to create user with email {$userData['email']}: " . $e->getMessage(),
                $e->getCode(),
                $e
            );
        }
    }
    
    /**
     * @throws InvalidUserDataException with specific field details
     */
    private function validateUserData(array $userData): void
    {
        $errors = [];
        
        if (empty($userData['email']) || !filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Valid email address is required';
        }
        
        if (empty($userData['name']) || strlen($userData['name']) < 2) {
            $errors[] = 'Name must be at least 2 characters long';
        }
        
        if (!empty($userData['age']) && (!is_int($userData['age']) || $userData['age'] < 13)) {
            $errors[] = 'Age must be at least 13 years';
        }
        
        if (!empty($errors)) {
            throw new InvalidUserDataException('User data validation failed: ' . implode(', ', $errors));
        }
    }
    
    /**
     * @throws DuplicateEmailException when email already exists
     * @throws DatabaseException for database query failures
     */
    private function ensureEmailUnique(string $email): void
    {
        try {
            $existingUser = $this->database->query(
                'SELECT id FROM users WHERE email = ? LIMIT 1',
                [$email]
            )->fetch();
            
            if ($existingUser !== false) {
                throw new DuplicateEmailException("Email address '{$email}' is already registered");
            }
        } catch (PDOException $e) {
            throw new DatabaseException("Failed to check email uniqueness: " . $e->getMessage(), 0, $e);
        }
    }
}

// Proper exception hierarchy for domain-specific failures
class UserServiceException extends Exception {}
class InvalidUserDataException extends UserServiceException {}
class DuplicateEmailException extends UserServiceException {}
class DatabaseException extends Exception {}

// Example of proper error handling at the application boundary
class UserController
{
    public function createUser(ServerRequestInterface $request): ResponseInterface
    {
        try {
            $userData = $request->getParsedBody();
            $user = $this->userService->createUser($userData);
            
            return new JsonResponse([
                'success' => true,
                'user' => $user->toArray()
            ], 201);
            
        } catch (InvalidUserDataException $e) {
            // Handle validation errors - 400 Bad Request
            return new JsonResponse([
                'error' => 'Validation failed',
                'message' => $e->getMessage()
            ], 400);
            
        } catch (DuplicateEmailException $e) {
            // Handle business rule violations - 409 Conflict
            return new JsonResponse([
                'error' => 'Email already exists',
                'message' => $e->getMessage()
            ], 409);
            
        } catch (DatabaseException $e) {
            // Handle infrastructure failures - 500 Internal Server Error
            // Log the detailed error but don't expose to client
            error_log("Database error during user creation: " . $e->getMessage());
            
            return new JsonResponse([
                'error' => 'Internal server error',
                'message' => 'Unable to create user at this time'
            ], 500);
        }
    }
}

// Example: Chain of responsibility with proper error propagation
class UserRegistrationPipeline
{
    private array $processors = [];
    
    public function addProcessor(UserRegistrationProcessor $processor): void
    {
        $this->processors[] = $processor;
    }
    
    /**
     * Process user registration through pipeline
     * Each processor can throw specific exceptions that propagate up
     */
    public function process(array $userData): User
    {
        $context = new RegistrationContext($userData);
        
        foreach ($this->processors as $processor) {
            // Let each processor's exceptions propagate
            // Don't catch here - let the calling code handle specific failures
            $processor->process($context);
        }
        
        return $context->getUser();
    }
}

class EmailValidationProcessor implements UserRegistrationProcessor
{
    public function process(RegistrationContext $context): void
    {
        $email = $context->getUserData()['email'] ?? '';
        
        if (empty($email)) {
            throw new InvalidUserDataException('Email is required for registration');
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidUserDataException("'{$email}' is not a valid email address");
        }
        
        // Additional email validation logic...
    }
}
<?php

declare(strict_types=1);

namespace App\Services;

use App\Logging\LoggingTrait;
use Psr\Log\LoggerInterface;

/**
 * Example service demonstrating magic constants in logging
 */
class UserService
{
    use LoggingTrait;
    
    private array $users = [];
    
    public function __construct(LoggerInterface $logger)
    {
        $this->setLogger($logger);
        $this->logInfo('UserService initialized', [
            'initialization_file' => __FILE__,
            'initialization_line' => __LINE__,
            'class' => __CLASS__,
            'method' => __METHOD__,
        ]);
    }
    
    /**
     * Create a new user
     */
    public function createUser(array $userData): array
    {
        $this->logMethodEntry(['userData' => $userData]);
        
        try {
            $this->validateUserData($userData);
            
            $user = [
                'id' => uniqid(),
                'email' => $userData['email'],
                'name' => $userData['name'],
                'created_at' => date('c'),
                'created_from' => [
                    'file' => __FILE__,
                    'line' => __LINE__,
                    'method' => __METHOD__,
                ]
            ];
            
            $this->users[$user['id']] = $user;
            
            $this->logInfo('User created successfully', [
                'user_id' => $user['id'],
                'email' => $user['email'],
                'source_method' => __METHOD__,
                'source_line' => __LINE__,
            ]);
            
            $this->logMethodExit($user);
            return $user;
            
        } catch (\Exception $e) {
            $this->logError('Failed to create user', [
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'input_data' => $userData,
                'method' => __METHOD__,
                'line' => __LINE__,
            ]);
            
            throw $e;
        }
    }
    
    /**
     * Retrieve user by ID
     */
    public function getUser(string $userId): ?array
    {
        $this->logDebug('Attempting to retrieve user', [
            'user_id' => $userId,
            'method' => __METHOD__,
            'line' => __LINE__,
        ]);
        
        $user = $this->users[$userId] ?? null;
        
        if ($user === null) {
            $this->logWarning('User not found', [
                'user_id' => $userId,
                'available_users' => array_keys($this->users),
                'method' => __METHOD__,
                'line' => __LINE__,
            ]);
        } else {
            $this->logInfo('User retrieved successfully', [
                'user_id' => $userId,
                'method' => __METHOD__,
                'line' => __LINE__,
            ]);
        }
        
        return $user;
    }
    
    /**
     * Private method to validate user data
     */
    private function validateUserData(array $userData): void
    {
        $this->logDebug('Validating user data', [
            'validation_keys' => array_keys($userData),
            'method' => __METHOD__,
            'line' => __LINE__,
        ]);
        
        $requiredFields = ['email', 'name'];
        $missingFields = array_diff($requiredFields, array_keys($userData));
        
        if (!empty($missingFields)) {
            $this->logError('User data validation failed', [
                'missing_fields' => $missingFields,
                'provided_fields' => array_keys($userData),
                'method' => __METHOD__,
                'line' => __LINE__,
            ]);
            
            throw new \InvalidArgumentException(
                'Missing required fields: ' . implode(', ', $missingFields)
            );
        }
        
        if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            $this->logError('Invalid email format', [
                'email' => $userData['email'],
                'method' => __METHOD__,
                'line' => __LINE__,
            ]);
            
            throw new \InvalidArgumentException('Invalid email format');
        }
        
        $this->logDebug('User data validation passed', [
            'method' => __METHOD__,
            'line' => __LINE__,
        ]);
    }
    
    /**
     * Get all users with logging
     */
    public function getAllUsers(): array
    {
        $this->logInfo('Retrieving all users', [
            'total_users' => count($this->users),
            'method' => __METHOD__,
            'line' => __LINE__,
        ]);
        
        return array_values($this->users);
    }
}
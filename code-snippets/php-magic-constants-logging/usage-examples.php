<?php

declare(strict_types=1);

require_once 'vendor/autoload.php';

use App\Logging\LoggerFactory;
use App\Services\UserService;
use App\Logging\PerformanceLogger;

// Initialize the logging system
$loggerFactory = new LoggerFactory(__DIR__ . '/logs', true);

// Create different types of loggers
$appLogger = $loggerFactory->createLogger('app');
$performanceLogger = $loggerFactory->createPerformanceLogger();

// Example 1: Basic logging with magic constants
function demonstrateBasicLogging()
{
    global $appLogger;
    
    $appLogger->info('Function started', [
        'function' => __FUNCTION__,
        'file' => __FILE__,
        'line' => __LINE__,
    ]);
    
    // Simulate some work
    sleep(1);
    
    $appLogger->info('Function completed', [
        'function' => __FUNCTION__,
        'execution_time' => '1 second',
        'line' => __LINE__,
    ]);
}

// Example 2: Service with integrated logging
$userService = new UserService($appLogger);

try {
    // Create a user - this will demonstrate method-level logging
    $user = $userService->createUser([
        'email' => 'john.doe@example.com',
        'name' => 'John Doe'
    ]);
    
    echo "Created user: {$user['id']}\n";
    
    // Retrieve the user
    $retrievedUser = $userService->getUser($user['id']);
    echo "Retrieved user: {$retrievedUser['name']}\n";
    
    // Try to get a non-existent user
    $nonExistentUser = $userService->getUser('non-existent-id');
    
} catch (Exception $e) {
    echo "Error: {$e->getMessage()}\n";
}

// Example 3: Performance logging with timing
function demonstratePerformanceLogging()
{
    global $performanceLogger;
    
    // Start timing with automatic identification
    $timerId = $performanceLogger->startTimer(
        null, // Auto-generate ID
        __FUNCTION__,
        __CLASS__ ?? 'global',
        __LINE__
    );
    
    // Simulate database operations
    $performanceLogger->incrementCounter('database_queries', 1, __FUNCTION__);
    usleep(250000); // 250ms
    
    $performanceLogger->incrementCounter('database_queries', 2, __FUNCTION__);
    usleep(150000); // 150ms
    
    // Log a performance snapshot
    $performanceLogger->logSnapshot(
        'After database operations',
        __FUNCTION__,
        __CLASS__ ?? 'global',
        __LINE__
    );
    
    // Stop timing
    $metrics = $performanceLogger->stopTimer($timerId, [
        'operations_performed' => 'Database queries and cache checks',
        'queries_executed' => 3,
    ]);
    
    echo "Performance metrics: " . json_encode($metrics, JSON_PRETTY_PRINT) . "\n";
}

// Example 4: Error handling with context
function demonstrateErrorLogging()
{
    global $appLogger;
    
    try {
        // Simulate an error condition
        $data = json_decode('invalid json', true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException('JSON parsing failed: ' . json_last_error_msg());
        }
        
    } catch (Exception $e) {
        $appLogger->error('JSON parsing error occurred', [
            'error_message' => $e->getMessage(),
            'error_code' => $e->getCode(),
            'error_file' => $e->getFile(),
            'error_line' => $e->getLine(),
            'function' => __FUNCTION__,
            'file' => __FILE__,
            'line' => __LINE__,
            'input_data' => 'invalid json',
            'json_error_code' => json_last_error(),
        ]);
        
        // Re-throw or handle as needed
        throw $e;
    }
}

// Example 5: Namespace-aware logging
namespace App\Examples {
    
    class NamespaceExample
    {
        private $logger;
        
        public function __construct($logger)
        {
            $this->logger = $logger;
            
            $this->logger->info('Class instantiated', [
                'class' => __CLASS__,
                'namespace' => __NAMESPACE__,
                'method' => __METHOD__,
                'file' => __FILE__,
                'line' => __LINE__,
            ]);
        }
        
        public function doSomething(): void
        {
            $this->logger->debug('Method execution started', [
                'method' => __METHOD__,
                'class' => __CLASS__,
                'namespace' => __NAMESPACE__,
                'line' => __LINE__,
            ]);
            
            // Simulate work
            usleep(100000);
            
            $this->logger->debug('Method execution completed', [
                'method' => __METHOD__,
                'line' => __LINE__,
            ]);
        }
    }
}

// Run examples
echo "Running logging examples...\n\n";

echo "1. Basic logging:\n";
demonstrateBasicLogging();

echo "\n2. Performance logging:\n";
demonstratePerformanceLogging();

echo "\n3. Namespace-aware logging:\n";
$namespaceExample = new App\Examples\NamespaceExample($appLogger);
$namespaceExample->doSomething();

echo "\n4. Error logging:\n";
try {
    demonstrateErrorLogging();
} catch (Exception $e) {
    echo "Caught and logged error: {$e->getMessage()}\n";
}

echo "\nAll examples completed. Check the log files in the logs directory.\n";
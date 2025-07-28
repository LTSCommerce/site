<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Handler\BrowserConsoleHandler;
use Monolog\Processor\PsrLogMessageProcessor;
use Monolog\Processor\IntrospectionProcessor;
use Monolog\Formatter\JsonFormatter;
use Monolog\Formatter\LineFormatter;
use App\Logging\Processors\DebugContextProcessor;
use Psr\Log\LoggerInterface;

/**
 * Factory for creating configured loggers with magic constants support
 */
class LoggerFactory
{
    private string $logDirectory;
    private bool $debugMode;
    private array $defaultChannels = [
        'app' => Logger::INFO,
        'database' => Logger::DEBUG,
        'security' => Logger::WARNING,
        'performance' => Logger::INFO,
        'api' => Logger::INFO,
    ];
    
    public function __construct(
        string $logDirectory = __DIR__ . '/../../var/logs',
        bool $debugMode = false
    ) {
        $this->logDirectory = $logDirectory;
        $this->debugMode = $debugMode;
        
        // Ensure log directory exists
        if (!is_dir($this->logDirectory)) {
            mkdir($this->logDirectory, 0755, true);
        }
    }
    
    /**
     * Create a logger for a specific channel
     */
    public function createLogger(
        string $channel,
        ?int $level = null
    ): LoggerInterface {
        $logger = new Logger($channel);
        $logLevel = $level ?? $this->defaultChannels[$channel] ?? Logger::INFO;
        
        // Add handlers based on environment
        $this->addHandlers($logger, $channel, $logLevel);
        
        // Add processors for enhanced context
        $this->addProcessors($logger);
        
        return $logger;
    }
    
    /**
     * Create enhanced logger with magic constants support
     */
    public function createEnhancedLogger(string $channel): EnhancedLogger
    {
        return new EnhancedLogger($channel);
    }
    
    /**
     * Create performance logger
     */
    public function createPerformanceLogger(string $channel = 'performance'): PerformanceLogger
    {
        $logger = $this->createLogger($channel, Logger::DEBUG);
        return new PerformanceLogger($logger);
    }
    
    /**
     * Add appropriate handlers based on channel and environment
     */
    private function addHandlers(Logger $logger, string $channel, int $level): void
    {
        // Main log file with rotation
        $mainHandler = new RotatingFileHandler(
            $this->logDirectory . "/{$channel}.log",
            7, // Keep 7 days
            $level
        );
        $mainHandler->setFormatter($this->createJsonFormatter());
        $logger->pushHandler($mainHandler);
        
        // Error-specific handler for serious issues
        if ($level <= Logger::ERROR) {
            $errorHandler = new StreamHandler(
                $this->logDirectory . '/errors.log',
                Logger::ERROR
            );
            $errorHandler->setFormatter($this->createJsonFormatter());
            $logger->pushHandler($errorHandler);
        }
        
        // Console handler for development
        if ($this->debugMode) {
            $consoleHandler = new StreamHandler('php://stdout', Logger::DEBUG);
            $consoleHandler->setFormatter($this->createLineFormatter());
            $logger->pushHandler($consoleHandler);
            
            // Browser console for web requests
            if (isset($_SERVER['HTTP_HOST'])) {
                $browserHandler = new BrowserConsoleHandler();
                $logger->pushHandler($browserHandler);
            }
        }
        
        // Channel-specific handlers
        $this->addChannelSpecificHandlers($logger, $channel);
    }
    
    /**
     * Add channel-specific handlers
     */
    private function addChannelSpecificHandlers(Logger $logger, string $channel): void
    {
        switch ($channel) {
            case 'security':
                // Security events should be logged separately
                $securityHandler = new StreamHandler(
                    $this->logDirectory . '/security.log',
                    Logger::INFO
                );
                $securityHandler->setFormatter($this->createJsonFormatter());
                $logger->pushHandler($securityHandler);
                break;
                
            case 'database':
                // Database queries and performance
                $dbHandler = new RotatingFileHandler(
                    $this->logDirectory . '/database.log',
                    30, // Keep longer for analysis
                    Logger::DEBUG
                );
                $dbHandler->setFormatter($this->createJsonFormatter());
                $logger->pushHandler($dbHandler);
                break;
                
            case 'api':
                // API requests and responses
                $apiHandler = new RotatingFileHandler(
                    $this->logDirectory . '/api.log',
                    14,
                    Logger::INFO
                );
                $apiHandler->setFormatter($this->createJsonFormatter());
                $logger->pushHandler($apiHandler);
                break;
        }
    }
    
    /**
     * Add processors for enhanced logging context
     */
    private function addProcessors(Logger $logger): void
    {
        // PSR-3 message processing for placeholder interpolation
        $logger->pushProcessor(new PsrLogMessageProcessor());
        
        // Introspection processor for basic caller info
        $logger->pushProcessor(new IntrospectionProcessor(
            Logger::DEBUG, // Only add introspection for debug and above
            ['Monolog\\', 'App\\Logging\\'] // Skip these namespaces
        ));
        
        // Custom debug context processor
        $logger->pushProcessor(new DebugContextProcessor(
            $this->debugMode, // Include stack trace in debug mode
            1 // Skip one frame to get actual caller
        ));
        
        // Add request context for web requests
        if (isset($_SERVER['REQUEST_METHOD'])) {
            $logger->pushProcessor(function ($record) {
                $record->extra['request_context'] = [
                    'method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
                    'uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
                    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                    'request_id' => $_SERVER['HTTP_X_REQUEST_ID'] ?? uniqid(),
                ];
                return $record;
            });
        }
    }
    
    /**
     * Create JSON formatter for structured logging
     */
    private function createJsonFormatter(): JsonFormatter
    {
        return new JsonFormatter(
            JsonFormatter::BATCH_MODE_JSON,
            true, // Include stack traces
            true  // Ignore empty context
        );
    }
    
    /**
     * Create line formatter for console output
     */
    private function createLineFormatter(): LineFormatter
    {
        $format = "[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n";
        $formatter = new LineFormatter($format, 'Y-m-d H:i:s');
        $formatter->allowInlineLineBreaks(true);
        $formatter->ignoreEmptyContextAndExtra(true);
        
        return $formatter;
    }
    
    /**
     * Get available log channels
     */
    public function getAvailableChannels(): array
    {
        return array_keys($this->defaultChannels);
    }
    
    /**
     * Set debug mode
     */
    public function setDebugMode(bool $debugMode): void
    {
        $this->debugMode = $debugMode;
    }
}
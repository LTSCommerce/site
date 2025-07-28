<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Processor\IntrospectionProcessor;
use Monolog\Processor\PsrLogMessageProcessor;
use Monolog\Formatter\JsonFormatter;
use Psr\Log\LoggerInterface;

/**
 * Enhanced logger that leverages PHP magic constants for contextual logging
 */
class EnhancedLogger
{
    private LoggerInterface $logger;
    
    public function __construct(string $channel = 'app')
    {
        $this->logger = new Logger($channel);
        
        // Add handlers for different log levels
        $this->setupHandlers();
        
        // Add processors for enhanced context
        $this->setupProcessors();
    }
    
    private function setupHandlers(): void
    {
        // Daily rotating logs with JSON formatting
        $rotatingHandler = new RotatingFileHandler(
            __DIR__ . '/../../var/logs/app.log',
            7, // Keep 7 days
            Logger::DEBUG
        );
        $rotatingHandler->setFormatter(new JsonFormatter());
        
        // Error-specific handler
        $errorHandler = new StreamHandler(
            __DIR__ . '/../../var/logs/errors.log',
            Logger::ERROR
        );
        $errorHandler->setFormatter(new JsonFormatter());
        
        $this->logger->pushHandler($rotatingHandler);
        $this->logger->pushHandler($errorHandler);
    }
    
    private function setupProcessors(): void
    {
        // PSR-3 message processing for placeholder interpolation
        $this->logger->pushProcessor(new PsrLogMessageProcessor());
        
        // Introspection processor adds file, line, class, function info
        $this->logger->pushProcessor(new IntrospectionProcessor());
    }
    
    /**
     * Create context-aware log entry using magic constants
     */
    public function logWithContext(
        string $level,
        string $message,
        array $context = [],
        ?string $callerFile = null,
        ?int $callerLine = null,
        ?string $callerFunction = null,
        ?string $callerClass = null,
        ?string $callerMethod = null
    ): void {
        // Enhance context with caller information
        $enhancedContext = array_merge($context, [
            'caller' => [
                'file' => $callerFile ?? 'unknown',
                'line' => $callerLine ?? 0,
                'function' => $callerFunction ?? 'unknown',
                'class' => $callerClass ?? 'unknown',
                'method' => $callerMethod ?? 'unknown',
            ],
            'timestamp' => date('c'),
        ]);
        
        $this->logger->log($level, $message, $enhancedContext);
    }
    
    /**
     * Helper method to create a context-aware info log
     */
    public function info(string $message, array $context = []): void
    {
        $this->logWithContext(
            'info',
            $message,
            $context,
            debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0]['file'] ?? null,
            debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0]['line'] ?? null,
            debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0]['function'] ?? null,
            debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0]['class'] ?? null
        );
    }
    
    /**
     * Get the underlying logger instance
     */
    public function getLogger(): LoggerInterface
    {
        return $this->logger;
    }
}
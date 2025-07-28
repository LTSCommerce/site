<?php

declare(strict_types=1);

namespace App\Logging;

use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;

/**
 * Logging trait that automatically includes magic constants in log context
 */
trait LoggingTrait
{
    private LoggerInterface $logger;
    
    /**
     * Set the logger instance
     */
    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }
    
    /**
     * Log with automatic context enrichment using magic constants
     */
    protected function log(
        string $level,
        string $message,
        array $context = []
    ): void {
        if (!isset($this->logger)) {
            return; // Graceful degradation if no logger set
        }
        
        // Enrich context with magic constants and caller information
        $enrichedContext = array_merge($context, [
            'source' => [
                'file' => __FILE__,
                'line' => __LINE__,
                'class' => __CLASS__,
                'trait' => __TRAIT__,
                'method' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2)[1]['function'] ?? 'unknown',
            ],
            'runtime' => [
                'memory_usage' => memory_get_usage(true),
                'peak_memory' => memory_get_peak_usage(true),
                'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
            ]
        ]);
        
        $this->logger->log($level, $message, $enrichedContext);
    }
    
    /**
     * Log debug information
     */
    protected function logDebug(string $message, array $context = []): void
    {
        $this->log(LogLevel::DEBUG, $message, $context);
    }
    
    /**
     * Log informational messages
     */
    protected function logInfo(string $message, array $context = []): void
    {
        $this->log(LogLevel::INFO, $message, $context);
    }
    
    /**
     * Log warning messages
     */
    protected function logWarning(string $message, array $context = []): void
    {
        $this->log(LogLevel::WARNING, $message, $context);
    }
    
    /**
     * Log error messages
     */
    protected function logError(string $message, array $context = []): void
    {
        $this->log(LogLevel::ERROR, $message, $context);
    }
    
    /**
     * Log critical errors
     */
    protected function logCritical(string $message, array $context = []): void
    {
        $this->log(LogLevel::CRITICAL, $message, $context);
    }
    
    /**
     * Log method entry with parameters
     */
    protected function logMethodEntry(array $parameters = []): void
    {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
        $caller = $backtrace[1] ?? [];
        
        $this->logDebug('Method entry', [
            'method' => ($caller['class'] ?? '') . '::' . ($caller['function'] ?? 'unknown'),
            'parameters' => $parameters,
            'source_line' => $backtrace[0]['line'] ?? 0,
        ]);
    }
    
    /**
     * Log method exit with return value
     */
    protected function logMethodExit($returnValue = null): void
    {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
        $caller = $backtrace[1] ?? [];
        
        $this->logDebug('Method exit', [
            'method' => ($caller['class'] ?? '') . '::' . ($caller['function'] ?? 'unknown'),
            'return_value' => $returnValue,
            'source_line' => $backtrace[0]['line'] ?? 0,
        ]);
    }
}
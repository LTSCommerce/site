<?php

declare(strict_types=1);

namespace App\Logging;

use Psr\Log\LoggerInterface;

/**
 * Performance-focused logger that uses magic constants for method timing
 */
class PerformanceLogger
{
    private LoggerInterface $logger;
    private array $timers = [];
    private array $counters = [];
    
    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
    
    /**
     * Start timing a method or operation
     */
    public function startTimer(
        ?string $identifier = null,
        ?string $callerMethod = null,
        ?string $callerClass = null,
        ?int $callerLine = null
    ): string {
        // Auto-generate identifier if not provided
        if ($identifier === null) {
            $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0];
            $identifier = sprintf(
                '%s::%s@%d',
                $callerClass ?? $backtrace['class'] ?? 'global',
                $callerMethod ?? $backtrace['function'] ?? 'unknown',
                $callerLine ?? $backtrace['line'] ?? 0
            );
        }
        
        $this->timers[$identifier] = [
            'start_time' => microtime(true),
            'memory_start' => memory_get_usage(true),
            'caller_method' => $callerMethod,
            'caller_class' => $callerClass,
            'caller_line' => $callerLine,
        ];
        
        $this->logger->debug('Timer started', [
            'timer_id' => $identifier,
            'method' => $callerMethod,
            'class' => $callerClass,
            'line' => $callerLine,
            'memory_at_start' => $this->formatBytes(memory_get_usage(true)),
        ]);
        
        return $identifier;
    }
    
    /**
     * Stop timing and log performance metrics
     */
    public function stopTimer(
        string $identifier,
        array $additionalContext = []
    ): array {
        if (!isset($this->timers[$identifier])) {
            $this->logger->warning('Timer not found', [
                'timer_id' => $identifier,
                'available_timers' => array_keys($this->timers),
            ]);
            return [];
        }
        
        $timer = $this->timers[$identifier];
        $endTime = microtime(true);
        $endMemory = memory_get_usage(true);
        
        $metrics = [
            'timer_id' => $identifier,
            'execution_time_ms' => round(($endTime - $timer['start_time']) * 1000, 3),
            'memory_usage_delta' => $endMemory - $timer['memory_start'],
            'memory_usage_delta_formatted' => $this->formatBytes($endMemory - $timer['memory_start']),
            'peak_memory' => $this->formatBytes(memory_get_peak_usage(true)),
            'caller_method' => $timer['caller_method'],
            'caller_class' => $timer['caller_class'],
            'caller_line' => $timer['caller_line'],
        ];
        
        $finalContext = array_merge($metrics, $additionalContext);
        
        // Log at different levels based on execution time
        $executionTime = $metrics['execution_time_ms'];
        if ($executionTime > 1000) {
            $this->logger->warning('Slow operation detected', $finalContext);
        } elseif ($executionTime > 500) {
            $this->logger->info('Operation completed (moderate duration)', $finalContext);
        } else {
            $this->logger->debug('Operation completed', $finalContext);
        }
        
        unset($this->timers[$identifier]);
        return $metrics;
    }
    
    /**
     * Increment a performance counter
     */
    public function incrementCounter(
        string $counterName,
        int $increment = 1,
        ?string $callerMethod = null,
        ?string $callerClass = null
    ): int {
        if (!isset($this->counters[$counterName])) {
            $this->counters[$counterName] = 0;
        }
        
        $this->counters[$counterName] += $increment;
        
        $this->logger->debug('Counter incremented', [
            'counter_name' => $counterName,
            'increment' => $increment,
            'new_value' => $this->counters[$counterName],
            'caller_method' => $callerMethod,
            'caller_class' => $callerClass,
        ]);
        
        return $this->counters[$counterName];
    }
    
    /**
     * Log current performance snapshot
     */
    public function logSnapshot(
        string $label,
        ?string $callerMethod = null,
        ?string $callerClass = null,
        ?int $callerLine = null
    ): void {
        $snapshot = [
            'label' => $label,
            'timestamp' => date('c'),
            'memory_usage' => $this->formatBytes(memory_get_usage(true)),
            'peak_memory' => $this->formatBytes(memory_get_peak_usage(true)),
            'active_timers' => count($this->timers),
            'counters' => $this->counters,
            'included_files' => count(get_included_files()),
            'caller_method' => $callerMethod,
            'caller_class' => $callerClass,
            'caller_line' => $callerLine,
        ];
        
        $this->logger->info('Performance snapshot', $snapshot);
    }
    
    /**
     * Get all active timers
     */
    public function getActiveTimers(): array
    {
        return array_keys($this->timers);
    }
    
    /**
     * Get counter values
     */
    public function getCounters(): array
    {
        return $this->counters;
    }
    
    /**
     * Format bytes into human-readable format
     */
    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = $bytes > 0 ? floor(log($bytes, 1024)) : 0;
        
        return round($bytes / (1024 ** $power), 2) . ' ' . $units[$power];
    }
}
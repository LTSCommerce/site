<?php

declare(strict_types=1);

namespace App\Logging\Processors;

use Monolog\LogRecord;
use Monolog\Processor\ProcessorInterface;

/**
 * Custom Monolog processor that enriches log records with debugging context
 * using PHP magic constants and runtime information
 */
class DebugContextProcessor implements ProcessorInterface
{
    private bool $includeTrace;
    private int $skipStackFrames;
    
    public function __construct(bool $includeTrace = false, int $skipStackFrames = 0)
    {
        $this->includeTrace = $includeTrace;
        $this->skipStackFrames = $skipStackFrames;
    }
    
    /**
     * Process log record and add debugging context
     */
    public function __invoke(LogRecord $record): LogRecord
    {
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10 + $this->skipStackFrames);
        
        // Find the first frame that's not from the logging system
        $relevantFrame = $this->findRelevantFrame($trace);
        
        if ($relevantFrame) {
            $extra = $record->extra;
            
            // Add magic constants context
            $extra['debug_context'] = [
                'file' => $relevantFrame['file'] ?? 'unknown',
                'line' => $relevantFrame['line'] ?? 0,
                'function' => $relevantFrame['function'] ?? 'unknown',
                'class' => $relevantFrame['class'] ?? null,
                'type' => $relevantFrame['type'] ?? null,
            ];
            
            // Add runtime context
            $extra['runtime_context'] = [
                'memory_usage' => $this->formatBytes(memory_get_usage(true)),
                'peak_memory' => $this->formatBytes(memory_get_peak_usage(true)),
                'included_files_count' => count(get_included_files()),
                'declared_classes_count' => count(get_declared_classes()),
            ];
            
            // Add environment context
            $extra['environment_context'] = [
                'php_version' => PHP_VERSION,
                'sapi_name' => PHP_SAPI,
                'os' => PHP_OS_FAMILY,
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'CLI',
            ];
            
            // Optionally include stack trace
            if ($this->includeTrace) {
                $extra['stack_trace'] = $this->formatStackTrace($trace);
            }
            
            return $record->with(extra: $extra);
        }
        
        return $record;
    }
    
    /**
     * Find the most relevant frame in the stack trace
     */
    private function findRelevantFrame(array $trace): ?array
    {
        $ignoredClasses = [
            'Monolog\\',
            'Psr\\Log\\',
            'App\\Logging\\',
        ];
        
        foreach ($trace as $frame) {
            if (!isset($frame['class'])) {
                return $frame; // Function call, likely relevant
            }
            
            $isIgnored = false;
            foreach ($ignoredClasses as $ignoredClass) {
                if (strpos($frame['class'], $ignoredClass) === 0) {
                    $isIgnored = true;
                    break;
                }
            }
            
            if (!$isIgnored) {
                return $frame;
            }
        }
        
        return $trace[0] ?? null; // Fallback to first frame
    }
    
    /**
     * Format stack trace for logging
     */
    private function formatStackTrace(array $trace): array
    {
        $formatted = [];
        
        foreach ($trace as $index => $frame) {
            $formatted[] = sprintf(
                '#%d %s%s%s() called at [%s:%d]',
                $index,
                $frame['class'] ?? '',
                $frame['type'] ?? '',
                $frame['function'] ?? 'unknown',
                $frame['file'] ?? 'unknown',
                $frame['line'] ?? 0
            );
        }
        
        return $formatted;
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
<?php

declare(strict_types=1);

namespace App\Monitoring;

use App\ValueObjects\{MetricName, Duration};
use App\Exceptions\TimerNotFoundException;
use Psr\Log\LoggerInterface;

final class PerformanceMonitor
{
    /** @var array<string, float> */
    private array $timers = [];
    
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly MetricsCollector $metricsCollector,
    ) {}
    
    public function start(MetricName $name): void
    {
        $this->timers[$name->value] = hrtime(true);
    }
    
    public function end(MetricName $name): Duration
    {
        $timerKey = $name->value;
        
        if (!isset($this->timers[$timerKey])) {
            throw new TimerNotFoundException("Timer '{$timerKey}' not found");
        }
        
        $elapsed = Duration::fromNanoseconds(
            hrtime(true) - $this->timers[$timerKey]
        );
        
        unset($this->timers[$timerKey]);
        
        $this->metricsCollector->timing($name, $elapsed);
        
        $this->logger->debug('Performance metric recorded', [
            'metric' => $name->value,
            'duration_ms' => $elapsed->toMilliseconds(),
        ]);
        
        return $elapsed;
    }
}
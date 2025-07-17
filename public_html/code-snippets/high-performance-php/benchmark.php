<?php

class Benchmark {
    public static function run(callable $callback, int $iterations = 1000): array {
        $times = [];
        
        for ($i = 0; $i < $iterations; $i++) {
            $start = microtime(true);
            $callback();
            $times[] = microtime(true) - $start;
        }
        
        return [
            'min' => min($times),
            'max' => max($times),
            'avg' => array_sum($times) / count($times),
            'median' => self::median($times),
            'total' => array_sum($times)
        ];
    }
    
    private static function median(array $values): float {
        sort($values);
        $count = count($values);
        $middle = floor($count / 2);
        
        if ($count % 2 === 0) {
            return ($values[$middle - 1] + $values[$middle]) / 2;
        }
        
        return $values[$middle];
    }
}
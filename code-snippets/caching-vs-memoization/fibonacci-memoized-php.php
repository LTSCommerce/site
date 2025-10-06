<?php

declare(strict_types=1);

class FibonacciCalculator
{
    private array $memo = [];

    public function calculate(int $n): int
    {
        // Check memoization cache
        if (isset($this->memo[$n])) {
            return $this->memo[$n];
        }

        // Base cases
        if ($n <= 1) {
            return $n;
        }

        // Calculate and store in memo
        $result = $this->calculate($n - 1) + $this->calculate($n - 2);
        $this->memo[$n] = $result;

        return $result;
    }

    public function getCacheSize(): int
    {
        return count($this->memo);
    }
}

// Usage
$calc = new FibonacciCalculator();
echo $calc->calculate(40); // Fast after first call
echo "Cache size: " . $calc->getCacheSize(); // Shows stored values

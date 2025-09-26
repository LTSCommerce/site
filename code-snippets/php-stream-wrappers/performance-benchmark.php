<?php
// Benchmarking different stream approaches
function benchmarkStreams(string $data, int $iterations = 1000): array
{
    $results = [];

    // File wrapper
    $start = microtime(true);
    for ($i = 0; $i < $iterations; $i++) {
        file_put_contents('/tmp/benchmark.txt', $data);
        $read = file_get_contents('/tmp/benchmark.txt');
    }
    $results['file'] = microtime(true) - $start;

    // Memory stream
    $start = microtime(true);
    for ($i = 0; $i < $iterations; $i++) {
        $memory = fopen('php://memory', 'r+');
        fwrite($memory, $data);
        rewind($memory);
        $read = stream_get_contents($memory);
        fclose($memory);
    }
    $results['memory'] = microtime(true) - $start;

    // Temp stream
    $start = microtime(true);
    for ($i = 0; $i < $iterations; $i++) {
        $temp = fopen('php://temp', 'r+');
        fwrite($temp, $data);
        rewind($temp);
        $read = stream_get_contents($temp);
        fclose($temp);
    }
    $results['temp'] = microtime(true) - $start;

    return $results;
}

$testData = str_repeat('Performance test data ', 100);
$benchmarks = benchmarkStreams($testData);

foreach ($benchmarks as $method => $time) {
    echo "{$method}: " . round($time * 1000, 2) . "ms\n";
}

// Memory usage monitoring
function monitorStreamMemory(callable $streamOperation): array
{
    $memoryBefore = memory_get_usage(true);
    $peakBefore = memory_get_peak_usage(true);

    $streamOperation();

    $memoryAfter = memory_get_usage(true);
    $peakAfter = memory_get_peak_usage(true);

    return [
        'memory_delta' => $memoryAfter - $memoryBefore,
        'peak_delta' => $peakAfter - $peakBefore,
    ];
}

// Monitor custom wrapper memory usage
$memoryStats = monitorStreamMemory(function() {
    $cache = fopen('cache://large-data', 'w');
    for ($i = 0; $i < 10000; $i++) {
        fwrite($cache, "Data chunk {$i}\n");
    }
    fclose($cache);
});

echo "Memory used: " . number_format($memoryStats['memory_delta']) . " bytes\n";
echo "Peak memory: " . number_format($memoryStats['peak_delta']) . " bytes\n";
?>
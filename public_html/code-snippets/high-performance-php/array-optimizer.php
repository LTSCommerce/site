<?php

class ArrayOptimizer {
    // Slow: Multiple array iterations
    public static function slowProcess(array $items): array {
        $filtered = array_filter($items, fn($item) => $item > 10);
        $mapped = array_map(fn($item) => $item * 2, $filtered);
        return array_values($mapped);
    }
    
    // Fast: Single iteration
    public static function fastProcess(array $items): array {
        $result = [];
        foreach ($items as $item) {
            if ($item > 10) {
                $result[] = $item * 2;
            }
        }
        return $result;
    }
    
    // Use array_column for efficient data extraction
    public static function extractColumn(array $data, string $column): array {
        return array_column($data, $column);
    }
    
    // Efficient array search
    public static function fastSearch(array $haystack, $needle): bool {
        // Use isset for array keys
        return isset($haystack[$needle]);
        
        // Use array_flip for value searches
        $flipped = array_flip($haystack);
        return isset($flipped[$needle]);
    }
}
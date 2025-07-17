<?php

class StringOptimizer {
    // Use string concatenation efficiently
    public static function buildString(array $parts): string {
        // Slow: Multiple concatenations
        $result = '';
        foreach ($parts as $part) {
            $result .= $part;
        }
        return $result;
    }
    
    public static function buildStringFast(array $parts): string {
        // Fast: Single join operation
        return implode('', $parts);
    }
    
    // Use substr for string operations
    public static function extractSubstring(string $str, int $start, int $length): string {
        return substr($str, $start, $length);
    }
    
    // Use strpos for string searches
    public static function containsString(string $haystack, string $needle): bool {
        return strpos($haystack, $needle) !== false;
    }
}
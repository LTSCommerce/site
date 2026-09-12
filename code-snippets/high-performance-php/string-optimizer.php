<?php

declare(strict_types=1);

namespace App\Performance\Examples;

final class StringOptimizer
{
    /**
     * str_contains()/str_starts_with()/str_ends_with() say directly what
     * they check. The strpos() equivalents need an explicit !== false
     * comparison, since strpos() returns 0 (falsy) for a match at
     * position zero.
     */
    public function pathLooksAbsolute(string $path): bool
    {
        return str_starts_with($path, '/');
    }

    public function pathContainsTraversal(string $path): bool
    {
        return str_contains($path, '../');
    }

    /**
     * sprintf() keeps a template with several substitutions readable in
     * one place; string concatenation of the same template becomes harder
     * to scan once there are more than two or three placeholders.
     */
    public function formatLogLine(string $level, string $message, float $durationMs): string
    {
        return sprintf('[%s] %s (%.2fms)', $level, $message, $durationMs);
    }

    /**
     * Repeated string concatenation inside a loop reallocates the growing
     * string on every iteration. Collecting the pieces in an array and
     * joining once with implode() avoids the repeated reallocation.
     */
    public function buildCsvLine(array $columns): string
    {
        $escaped = [];

        foreach ($columns as $column) {
            $escaped[] = str_contains($column, ',')
                ? '"' . str_replace('"', '""', $column) . '"'
                : $column;
        }

        return implode(',', $escaped);
    }
}

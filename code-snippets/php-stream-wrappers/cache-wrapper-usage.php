<?php
// Write data to cache
$handle = fopen('cache://user:123', 'w');
fwrite($handle, json_encode(['name' => 'John', 'email' => 'john@example.com']));
fclose($handle);

// Read data from cache
$userData = file_get_contents('cache://user:123');
$user = json_decode($userData, true);
echo "User: {$user['name']} ({$user['email']})\n";

// Check if cache entry exists
if (file_exists('cache://user:123')) {
    echo "Cache entry found\n";
    $stats = stat('cache://user:123');
    echo "Size: {$stats['size']} bytes\n";
}

// Append to cache entry
$handle = fopen('cache://user:123', 'a');
fwrite($handle, " - Updated at " . date('c'));
fclose($handle);

// Advanced usage with JSON files
function saveCachedJson(string $key, array $data): void
{
    file_put_contents("cache://{$key}", json_encode($data, JSON_PRETTY_PRINT));
}

function loadCachedJson(string $key): ?array
{
    if (!file_exists("cache://{$key}")) {
        return null;
    }

    $content = file_get_contents("cache://{$key}");
    return json_decode($content, true);
}

// Usage
saveCachedJson('config', ['debug' => true, 'timeout' => 30]);
$config = loadCachedJson('config');
var_dump($config);
?>
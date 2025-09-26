<?php
// Plain text data
$textData = file_get_contents('data://text/plain;charset=utf-8,Hello%20World');
echo $textData; // Outputs: Hello World

// Base64 encoded data
$base64Data = 'data://text/plain;base64,SGVsbG8gUEhQIERldmVsb3BlcnM=';
$decoded = file_get_contents($base64Data);
echo $decoded; // Outputs: Hello PHP Developers

// Binary data (image example)
$imageData = 'data://image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
$pngContent = file_get_contents($imageData);

// Save embedded image to file
file_put_contents('/tmp/tiny.png', $pngContent);

// JSON data embedded in data URI
$jsonUri = 'data://application/json;charset=utf-8,' . urlencode(json_encode([
    'users' => ['alice', 'bob', 'charlie'],
    'timestamp' => time()
]));

$jsonData = json_decode(file_get_contents($jsonUri), true);
print_r($jsonData);

// Creating dynamic data URIs
function createDataUri(string $content, string $mimeType = 'text/plain', bool $base64 = false): string
{
    if ($base64) {
        return "data://{$mimeType};base64," . base64_encode($content);
    }

    return "data://{$mimeType}," . urlencode($content);
}

$csvData = "Name,Age\nJohn,30\nJane,25";
$csvUri = createDataUri($csvData, 'text/csv');
$rows = file($csvUri, FILE_IGNORE_NEW_LINES);
?>
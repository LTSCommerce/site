<?php
// Reading compressed files
$compressedLog = file_get_contents('compress.zlib:///var/log/app.log.gz');
$logLines = explode("\n", $compressedLog);

// Writing compressed data
$data = str_repeat("Log entry " . date('c') . "\n", 1000);
file_put_contents('compress.zlib:///tmp/output.gz', $data);

// Compressing streaming data
$input = fopen('php://input', 'r');
$output = fopen('compress.zlib://php://output', 'w');

while (!feof($input)) {
    $chunk = fread($input, 8192);
    fwrite($output, $chunk);
}

fclose($input);
fclose($output);

// Using compression filters directly
$originalSize = strlen($data);
$compressed = gzencode($data);
$compressedSize = strlen($compressed);

echo "Compression ratio: " . round(($originalSize - $compressedSize) / $originalSize * 100, 2) . "%\n";

// Decompressing with error handling
function safeDecompress(string $filePath): ?string
{
    if (!file_exists($filePath)) {
        return null;
    }

    $handle = fopen("compress.zlib://{$filePath}", 'r');
    if ($handle === false) {
        return null;
    }

    $content = stream_get_contents($handle);
    fclose($handle);

    return $content !== false ? $content : null;
}
?>
<?php
// These are equivalent
$handle1 = fopen('/var/log/app.log', 'r');
$handle2 = fopen('file:///var/log/app.log', 'r');

// Reading with context options for large files
$context = stream_context_create([
    'file' => [
        'chunk_size' => 8192  // Read in 8KB chunks
    ]
]);

$logData = file_get_contents('/var/log/app.log', false, $context);

// Checking file permissions before access
if (is_readable('/etc/passwd')) {
    $passwd = file('/etc/passwd', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($passwd as $line) {
        $parts = explode(':', $line);
        echo "User: {$parts[0]}, Shell: " . end($parts) . PHP_EOL;
    }
}
?>
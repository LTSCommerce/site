<?php
// Built-in wrapper examples
$fileHandle = fopen('file:///path/to/file.txt', 'r');
$webContent = file_get_contents('https://api.example.com/data');
$tempStream = fopen('php://temp', 'w+');
$dataStream = fopen('data://text/plain;base64,SGVsbG8gV29ybGQ=', 'r');

// List all registered wrappers
$wrappers = stream_get_wrappers();
print_r($wrappers);
?>
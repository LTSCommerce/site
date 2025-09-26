<?php
// Read raw POST data (useful for APIs)
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

// Write to error log
$errorLog = fopen('php://stderr', 'w');
fwrite($errorLog, "Critical error occurred at " . date('c') . PHP_EOL);
fclose($errorLog);

// Read from command line (CLI only)
if (php_sapi_name() === 'cli') {
    $stdin = fopen('php://stdin', 'r');
    echo "Enter your name: ";
    $name = trim(fgets($stdin));
    echo "Hello, {$name}!" . PHP_EOL;
    fclose($stdin);
}
?>
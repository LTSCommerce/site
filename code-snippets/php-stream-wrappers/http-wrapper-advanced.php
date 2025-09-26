<?php
// Simple GET request
$apiResponse = file_get_contents('https://api.github.com/users/octocat');
$userData = json_decode($apiResponse, true);

// Advanced HTTP request with context
$postData = json_encode(['name' => 'test', 'value' => 42]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiToken,
            'User-Agent: MyApp/1.0'
        ],
        'content' => $postData,
        'timeout' => 30,
        'ignore_errors' => true  // Don't throw on HTTP errors
    ]
]);

$response = file_get_contents('https://api.example.com/data', false, $context);

// Check response status from $http_response_header
if (isset($http_response_header[0])) {
    preg_match('/HTTP\/\d\.\d\s+(\d+)/', $http_response_header[0], $matches);
    $statusCode = (int) ($matches[1] ?? 0);

    if ($statusCode >= 200 && $statusCode < 300) {
        echo "Success: " . $response;
    } else {
        echo "HTTP Error {$statusCode}: " . $response;
    }
}
?>
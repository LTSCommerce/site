<?php
// Using filters with streams
$data = "The quick brown fox jumps over the lazy dog.";

// ROT13 encoding
$encoded = fopen('php://memory', 'r+');
stream_filter_append($encoded, 'string.rot13');
fwrite($encoded, $data);
rewind($encoded);
$rot13Data = stream_get_contents($encoded);
fclose($encoded);

echo "Original: {$data}\n";
echo "ROT13: {$rot13Data}\n";

// Base64 encoding filter
$base64Stream = fopen('php://memory', 'r+');
stream_filter_append($base64Stream, 'convert.base64-encode');
fwrite($base64Stream, $data);
rewind($base64Stream);
$base64Data = stream_get_contents($base64Stream);
fclose($base64Stream);

echo "Base64: {$base64Data}\n";

// HTTP context with custom options
$httpContext = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Accept: application/json',
        'timeout' => 10,
        'follow_location' => true,
        'max_redirects' => 3,
        'protocol_version' => 1.1,
    ]
]);

$response = file_get_contents('https://httpbin.org/json', false, $httpContext);

// SSL context for secure connections
$sslContext = stream_context_create([
    'ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'cafile' => '/etc/ssl/certs/ca-certificates.crt',
        'ciphers' => 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
    ]
]);

$secureData = file_get_contents('https://secure-api.example.com/data', false, $sslContext);
?>
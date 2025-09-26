<?php
// Comprehensive stream debugging
function debugStream(string $streamUrl): array
{
    $info = [];

    // Basic stream information
    $info['wrappers'] = stream_get_wrappers();
    $info['url_components'] = parse_url($streamUrl);

    // Test stream accessibility
    $context = stream_context_create();
    $handle = @fopen($streamUrl, 'r', false, $context);

    if ($handle === false) {
        $info['status'] = 'failed';
        $info['error'] = error_get_last();
        return $info;
    }

    // Stream metadata
    $info['status'] = 'success';
    $info['metadata'] = stream_get_meta_data($handle);

    // Read capabilities
    $info['can_read'] = !feof($handle);
    $info['position'] = ftell($handle);

    // Try to read first 100 bytes
    $preview = fread($handle, 100);
    $info['preview'] = bin2hex($preview);
    $info['preview_text'] = mb_convert_encoding($preview, 'UTF-8', 'auto');

    fclose($handle);
    return $info;
}

// Test different streams
$streams = [
    'file:///etc/hostname',
    'php://memory',
    'data://text/plain;base64,SGVsbG8gV29ybGQ=',
    'https://httpbin.org/json'
];

foreach ($streams as $stream) {
    echo "Testing {$stream}:\n";
    $debug = debugStream($stream);
    echo json_encode($debug, JSON_PRETTY_PRINT) . "\n\n";
}

// Error handling for custom wrappers
class DiagnosticStreamWrapper
{
    private static array $logs = [];

    public static function getLogs(): array
    {
        return self::$logs;
    }

    public static function clearLogs(): void
    {
        self::$logs = [];
    }

    private function log(string $method, array $args = []): void
    {
        self::$logs[] = [
            'timestamp' => microtime(true),
            'method' => $method,
            'args' => $args,
            'memory' => memory_get_usage()
        ];
    }

    public function stream_open(string $path, string $mode, int $options, ?string &$opened_path): bool
    {
        $this->log(__FUNCTION__, ['path' => $path, 'mode' => $mode]);
        return true;
    }

    public function stream_read(int $count): string
    {
        $this->log(__FUNCTION__, ['count' => $count]);
        return str_repeat('X', min($count, 10)); // Return dummy data
    }

    public function stream_write(string $data): int
    {
        $this->log(__FUNCTION__, ['length' => strlen($data)]);
        return strlen($data);
    }

    public function stream_eof(): bool
    {
        $this->log(__FUNCTION__);
        return false;
    }

    public function stream_close(): void
    {
        $this->log(__FUNCTION__);
    }

    public function stream_tell(): int { return 0; }
    public function stream_seek(int $offset, int $whence = SEEK_SET): bool { return true; }
}

stream_wrapper_register('debug', DiagnosticStreamWrapper::class);

// Test diagnostic wrapper
$handle = fopen('debug://test', 'r+');
fread($handle, 50);
fwrite($handle, 'test data');
fclose($handle);

// Review diagnostic logs
$logs = DiagnosticStreamWrapper::getLogs();
foreach ($logs as $log) {
    echo sprintf("[%.4f] %s: %s\n",
        $log['timestamp'],
        $log['method'],
        json_encode($log['args'])
    );
}
?>
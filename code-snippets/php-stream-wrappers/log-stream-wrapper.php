<?php
class LogStreamWrapper
{
    private $handle;
    private string $logFile;

    public function stream_open(string $path, string $mode, int $options, ?string &$opened_path): bool
    {
        $url = parse_url($path);
        $logLevel = $url['host'] ?? 'info';
        $this->logFile = "/var/log/app-{$logLevel}.log";

        // Add timestamp prefix to all writes
        if (str_contains($mode, 'w') || str_contains($mode, 'a')) {
            $this->handle = fopen($this->logFile, $mode);
            return $this->handle !== false;
        }

        return false;
    }

    public function stream_write(string $data): int
    {
        $timestamp = date('[Y-m-d H:i:s] ');
        $logEntry = $timestamp . $data;

        // Ensure newline ending
        if (!str_ends_with($logEntry, "\n")) {
            $logEntry .= "\n";
        }

        return fwrite($this->handle, $logEntry);
    }

    public function stream_close(): void
    {
        if ($this->handle) {
            fclose($this->handle);
        }
    }

    // Implement other required methods...
    public function stream_eof(): bool { return feof($this->handle); }
    public function stream_read(int $count): string { return fread($this->handle, $count); }
    public function stream_seek(int $offset, int $whence = SEEK_SET): bool { return fseek($this->handle, $offset, $whence) === 0; }
    public function stream_tell(): int { return ftell($this->handle); }

    public function stream_lock(int $operation): bool
    {
        return flock($this->handle, $operation);
    }

    public function stream_truncate(int $new_size): bool
    {
        return ftruncate($this->handle, $new_size);
    }
}

stream_wrapper_register('log', LogStreamWrapper::class);

// Usage
$errorLog = fopen('log://error/application', 'a');
fwrite($errorLog, 'Database connection failed');
flock($errorLog, LOCK_EX);
fwrite($errorLog, 'Critical error in payment processing');
flock($errorLog, LOCK_UN);
fclose($errorLog);

// Reading logs with automatic timestamping
$debugHandle = fopen('log://debug/application', 'w');
fwrite($debugHandle, 'User login attempt');
fwrite($debugHandle, 'Session created successfully');
fclose($debugHandle);
?>
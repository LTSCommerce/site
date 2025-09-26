<?php
class SecureFileWrapper
{
    private array $allowedPaths = [
        '/var/www/uploads/',
        '/tmp/app/',
    ];

    private $handle;
    private string $realPath;

    public function stream_open(string $path, string $mode, int $options, ?string &$opened_path): bool
    {
        $url = parse_url($path);
        $requestedPath = $url['path'] ?? '';

        // Resolve real path to prevent directory traversal
        $this->realPath = realpath(dirname($requestedPath)) . '/' . basename($requestedPath);

        // Check if path is within allowed directories
        foreach ($this->allowedPaths as $allowedPath) {
            if (str_starts_with($this->realPath, realpath($allowedPath))) {
                $this->handle = fopen($this->realPath, $mode);
                return $this->handle !== false;
            }
        }

        // Log security violation
        error_log("Security violation: Attempted access to {$requestedPath}");
        return false;
    }

    public function stream_read(int $count): string
    {
        return fread($this->handle, $count);
    }

    public function stream_write(string $data): int
    {
        // Filter dangerous content
        $data = $this->sanitizeContent($data);
        return fwrite($this->handle, $data);
    }

    private function sanitizeContent(string $content): string
    {
        // Remove null bytes
        $content = str_replace("\0", '', $content);

        // Basic XSS prevention for text files
        if (str_ends_with($this->realPath, '.txt') || str_ends_with($this->realPath, '.log')) {
            $content = htmlspecialchars($content, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return $content;
    }

    // Implement other required methods...
    public function stream_close(): void { if ($this->handle) fclose($this->handle); }
    public function stream_eof(): bool { return feof($this->handle); }
    public function stream_seek(int $offset, int $whence = SEEK_SET): bool { return fseek($this->handle, $offset, $whence) === 0; }
    public function stream_tell(): int { return ftell($this->handle); }
}

stream_wrapper_register('secure', SecureFileWrapper::class);

// Safe usage
try {
    $handle = fopen('secure:///var/www/uploads/user-data.txt', 'w');
    if ($handle) {
        fwrite($handle, "Safe content");
        fclose($handle);
    }
} catch (Exception $e) {
    echo "Access denied: " . $e->getMessage();
}

// This will fail due to path traversal attempt
$maliciousHandle = fopen('secure:///var/www/uploads/../../../etc/passwd', 'r');
// Returns false and logs security violation
?>
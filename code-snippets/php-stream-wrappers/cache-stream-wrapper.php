<?php
class MemoryCache
{
    private static array $cache = [];

    public static function set(string $key, mixed $value): void
    {
        self::$cache[$key] = serialize($value);
    }

    public static function get(string $key): mixed
    {
        return isset(self::$cache[$key]) ? unserialize(self::$cache[$key]) : null;
    }

    public static function exists(string $key): bool
    {
        return isset(self::$cache[$key]);
    }

    public static function delete(string $key): void
    {
        unset(self::$cache[$key]);
    }
}

class CacheStreamWrapper
{
    private mixed $position = 0;
    private string $data = '';
    private string $key = '';
    private string $mode = '';

    public function stream_open(string $path, string $mode, int $options, ?string &$opened_path): bool
    {
        $url = parse_url($path);
        $this->key = ltrim($url['path'], '/');
        $this->mode = $mode;
        $this->position = 0;

        if (str_contains($mode, 'r')) {
            // Reading mode
            $this->data = MemoryCache::get($this->key) ?? '';
            return true;
        } elseif (str_contains($mode, 'w') || str_contains($mode, 'a')) {
            // Writing mode
            $this->data = str_contains($mode, 'a') ? (MemoryCache::get($this->key) ?? '') : '';
            return true;
        }

        return false;
    }

    public function stream_read(int $count): string
    {
        $ret = substr($this->data, $this->position, $count);
        $this->position += strlen($ret);
        return $ret;
    }

    public function stream_write(string $data): int
    {
        $left = substr($this->data, 0, $this->position);
        $right = substr($this->data, $this->position + strlen($data));
        $this->data = $left . $data . $right;
        $this->position += strlen($data);
        return strlen($data);
    }

    public function stream_tell(): int
    {
        return $this->position;
    }

    public function stream_eof(): bool
    {
        return $this->position >= strlen($this->data);
    }

    public function stream_seek(int $offset, int $whence = SEEK_SET): bool
    {
        switch ($whence) {
            case SEEK_SET:
                $this->position = $offset;
                break;
            case SEEK_CUR:
                $this->position += $offset;
                break;
            case SEEK_END:
                $this->position = strlen($this->data) + $offset;
                break;
            default:
                return false;
        }
        return true;
    }

    public function stream_close(): void
    {
        if (str_contains($this->mode, 'w') || str_contains($this->mode, 'a')) {
            MemoryCache::set($this->key, $this->data);
        }
    }

    public function stream_stat(): array
    {
        return [
            'dev' => 0,
            'ino' => 0,
            'mode' => 0100644, // Regular file, readable/writable
            'nlink' => 1,
            'uid' => 0,
            'gid' => 0,
            'rdev' => 0,
            'size' => strlen($this->data),
            'atime' => time(),
            'mtime' => time(),
            'ctime' => time(),
            'blksize' => -1,
            'blocks' => -1,
        ];
    }

    public function url_stat(string $path, int $flags): array
    {
        $url = parse_url($path);
        $key = ltrim($url['path'], '/');

        if (!MemoryCache::exists($key)) {
            return [];
        }

        $data = MemoryCache::get($key) ?? '';
        return [
            'dev' => 0,
            'ino' => 0,
            'mode' => 0100644,
            'nlink' => 1,
            'uid' => 0,
            'gid' => 0,
            'rdev' => 0,
            'size' => strlen($data),
            'atime' => time(),
            'mtime' => time(),
            'ctime' => time(),
            'blksize' => -1,
            'blocks' => -1,
        ];
    }
}

// Register the custom wrapper
stream_wrapper_register('cache', CacheStreamWrapper::class);
?>
<?php
class ConfigStreamWrapper
{
    private static array $config = [];
    private string $data = '';
    private int $position = 0;

    public static function setConfig(array $config): void
    {
        self::$config = $config;
    }

    public function stream_open(string $path, string $mode, int $options, ?string &$opened_path): bool
    {
        $url = parse_url($path);
        $configPath = ltrim($url['path'], '/');

        // Navigate nested config using dot notation
        $value = self::$config;
        foreach (explode('.', $configPath) as $key) {
            if (!isset($value[$key])) {
                return false;
            }
            $value = $value[$key];
        }

        $this->data = is_string($value) ? $value : json_encode($value, JSON_PRETTY_PRINT);
        $this->position = 0;

        return true;
    }

    public function stream_read(int $count): string
    {
        $ret = substr($this->data, $this->position, $count);
        $this->position += strlen($ret);
        return $ret;
    }

    public function stream_eof(): bool
    {
        return $this->position >= strlen($this->data);
    }

    public function stream_tell(): int { return $this->position; }
    public function stream_seek(int $offset, int $whence = SEEK_SET): bool { /* Implementation */ return true; }
}

stream_wrapper_register('config', ConfigStreamWrapper::class);

// Setup configuration
ConfigStreamWrapper::setConfig([
    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'credentials' => [
            'username' => 'app_user',
            'password' => 'secure_password'
        ]
    ],
    'cache' => [
        'driver' => 'redis',
        'ttl' => 3600
    ]
]);

// Access nested configuration values
$dbHost = file_get_contents('config://database.host');
$credentials = json_decode(file_get_contents('config://database.credentials'), true);
$cacheConfig = json_decode(file_get_contents('config://cache'), true);

echo "Database: {$dbHost}:{$credentials['username']}\n";
echo "Cache TTL: {$cacheConfig['ttl']} seconds\n";
?>
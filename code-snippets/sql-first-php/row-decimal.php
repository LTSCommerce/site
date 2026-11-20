<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/src/Result/Row.php
// Simplified from src/Result/Row.php (int() inlines the private toInt() helper, and the
// patterns are written out rather than referenced as class constants)

final readonly class Row
{
    // ...

    public function decimal(string $key): string
    {
        $value = $this->get($key);          // throws, naming the key, if the column is missing

        if (\is_int($value)) {
            return (string)$value;
        }

        if (\is_string($value) && 1 === preg_match('/^-?\d+(\.\d+)?$/D', $value)) {
            return $value;                  // "5000.50" stays "5000.50"
        }

        // A float here means the column is FLOAT or DOUBLE, not DECIMAL, and the digits may
        // already be gone. Refuse it rather than format it into something plausible.
        throw RowException::forWrongType($key, 'an exact decimal string', $value);
    }

    public function int(string $key): int
    {
        $value = $this->get($key);

        if (\is_int($value)) {
            return $value;                  // what mysqlnd sends on PHP 8.1+
        }

        if (\is_string($value) && 1 === preg_match('/^-?\d+$/D', $value) && (string)(int)$value === $value) {
            return (int)$value;             // STRINGIFY_FETCHES, libmysqlclient or older PHP
        }

        throw RowException::forWrongType($key, 'int', $value);   // including NULL: no silent 0
    }
}

<?php

declare(strict_types=1);

// Example context sanitisation
$sanitizedContext = array_map(function ($value, $key) {
    if (in_array($key, ['password', 'token', 'secret'], true)) {
        return '[REDACTED]';
    }

    return $value;
}, $context, array_keys($context));

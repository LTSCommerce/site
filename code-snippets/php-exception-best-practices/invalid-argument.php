<?php

declare(strict_types=1);

namespace App\Example;

use InvalidArgumentException;

final class EmailAddress
{
    public function __construct(
        public readonly string $value,
    ) {
        // InvalidArgumentException: the argument is structurally wrong.
        // Caller passed something that could never be valid for this type.
        // Throw at the boundary — as early as possible — so the wrong value
        // never enters the domain.
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException(
                sprintf('Value "%s" is not a valid email address.', $value),
            );
        }
    }
}

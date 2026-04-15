<?php

declare(strict_types=1);

namespace App\Exception\Order;

use App\Exception\AppException;
use App\Exception\UserFacingExceptionInterface;
use App\Value\Sku;
use Throwable;

/**
 * ✅ GOOD — the *data* lives in typed, readable properties.
 *           The *message* is synthesised from them via a sprintf const.
 *
 * PHP 8.4 asymmetric visibility (`public private(set)`) lets callers read
 * the fields freely while only the class (and its factories) can set them.
 * No getters, no readonly footguns with inheritance, no magic string parsing.
 */
final class InsufficientStockException extends AppException implements UserFacingExceptionInterface
{
    /** sprintf format — the single source of truth for the wording. */
    public const string MESSAGE_FORMAT =
        'Insufficient stock for SKU %s: requested %d, only %d available.';

    public function __construct(
        public private(set) Sku $sku,
        public private(set) int $requested,
        public private(set) int $available,
        ?Throwable $previous = null,
    ) {
        parent::__construct(
            message: sprintf(self::MESSAGE_FORMAT, $sku->value, $requested, $available),
            previous: $previous,
        );
    }

    public static function create(Sku $sku, int $requested, int $available): self
    {
        return new self($sku, $requested, $available);
    }

    public static function createWithPrevious(
        Sku $sku,
        int $requested,
        int $available,
        Throwable $previous,
    ): self {
        return new self($sku, $requested, $available, $previous);
    }
}

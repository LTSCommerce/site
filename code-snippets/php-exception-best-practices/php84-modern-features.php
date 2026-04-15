<?php

declare(strict_types=1);

namespace App\Exception\Order;

use App\Exception\AppException;
use App\Exception\UserFacingExceptionInterface;
use App\Value\CustomerId;
use App\Value\OrderId;
use Throwable;

/**
 * A fully modern PHP 8.4 exception using:
 *
 *   - Asymmetric visibility  — `public private(set)` so properties are
 *                              readable anywhere but only this class
 *                              can set them (during construction).
 *   - Property hooks         — a computed `summary` property, derived
 *                              from the typed data. No getter soup.
 *   - `new` without parens   — chainable construction syntax.
 *   - Typed class constants  — `const string` for the sprintf template.
 *   - Named arguments        — clear call sites at factories.
 */
final class OrderRejectedException extends AppException implements UserFacingExceptionInterface
{
    public const string MESSAGE_FORMAT =
        'Order %s for customer %s was rejected: %s.';

    /** Computed, read-only-from-outside via a property hook. */
    public string $summary {
        get => sprintf('[%s→%s] %s', $this->customerId->value, $this->orderId->value, $this->reason);
    }

    public function __construct(
        public private(set) OrderId $orderId,
        public private(set) CustomerId $customerId,
        public private(set) string $reason,
        ?Throwable $previous = null,
    ) {
        parent::__construct(
            message: sprintf(self::MESSAGE_FORMAT, $orderId->value, $customerId->value, $reason),
            previous: $previous,
        );
    }

    public static function create(
        OrderId $orderId,
        CustomerId $customerId,
        string $reason,
    ): self {
        return new self(orderId: $orderId, customerId: $customerId, reason: $reason);
    }

    public static function createWithPrevious(
        OrderId $orderId,
        CustomerId $customerId,
        string $reason,
        Throwable $previous,
    ): self {
        return new self(
            orderId: $orderId,
            customerId: $customerId,
            reason: $reason,
            previous: $previous,
        );
    }
}

// Call sites read naturally — no getters, no casts.
// $e = OrderRejectedException::create($orderId, $customerId, 'duplicate');
// $e->summary;          // computed
// $e->orderId->value;   // readable
// $e->orderId = ...;    // ❌ compile error — asymmetric visibility

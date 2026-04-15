<?php

declare(strict_types=1);

namespace App\Exception\Payment;

use App\Exception\AppException;
use App\Exception\RetryableExceptionInterface;
use App\Exception\UserFacingExceptionInterface;
use App\Value\Money;
use App\Value\PaymentAttemptContext;
use Throwable;

/**
 * Composition — when an exception would otherwise need eight flat properties,
 * compose a typed value object instead. The exception carries ONE `context`
 * property whose fields are all typed, all readable, all testable.
 *
 * Benefits:
 *   - Exception signature stays tiny regardless of how rich the context is.
 *   - The context object can be reused by other parts of the system
 *     (logs, analytics, audit trail) — it is not trapped inside the
 *     exception class.
 *   - Adding a new field does not change the exception's constructor
 *     signature or break any factory call site.
 *
 * Inheritance is still shallow:
 *     \Exception → \RuntimeException → AppException → PaymentFailedException
 *                                                   (concrete, final)
 */
final class PaymentFailedException extends AppException implements
    UserFacingExceptionInterface,
    RetryableExceptionInterface
{
    public const string MESSAGE_FORMAT =
        'Payment of %s failed for customer %s at gateway "%s" (reason: %s).';

    public function __construct(
        public private(set) PaymentAttemptContext $context,
        ?Throwable $previous = null,
    ) {
        parent::__construct(
            message: sprintf(
                self::MESSAGE_FORMAT,
                $context->amount->format(),
                $context->customerId->value,
                $context->gatewayName,
                $context->reasonCode,
            ),
            previous: $previous,
        );
    }

    public static function create(PaymentAttemptContext $context): self
    {
        return new self($context);
    }

    public static function createWithPrevious(
        PaymentAttemptContext $context,
        Throwable $previous,
    ): self {
        return new self($context, $previous);
    }
}

/**
 * The composed value object lives in App\Value\PaymentAttemptContext —
 * reused by the exception, the audit log writer, and the analytics event
 * publisher. Each consumer gets the typed fields it cares about without
 * the exception having to grow N public properties.
 *
 * readonly final class PaymentAttemptContext {
 *     public function __construct(
 *         public Money $amount,
 *         public CustomerId $customerId,
 *         public string $gatewayName,
 *         public string $reasonCode,
 *         public ?string $gatewayTransactionId = null,
 *     ) {}
 * }
 */

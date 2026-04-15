<?php

declare(strict_types=1);

namespace App\Exception;

use Throwable;

/**
 * Composition — a trait that gives any exception the standard boilerplate:
 *
 *   - a MESSAGE_FORMAT constant contract (enforced at compile time)
 *   - named static factories that synthesise the message for you
 *
 * Concrete exceptions use this trait AND extend the shallow base class.
 * They get the full pattern without inheritance going deeper than one level.
 */
trait ProvidesMessageFormatTrait
{
    /**
     * Every exception that uses this trait must publish a MESSAGE_FORMAT
     * constant on the class. PHPStan's `constantsOfClasses` check enforces
     * the contract statically.
     *
     * @param array<int, scalar> $args
     */
    protected static function format(array $args): string
    {
        return sprintf(static::MESSAGE_FORMAT, ...$args);
    }

    /** @param array<int, scalar> $args */
    protected static function buildMessage(array $args, ?Throwable $previous): static
    {
        return new static(
            message: self::format($args),
            code: 0,
            previous: $previous,
        );
    }
}

/**
 * Concrete exceptions that use the trait stay ONE level deep:
 *
 *     final class InsufficientStockException extends AppException {
 *         use ProvidesMessageFormatTrait;
 *         public const string MESSAGE_FORMAT = '...';
 *
 *         public static function create(Sku $sku, int $r, int $a): self { ... }
 *     }
 *
 * No mid-tier abstract bases. No "OrderStockException" layer. The marker
 * interfaces handle cross-cutting categorisation; the trait handles shared
 * mechanical boilerplate.
 */

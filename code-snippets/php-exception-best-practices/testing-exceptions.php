<?php

declare(strict_types=1);

namespace App\Tests\Exception;

use App\Exception\Order\InsufficientStockException;
use App\Value\Sku;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class InsufficientStockExceptionTest extends TestCase
{
    #[Test]
    public function it_exposes_the_stock_data_as_properties(): void
    {
        $sku = new Sku('ABC-42');
        $exception = InsufficientStockException::create($sku, requested: 10, available: 3);

        // Assert on PROPERTIES — not message strings.
        self::assertSame($sku, $exception->sku);
        self::assertSame(10, $exception->requested);
        self::assertSame(3, $exception->available);
    }

    #[Test]
    public function its_message_uses_the_published_format_constant(): void
    {
        $exception = InsufficientStockException::create(new Sku('ABC-42'), 10, 3);

        // Reproduce the expected message from the same constant the production
        // code uses. Change the wording in one place → test still passes.
        // No magic string hard-coded in the assertion.
        $expected = sprintf(
            InsufficientStockException::MESSAGE_FORMAT,
            'ABC-42',
            10,
            3,
        );
        self::assertSame($expected, $exception->getMessage());
    }

    #[Test]
    public function it_preserves_the_previous_exception_for_debugging(): void
    {
        $previous = new \RuntimeException('gateway exploded');
        $exception = InsufficientStockException::createWithPrevious(
            new Sku('ABC-42'), 10, 3, $previous,
        );

        self::assertSame($previous, $exception->getPrevious());
    }
}

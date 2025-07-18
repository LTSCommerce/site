<?php

declare(strict_types=1);

namespace Tests\Unit\Services\Order;

use App\Testing\{OrderDataBuilder, PaymentResultBuilder};
use PHPUnit\Framework\Attributes\{Test, TestDox};
use PHPUnit\Framework\TestCase;

final class OrderServiceTest extends TestCase
{
    #[Test]
    #[TestDox('Successfully processes valid order with payment')]
    public function processOrder_WithValidData_CreatesOrderAndProcessesPayment(): void
    {
        // Arrange
        $orderData = OrderDataBuilder::new()
            ->withCustomer(CustomerId::fromString('cust_123'))
            ->withItems([
                OrderItemBuilder::new()->withProduct('prod_456')->build(),
            ])
            ->build();

        $paymentResult = PaymentResultBuilder::successful()
            ->withTransactionId('txn_789')
            ->build();

        $this->paymentGateway->shouldReceive('charge')
            ->once()
            ->with(Money::fromCents(1000), $orderData->paymentMethod)
            ->andReturn($paymentResult);

        // Act
        $order = $this->orderService->processOrder($orderData);

        // Assert
        $this->assertInstanceOf(Order::class, $order);
        $this->assertTrue($order->isPaid());
        $this->assertEquals('txn_789', $order->transactionId->value);

        $this->repository->shouldHaveReceived('save')
            ->once()
            ->with($order);

        $this->eventDispatcher->shouldHaveReceived('dispatch')
            ->once()
            ->with(\Mockery::type(OrderPlaced::class));
    }
}

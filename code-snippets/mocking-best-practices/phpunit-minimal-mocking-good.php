<?php
// GOOD: Minimal mocking focused on external dependencies and side effects
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class OrderServiceMinimalMockingTest extends TestCase
{
    private OrderService $orderService;

    public function testProcessOrderSuccessfully(): void
    {
        // Mock only external dependencies and side effects
        $paymentGateway = $this->createMock(PaymentGateway::class);
        $emailService = $this->createMock(EmailService::class);
        $inventoryService = $this->createMock(InventoryService::class);
        $auditLogger = $this->createMock(AuditLogger::class);

        // Use REAL implementations for business logic classes
        $priceCalculator = new PriceCalculator();
        $discountEngine = new DiscountEngine();
        $taxCalculator = new TaxCalculator();

        $this->orderService = new OrderService(
            $paymentGateway,
            $emailService,
            $inventoryService,
            $auditLogger,
            $priceCalculator,    // Real implementation - test the actual logic!
            $discountEngine,     // Real implementation - test the actual logic! 
            $taxCalculator       // Real implementation - test the actual logic!
        );

        // Arrange
        $orderData = [
            'id' => '123',
            'customer_email' => 'test@example.com',
            'items' => [
                ['id' => 'item1', 'quantity' => 2, 'price' => 25.00],
                ['id' => 'item2', 'quantity' => 1, 'price' => 50.00]
            ],
            'discount_code' => 'SAVE10'
        ];

        // Mock only external systems and side effects
        $inventoryService->method('checkStock')->willReturn(true);
        $inventoryService->method('reserveItems')->willReturn(['success' => true]);
        
        $paymentGateway->method('processPayment')->willReturn([
            'success' => true,
            'transaction_id' => 'tx123'
        ]);

        $emailService->method('send')->willReturn(true);
        
        // Don't mock the logger's format method - just the actual logging
        $auditLogger->method('log')->willReturn(null);

        // Act
        $result = $this->orderService->processOrder($orderData);

        // Assert - Focus on business outcomes, not implementation details
        $this->assertTrue($result['success']);
        $this->assertEquals('123', $result['order_id']);
        
        // Test the REAL calculation results
        $this->assertEquals(90.00, $result['subtotal']); // 2*25 + 1*50 - 10% discount
        $this->assertEquals(9.00, $result['tax']);       // 10% tax on discounted amount
        $this->assertEquals(99.00, $result['total']);    // subtotal + tax

        // Verify only the critical external interactions
        $this->assertTrue($paymentGateway->wasCalledWith('processPayment', [
            'amount' => 99.00,
            'currency' => 'USD'
        ]));
        
        $this->assertTrue($emailService->wasCalledWith('send', [
            'to' => 'test@example.com',
            'subject' => 'Order Confirmation'
            // Don't assert on email content - that's tested elsewhere
        ]));
    }

    public function testProcessOrderWithPaymentFailure(): void
    {
        // Mock only the failing external dependency
        $paymentGateway = $this->createMock(PaymentGateway::class);
        $paymentGateway->method('processPayment')
            ->willThrowException(new PaymentException('Card declined'));

        // Use real implementations for everything else
        $emailService = new EmailService();
        $inventoryService = new InventoryService();
        $auditLogger = new AuditLogger();
        $priceCalculator = new PriceCalculator();
        $discountEngine = new DiscountEngine();
        $taxCalculator = new TaxCalculator();

        $this->orderService = new OrderService(
            $paymentGateway,
            $emailService,
            $inventoryService,
            $auditLogger,
            $priceCalculator,
            $discountEngine,
            $taxCalculator
        );

        // Arrange
        $orderData = [
            'id' => '456',
            'customer_email' => 'test@example.com',
            'items' => [['id' => 'item1', 'quantity' => 1, 'price' => 25.00]]
        ];

        // Act & Assert
        $this->expectException(PaymentException::class);
        $this->expectExceptionMessage('Card declined');
        
        $this->orderService->processOrder($orderData);
    }

    public function testCalculateOrderTotalWithComplexDiscounts(): void
    {
        // When testing business logic, use minimal or no mocking!
        $paymentGateway = $this->createStub(PaymentGateway::class);
        $emailService = $this->createStub(EmailService::class);
        $inventoryService = $this->createStub(InventoryService::class);
        $auditLogger = $this->createStub(AuditLogger::class);

        // Real implementations to test actual business logic
        $priceCalculator = new PriceCalculator();
        $discountEngine = new DiscountEngine();
        $taxCalculator = new TaxCalculator();

        $this->orderService = new OrderService(
            $paymentGateway,
            $emailService,
            $inventoryService,
            $auditLogger,
            $priceCalculator,
            $discountEngine,
            $taxCalculator
        );

        // Test complex discount scenarios with real logic
        $orderData = [
            'id' => '789',
            'customer_email' => 'test@example.com',
            'items' => [
                ['id' => 'premium_item', 'quantity' => 1, 'price' => 100.00],
                ['id' => 'regular_item', 'quantity' => 3, 'price' => 20.00]
            ],
            'discount_codes' => ['PREMIUM15', 'BULK5'],
            'customer_tier' => 'gold'
        ];

        $result = $this->orderService->calculateOrderTotal($orderData);

        // Assert on the actual business logic calculations
        $this->assertEquals(160.00, $result['original_total']); // 100 + 3*20
        $this->assertEquals(136.00, $result['discounted_total']); // Complex discount calculation
        $this->assertEquals(13.60, $result['tax']);
        $this->assertEquals(149.60, $result['final_total']);
        
        // Verify discount breakdown
        $this->assertCount(3, $result['applied_discounts']); // Premium, bulk, and tier discounts
        $this->assertEquals(24.00, $result['total_discount_amount']);
    }
}
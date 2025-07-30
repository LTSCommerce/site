<?php
// BAD: Over-mocked PHPUnit test that's brittle and unclear
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class OrderServiceOverMockedTest extends TestCase
{
    private OrderService $orderService;
    private MockObject $paymentGateway;
    private MockObject $emailService;
    private MockObject $inventoryService;
    private MockObject $auditLogger;
    private MockObject $priceCalculator; // Even mocking simple calculations!
    private MockObject $discountEngine;  // Mocking business logic!
    private MockObject $taxCalculator;   // Mocking pure functions!

    protected function setUp(): void
    {
        parent::setUp();

        // Mocking EVERYTHING - even simple utilities and business logic
        $this->paymentGateway = $this->createMock(PaymentGateway::class);
        $this->emailService = $this->createMock(EmailService::class);
        $this->inventoryService = $this->createMock(InventoryService::class);
        $this->auditLogger = $this->createMock(AuditLogger::class);
        $this->priceCalculator = $this->createMock(PriceCalculator::class);
        $this->discountEngine = $this->createMock(DiscountEngine::class);
        $this->taxCalculator = $this->createMock(TaxCalculator::class);

        $this->orderService = new OrderService(
            $this->paymentGateway,
            $this->emailService,
            $this->inventoryService,
            $this->auditLogger,
            $this->priceCalculator,
            $this->discountEngine,
            $this->taxCalculator
        );
    }

    public function testProcessOrderSuccessfully(): void
    {
        // Arrange - SO MANY MOCK CONFIGURATIONS!
        $orderData = [
            'id' => '123',
            'customer_email' => 'test@example.com',
            'items' => [['id' => 'item1', 'quantity' => 2]]
        ];

        // Mocking every single method call - testing implementation, not behavior
        $this->inventoryService
            ->expects($this->once())
            ->method('checkStock')
            ->with(['item1'])
            ->willReturn(true);

        $this->inventoryService
            ->expects($this->once())
            ->method('reserveItems')
            ->with($orderData['items'])
            ->willReturn(['success' => true]);

        // These shouldn't be mocked - they're business logic!
        $this->priceCalculator
            ->expects($this->once())
            ->method('calculateSubtotal')
            ->with($orderData['items'])
            ->willReturn(100.00);

        $this->discountEngine
            ->expects($this->once())
            ->method('applyDiscounts')
            ->with(100.00, $orderData)
            ->willReturn(90.00);

        $this->taxCalculator
            ->expects($this->once())
            ->method('calculateTax')
            ->with(90.00)
            ->willReturn(9.00);

        // Even mocking formatting functions!
        $this->priceCalculator
            ->expects($this->once())
            ->method('formatCurrency')
            ->with(99.00)
            ->willReturn('$99.00');

        $this->paymentGateway
            ->expects($this->once())
            ->method('processPayment')
            ->with($this->callback(function ($payment) {
                return $payment['amount'] === 99.00;
            }))
            ->willReturn(['success' => true, 'transaction_id' => 'tx123']);

        // Mocking template rendering instead of testing it!
        $this->emailService
            ->expects($this->once())
            ->method('renderTemplate')
            ->with('order_confirmation', $this->anything())
            ->willReturn('<html>Confirmation email content</html>');

        $this->emailService
            ->expects($this->once())
            ->method('send')
            ->with('test@example.com', 'Order Confirmation', '<html>Confirmation email content</html>')
            ->willReturn(true);

        // Even mocking log message formatting!
        $this->auditLogger
            ->expects($this->once())
            ->method('formatLogMessage')
            ->with('ORDER_PROCESSED', $this->anything())
            ->willReturn('Order 123 processed successfully');

        $this->auditLogger
            ->expects($this->once())
            ->method('log')
            ->with('info', 'Order 123 processed successfully');

        // Act
        $result = $this->orderService->processOrder($orderData);

        // Assert - Only testing the final result, but the test is incredibly brittle
        $this->assertTrue($result['success']);
        $this->assertEquals('123', $result['order_id']);
    }

    public function testProcessOrderWithInvalidDiscount(): void
    {
        // This test breaks when we change internal discount calculation logic
        // even though the external behavior is the same!
        
        $orderData = ['id' => '456', 'items' => [['id' => 'item1', 'quantity' => 1]]];

        $this->inventoryService->method('checkStock')->willReturn(true);
        $this->inventoryService->method('reserveItems')->willReturn(['success' => true]);
        $this->priceCalculator->method('calculateSubtotal')->willReturn(50.00);
        
        // This test is coupled to internal implementation details
        $this->discountEngine
            ->expects($this->once())
            ->method('applyDiscounts')
            ->willThrowException(new InvalidDiscountException('Invalid discount code'));

        $this->expectException(InvalidDiscountException::class);
        $this->orderService->processOrder($orderData);
    }
}
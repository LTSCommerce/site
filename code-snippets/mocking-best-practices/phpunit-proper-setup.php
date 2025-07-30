<?php
// GOOD: Proper setUp() with intersection typed properties
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

interface PaymentServiceInterface
{
    public function processPayment(float $amount): array;
}

class OrderServiceTest extends TestCase
{
    // KEY POINT: Intersection types with MockObject
    private PaymentServiceInterface&MockObject $paymentService;
    private OrderService $orderService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create mock with proper intersection typing
        $this->paymentService = $this->createMock(PaymentServiceInterface::class);
        $this->orderService = new OrderService($this->paymentService);
    }

    public function testProcessPayment(): void
    {
        // Now you get full type safety for both interface methods AND mock methods
        $this->paymentService->method('processPayment')  // MockObject method
            ->willReturn(['success' => true]);            // MockObject method
        
        $result = $this->orderService->processOrder(100.00);
        
        $this->assertTrue($result['success']);
    }
}
<?php
// GOOD: Simple PHP test with proper setUp() and intersection typed properties
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

// Simple interfaces - PHP uses Interface suffix
interface PaymentServiceInterface
{
    public function processPayment(float $amount): array;
}

interface LoggerInterface  
{
    public function log(string $message): void;
}

// Simple service class
final class OrderService
{
    public function __construct(
        private PaymentServiceInterface $paymentService,
        private LoggerInterface $logger
    ) {}

    public function createOrder(float $amount): array
    {
        $this->logger->log("Processing order for $amount");
        
        $result = $this->paymentService->processPayment($amount);
        
        if ($result['success']) {
            $this->logger->log("Order processed successfully");
        }
        
        return $result;
    }
}

// GOOD: Proper test setup with intersection typed properties
class OrderServiceTest extends TestCase
{
    private PaymentServiceInterface&MockObject $paymentService;
    private LoggerInterface&MockObject $logger;
    private OrderService $orderService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create mocks in setUp() - clean and reusable
        $this->paymentService = $this->createMock(PaymentServiceInterface::class);
        $this->logger = $this->createMock(LoggerInterface::class);
        
        // Create service under test
        $this->orderService = new OrderService($this->paymentService, $this->logger);
    }

    public function testCreateOrderSuccess(): void
    {
        // Arrange
        $this->paymentService->method('processPayment')
            ->willReturn(['success' => true, 'transaction_id' => 'tx123']);
        
        $this->logger->expects($this->exactly(2))
            ->method('log')
            ->withConsecutive(
                ['Processing order for 100'],
                ['Order processed successfully']
            );

        // Act
        $result = $this->orderService->createOrder(100.00);

        // Assert
        $this->assertTrue($result['success']);
        $this->assertEquals('tx123', $result['transaction_id']);
    }

    public function testCreateOrderFailure(): void
    {
        // Arrange
        $this->paymentService->method('processPayment')
            ->willReturn(['success' => false, 'error' => 'Card declined']);
        
        // Only expect first log call since payment fails
        $this->logger->expects($this->once())
            ->method('log')
            ->with('Processing order for 50');

        // Act
        $result = $this->orderService->createOrder(50.00);

        // Assert
        $this->assertFalse($result['success']);
        $this->assertEquals('Card declined', $result['error']);
    }
}
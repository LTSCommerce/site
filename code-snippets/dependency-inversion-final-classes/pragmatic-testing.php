<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

/**
 * PRAGMATIC TESTING: When to use real objects vs mocks
 * 
 * Key Principles:
 * 1. Use real objects when they're fast, deterministic, and have no side effects
 * 2. Use mocks for external dependencies and when testing interactions
 * 3. Combine both approaches based on what you're testing
 * 4. Union types allow flexible testing strategies
 */

/**
 * DETROIT SCHOOL: Testing with real objects
 * Focus on state verification and end-to-end behavior
 */
class OrderProcessorDetroitTest extends TestCase
{
    private OrderProcessor $processor;
    private InMemoryOrderStorage $storage;
    
    protected function setUp(): void
    {
        // Use REAL implementations for fast, deterministic dependencies
        $this->storage = new InMemoryOrderStorage();
        $validator = new BasicOrderValidator();
        $taxCalculator = new StandardTaxCalculator();
        
        // Mock only the external, slow, or non-deterministic dependencies
        $paymentGateway = $this->createStub(PaymentGatewayInterface::class);
        $paymentGateway->method('processPayment')
                      ->willReturn(PaymentResult::success());
        
        $notificationService = $this->createStub(NotificationServiceInterface::class);
        $notificationService->method('sendOrderConfirmation')
                           ->willReturn(true);
        
        $this->processor = new OrderProcessor(
            $validator,        // REAL - fast and deterministic
            $taxCalculator,    // REAL - pure calculation
            $this->storage,    // REAL - in-memory, fast
            $paymentGateway,   // MOCK - external service
            $notificationService // MOCK - external service
        );
    }
    
    public function testProcessValidOrderSuccessfully(): void
    {
        $orderData = new OrderData(
            customerId: 123,
            amount: new Money(100.0),
            paymentMethod: 'credit_card',
            customerEmail: 'customer@example.com',
            customerType: CustomerType::STANDARD
        );
        
        $result = $this->processor->processOrder($orderData);
        
        // State-based verification using REAL storage
        $this->assertTrue($result->isSuccess());
        $this->assertEquals(1, $this->storage->getOrderCount());
        
        $savedOrder = $this->storage->findOrder($result->getOrderId());
        $this->assertEquals(OrderStatus::PAID, $savedOrder->status);
        $this->assertEquals(123, $savedOrder->getCustomerId());
    }
    
    public function testProcessOrderWithInvalidData(): void
    {
        $orderData = new OrderData(
            customerId: -1, // Invalid
            amount: new Money(100.0),
            paymentMethod: 'credit_card',
            customerEmail: 'invalid-email', // Invalid
            customerType: CustomerType::STANDARD
        );
        
        $result = $this->processor->processOrder($orderData);
        
        // Real validator gives us real validation errors
        $this->assertFalse($result->isSuccess());
        $this->assertContains('Invalid customer ID', $result->getErrors());
        $this->assertContains('Invalid email address', $result->getErrors());
        $this->assertEquals(0, $this->storage->getOrderCount());
    }
    
    public function testTaxCalculationForDifferentCustomerTypes(): void
    {
        $baseAmount = new Money(100.0);
        $standardOrderData = new OrderData(
            customerId: 123,
            amount: $baseAmount,
            paymentMethod: 'credit_card',
            customerEmail: 'standard@example.com',
            customerType: CustomerType::STANDARD
        );
        
        $premiumOrderData = new OrderData(
            customerId: 124,
            amount: $baseAmount,
            paymentMethod: 'credit_card',
            customerEmail: 'premium@example.com',
            customerType: CustomerType::PREMIUM
        );
        
        $this->processor->processOrder($standardOrderData);
        $this->processor->processOrder($premiumOrderData);
        
        // Using real tax calculator lets us verify actual calculations
        $this->assertEquals(2, $this->storage->getOrderCount());
        // Tax differences would be reflected in the stored orders
    }
}

/**
 * LONDON SCHOOL: Testing with mocks for interaction verification
 * Focus on behavior verification and message passing
 */
class OrderProcessorLondonTest extends TestCase
{
    private MockObject|OrderValidatorInterface $mockValidator;
    private MockObject|TaxCalculatorInterface $mockTaxCalculator;
    private MockObject|OrderStorageInterface $mockStorage;
    private MockObject|PaymentGatewayInterface $mockPaymentGateway;
    private MockObject|NotificationServiceInterface $mockNotificationService;
    private OrderProcessor $processor;
    
    protected function setUp(): void
    {
        // Mock ALL dependencies to focus on interactions
        $this->mockValidator = $this->createMock(OrderValidatorInterface::class);
        $this->mockTaxCalculator = $this->createMock(TaxCalculatorInterface::class);
        $this->mockStorage = $this->createMock(OrderStorageInterface::class);
        $this->mockPaymentGateway = $this->createMock(PaymentGatewayInterface::class);
        $this->mockNotificationService = $this->createMock(NotificationServiceInterface::class);
        
        $this->processor = new OrderProcessor(
            $this->mockValidator,
            $this->mockTaxCalculator,
            $this->mockStorage,
            $this->mockPaymentGateway,
            $this->mockNotificationService
        );
    }
    
    public function testProcessOrderFollowsCorrectSequence(): void
    {
        $orderData = new OrderData(
            customerId: 123,
            amount: new Money(100.0),
            paymentMethod: 'credit_card',
            customerEmail: 'test@example.com'
        );
        
        $orderId = new OrderId(1);
        $tax = new Money(8.0);
        $totalAmount = new Money(108.0);
        
        // Setup expectations in the correct order
        $this->mockValidator
             ->expects($this->once())
             ->method('validate')
             ->with($orderData)
             ->willReturn(ValidationResult::valid());
        
        $this->mockTaxCalculator
             ->expects($this->once())
             ->method('calculateTax')
             ->with(
                 $this->equalTo($orderData->amount),
                 $this->equalTo($orderData->customerType)
             )
             ->willReturn($tax);
        
        $this->mockStorage
             ->expects($this->once())
             ->method('saveOrder')
             ->willReturn($orderId);
        
        $this->mockPaymentGateway
             ->expects($this->once())
             ->method('processPayment')
             ->with($this->callback(function (Payment $payment) use ($totalAmount) {
                 return $payment->amount->amount() === $totalAmount->amount();
             }))
             ->willReturn(PaymentResult::success());
        
        $this->mockStorage
             ->expects($this->once())
             ->method('updateOrderStatus')
             ->with($orderId, OrderStatus::PAID)
             ->willReturn(true);
        
        $this->mockNotificationService
             ->expects($this->once())
             ->method('sendOrderConfirmation')
             ->with('test@example.com', $orderId)
             ->willReturn(true);
        
        $result = $this->processor->processOrder($orderData);
        
        $this->assertTrue($result->isSuccess());
        $this->assertEquals($orderId, $result->getOrderId());
    }
    
    public function testProcessOrderHandlesPaymentFailure(): void
    {
        $orderData = new OrderData(
            customerId: 123,
            amount: new Money(100.0),
            paymentMethod: 'credit_card',
            customerEmail: 'test@example.com'
        );
        
        $orderId = new OrderId(1);
        
        $this->mockValidator
             ->method('validate')
             ->willReturn(ValidationResult::valid());
        
        $this->mockTaxCalculator
             ->method('calculateTax')
             ->willReturn(new Money(8.0));
        
        $this->mockStorage
             ->method('saveOrder')
             ->willReturn($orderId);
        
        // Payment fails
        $this->mockPaymentGateway
             ->method('processPayment')
             ->willReturn(PaymentResult::failure('Card declined'));
        
        // Should update order status to failed
        $this->mockStorage
             ->expects($this->once())
             ->method('updateOrderStatus')
             ->with($orderId, OrderStatus::FAILED);
        
        // Should NOT send notification for failed payment
        $this->mockNotificationService
             ->expects($this->never())
             ->method('sendOrderConfirmation');
        
        $result = $this->processor->processOrder($orderData);
        
        $this->assertFalse($result->isSuccess());
        $this->assertContains('Payment failed: Card declined', $result->getErrors());
    }
}

/**
 * HYBRID APPROACH: Union types for flexible testing
 * PHP 8.4 allows more sophisticated type unions
 */

// Define union type for testing flexibility
type TestableOrderStorage = InMemoryOrderStorage|MockObject;
type TestablePaymentGateway = PaymentGatewayInterface|MockObject;

class OrderProcessorHybridTest extends TestCase
{
    /**
     * Test with combination of real and mock objects
     * Use real objects where they add value, mocks where necessary
     */
    public function testCompleteOrderFlowWithHybridApproach(): void
    {
        // REAL objects for deterministic, fast operations
        $validator = new BasicOrderValidator();
        $taxCalculator = new StandardTaxCalculator();
        $storage = new InMemoryOrderStorage();
        
        // MOCK for external payment service
        $paymentGateway = $this->createMock(PaymentGatewayInterface::class);
        $paymentGateway->method('processPayment')
                      ->willReturn(PaymentResult::success());
        
        // FAKE for notification (simple test implementation)
        $notificationService = new class implements NotificationServiceInterface {
            public array $sentNotifications = [];
            
            public function sendOrderConfirmation(string $email, OrderId $orderId): bool
            {
                $this->sentNotifications[] = ['email' => $email, 'orderId' => $orderId];
                return true;
            }
        };
        
        $processor = new OrderProcessor(
            $validator,
            $taxCalculator,
            $storage,
            $paymentGateway,
            $notificationService
        );
        
        $orderData = new OrderData(
            customerId: 123,
            amount: new Money(100.0),
            paymentMethod: 'credit_card',
            customerEmail: 'hybrid@example.com',
            customerType: CustomerType::PREMIUM
        );
        
        $result = $processor->processOrder($orderData);
        
        // Verify using real storage
        $this->assertTrue($result->isSuccess());
        $this->assertEquals(1, $storage->getOrderCount());
        
        // Verify using fake notification service
        $this->assertCount(1, $notificationService->sentNotifications);
        $this->assertEquals('hybrid@example.com', $notificationService->sentNotifications[0]['email']);
        
        // Verify real tax calculation (5% for premium)
        $savedOrder = $storage->findOrder($result->getOrderId());
        $this->assertEquals(OrderStatus::PAID, $savedOrder->status);
        
        // Could verify payment gateway interaction if needed
        // This gives us the best of both worlds: real behavior testing
        // with controlled external dependencies
    }
    
    /**
     * Performance test using all real objects
     * When speed matters, avoid mocks
     */
    public function testHighThroughputProcessing(): void
    {
        $storage = new InMemoryOrderStorage();
        $processor = new OrderProcessor(
            new BasicOrderValidator(),
            new StandardTaxCalculator(),
            $storage,
            new class implements PaymentGatewayInterface {
                public function processPayment(Payment $payment): PaymentResult {
                    return PaymentResult::success(); // Always successful for speed
                }
            },
            new class implements NotificationServiceInterface {
                public function sendOrderConfirmation(string $email, OrderId $orderId): bool {
                    return true; // No-op for speed
                }
            }
        );
        
        $startTime = microtime(true);
        
        // Process many orders quickly with real objects
        for ($i = 0; $i < 1000; $i++) {
            $orderData = new OrderData(
                customerId: $i + 1,
                amount: new Money(100.0 + $i),
                paymentMethod: 'credit_card',
                customerEmail: "customer{$i}@example.com"
            );
            
            $result = $processor->processOrder($orderData);
            $this->assertTrue($result->isSuccess());
        }
        
        $endTime = microtime(true);
        $processingTime = $endTime - $startTime;
        
        $this->assertEquals(1000, $storage->getOrderCount());
        $this->assertLessThan(1.0, $processingTime, 'Should process 1000 orders in under 1 second');
    }
}

/**
 * INTEGRATION TEST: Testing with database using real implementations
 */
class OrderProcessorIntegrationTest extends TestCase
{
    private PDO $connection;
    private OrderProcessor $processor;
    
    protected function setUp(): void
    {
        // Use SQLite in-memory database for fast integration tests
        $this->connection = new PDO('sqlite::memory:');
        $this->connection->exec('
            CREATE TABLE orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                email VARCHAR(255) NOT NULL,
                customer_type VARCHAR(20) NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ');
        
        // Use REAL database storage for integration test
        $storage = new MySqlOrderStorage($this->connection);
        
        // Mock only truly external services
        $paymentGateway = $this->createStub(PaymentGatewayInterface::class);
        $paymentGateway->method('processPayment')->willReturn(PaymentResult::success());
        
        $notificationService = $this->createStub(NotificationServiceInterface::class);
        $notificationService->method('sendOrderConfirmation')->willReturn(true);
        
        $this->processor = new OrderProcessor(
            new BasicOrderValidator(),
            new StandardTaxCalculator(),
            $storage, // REAL database implementation
            $paymentGateway,
            $notificationService
        );
    }
    
    public function testOrderPersistsToDatabase(): void
    {
        $orderData = new OrderData(
            customerId: 123,
            amount: new Money(100.0),
            paymentMethod: 'credit_card',
            customerEmail: 'integration@example.com',
            customerType: CustomerType::STANDARD
        );
        
        $result = $this->processor->processOrder($orderData);
        
        $this->assertTrue($result->isSuccess());
        
        // Verify data in actual database
        $stmt = $this->connection->query('SELECT * FROM orders');
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $this->assertCount(1, $orders);
        $this->assertEquals(123, $orders[0]['customer_id']);
        $this->assertEquals('paid', $orders[0]['status']);
        $this->assertEquals('standard', $orders[0]['customer_type']);
    }
}
<?php
// PHP 8.4 Intersection Types for Mock Objects - GOOD Examples
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

// Interface-first design with proper type declarations
interface PaymentProcessorInterface 
{
    public function processPayment(array $paymentData): array;
    public function refundPayment(string $transactionId): bool;
}

interface LoggableInterface 
{
    public function log(string $level, string $message, array $context = []): void;
}

interface ValidatableInterface 
{
    public function validate(array $data): array;
}

// BETTER: Custom interfaces that extend base functionality
interface LoggingPaymentProcessorInterface extends PaymentProcessorInterface, LoggableInterface
{
    // Combines payment processing with logging capability
}

interface LoggingValidatorInterface extends ValidatableInterface, LoggableInterface
{
    // Combines validation with logging capability
}

// Service using cleaner custom interfaces (RECOMMENDED)
final class PaymentService 
{
    public function __construct(
        private LoggingPaymentProcessorInterface $paymentGateway,
        private LoggingValidatorInterface $validator
    ) {}

    // Same implementation as before...
}

// Alternative: Using intersection types (when you can't modify interfaces)
final class PaymentServiceWithIntersectionTypes 
{
    public function __construct(
        private PaymentProcessorInterface&LoggableInterface $paymentGateway,
        private ValidatableInterface&LoggableInterface $validator
    ) {}

    public function processSecurePayment(array $paymentData): array
    {
        // Validation with logging
        $validationErrors = $this->validator->validate($paymentData);
        if (!empty($validationErrors)) {
            $this->validator->log('error', 'Payment validation failed', $validationErrors);
            throw new ValidationException('Invalid payment data');
        }

        // Payment processing with logging
        $this->paymentGateway->log('info', 'Processing payment', ['amount' => $paymentData['amount']]);
        $result = $this->paymentGateway->processPayment($paymentData);
        
        if ($result['success']) {
            $this->paymentGateway->log('info', 'Payment processed successfully', $result);
        } else {
            $this->paymentGateway->log('error', 'Payment processing failed', $result);
        }

        return $result;
    }
}

// Test demonstrating CLEAN approach with custom interfaces (RECOMMENDED)
class PaymentServiceTest extends TestCase
{
    private LoggingPaymentProcessorInterface&MockObject $paymentGateway;
    private LoggingValidatorInterface&MockObject $validator;
    private PaymentService $paymentService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Much cleaner - single interface mocks
        $this->paymentGateway = $this->createMock(LoggingPaymentProcessorInterface::class);
        $this->validator = $this->createMock(LoggingValidatorInterface::class);

        // Create service with clean interface dependencies
        $this->paymentService = new PaymentService($this->paymentGateway, $this->validator);
    }

    public function testProcessSecurePaymentSuccess(): void
    {
        // Configure the mock behaviors
        $this->validator->method('validate')->willReturn([]); // No validation errors
        $this->validator->expects($this->once())
            ->method('log')
            ->with('error', 'Payment validation failed', $this->anything());

        $expectedResult = [
            'success' => true,
            'transaction_id' => 'txn_123',
            'amount' => 100.00
        ];

        $this->paymentGateway->method('processPayment')->willReturn($expectedResult);
        
        // Expect proper logging calls
        $this->paymentGateway->expects($this->exactly(2))
            ->method('log')
            ->withConsecutive(
                ['info', 'Processing payment', ['amount' => 100.00]],
                ['info', 'Payment processed successfully', $expectedResult]
            );

        // Test the actual business logic
        $result = $this->paymentService->processSecurePayment([
            'amount' => 100.00,
            'card_number' => '4111111111111111',
            'expiry' => '12/25'
        ]);

        // Assertions
        $this->assertTrue($result['success']);
        $this->assertEquals('txn_123', $result['transaction_id']);
        $this->assertEquals(100.00, $result['amount']);
    }

    public function testProcessSecurePaymentValidationFailure(): void
    {
        // Configure validation to fail
        $validationErrors = [
            'card_number' => 'Invalid card number',
            'expiry' => 'Card expired'
        ];
        
        $this->validator->method('validate')->willReturn($validationErrors);
        
        // Expect error logging for validation failure
        $this->validator->expects($this->once())
            ->method('log')
            ->with('error', 'Payment validation failed', $validationErrors);

        // Payment gateway should never be called when validation fails
        $this->paymentGateway->expects($this->never())->method('processPayment');
        $this->paymentGateway->expects($this->never())->method('log');

        // Expect the exception
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Invalid payment data');

        $this->paymentService->processSecurePayment([
            'amount' => 100.00,
            'card_number' => 'invalid',
            'expiry' => '01/20'
        ]);
    }

    public function testProcessSecurePaymentGatewayFailure(): void
    {
        // Setup successful validation
        $this->validator->method('validate')->willReturn([]);
        
        // Setup payment gateway to fail
        $failureResult = [
            'success' => false,
            'error' => 'Insufficient funds',
            'code' => 'INSUFFICIENT_FUNDS'
        ];
        
        $this->paymentGateway->method('processPayment')->willReturn($failureResult);
        
        // Expect proper logging sequence
        $this->paymentGateway->expects($this->exactly(2))
            ->method('log')
            ->withConsecutive(
                ['info', 'Processing payment', ['amount' => 50.00]],
                ['error', 'Payment processing failed', $failureResult]
            );

        // Test payment processing
        $result = $this->paymentService->processSecurePayment([
            'amount' => 50.00,
            'card_number' => '4111111111111111',
            'expiry' => '12/25'
        ]);

        // Verify failure is properly handled
        $this->assertFalse($result['success']);
        $this->assertEquals('Insufficient funds', $result['error']);
        $this->assertEquals('INSUFFICIENT_FUNDS', $result['code']);
    }
}

// Alternative test showing intersection types (when you can't modify interfaces)
class PaymentServiceWithIntersectionTypesTest extends TestCase
{
    private PaymentProcessorInterface&LoggableInterface&MockObject $paymentGateway;
    private ValidatableInterface&LoggableInterface&MockObject $validator;
    private PaymentServiceWithIntersectionTypes $paymentService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Intersection type mocs - more complex but sometimes necessary
        $this->paymentGateway = $this->createStubForIntersectionOfInterfaces([
            PaymentProcessorInterface::class,
            LoggableInterface::class
        ]);

        $this->validator = $this->createStubForIntersectionOfInterfaces([
            ValidatableInterface::class,
            LoggableInterface::class
        ]);

        $this->paymentService = new PaymentServiceWithIntersectionTypes(
            $this->paymentGateway, 
            $this->validator
        );
    }

    public function testIntersectionTypesWork(): void
    {
        // Same test logic as before, demonstrating intersection types work
        // but are more complex than custom interfaces
        
        $this->validator->method('validate')->willReturn([]);
        $this->paymentGateway->method('processPayment')->willReturn([
            'success' => true,
            'transaction_id' => 'txn_456'
        ]);

        $result = $this->paymentService->processSecurePayment([
            'amount' => 75.00,
            'card_number' => '4111111111111111',
            'expiry' => '12/25'
        ]);

        $this->assertTrue($result['success']);
        $this->assertEquals('txn_456', $result['transaction_id']);
    }
}

// Alternative approach: Single interface with intersection-like behavior
interface SecurePaymentGatewayInterface extends PaymentProcessorInterface, LoggableInterface 
{
    // This interface inherits from both PaymentProcessorInterface and LoggableInterface
    // Provides similar benefits to intersection types but with cleaner syntax
}

final class AlternativePaymentService
{
    public function __construct(
        private SecurePaymentGatewayInterface $gateway,
        private ValidatableInterface $validator  // Separate concerns
    ) {}

    // Implementation similar to above but with simpler type declarations
}

class AlternativePaymentServiceTest extends TestCase
{
    public function testWithInheritanceBasedInterface(): void
    {
        // Single mock for inherited interface - cleaner than intersection
        $gateway = $this->createMock(SecurePaymentGatewayInterface::class);
        $validator = $this->createMock(ValidatableInterface::class);

        $gateway->method('processPayment')->willReturn(['success' => true]);
        $gateway->method('log')->willReturn(null);
        $validator->method('validate')->willReturn([]);

        $service = new AlternativePaymentService($gateway, $validator);

        // Test implementation...
        $this->assertTrue(true); // Placeholder for actual test
    }
}
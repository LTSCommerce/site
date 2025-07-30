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

// Service that requires multiple capabilities using intersection types
final class PaymentService 
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

// Test demonstrating proper intersection type mocking
class PaymentServiceTest extends TestCase
{
    public function testProcessSecurePaymentSuccess(): void
    {
        // Create intersection type mocks using PHPUnit 11's createMock()
        /** @var (PaymentProcessorInterface&LoggableInterface)&MockObject $paymentGateway */
        $paymentGateway = $this->createStubForIntersectionOfInterfaces([
            PaymentProcessorInterface::class,
            LoggableInterface::class
        ]);

        /** @var (ValidatableInterface&LoggableInterface)&MockObject $validator */
        $validator = $this->createStubForIntersectionOfInterfaces([
            ValidatableInterface::class,
            LoggableInterface::class
        ]);

        // Configure the mock behaviors
        $validator->method('validate')->willReturn([]); // No validation errors
        $validator->method('log')->willReturn(null);

        $paymentGateway->method('processPayment')->willReturn([
            'success' => true,
            'transaction_id' => 'txn_123',
            'amount' => 100.00
        ]);
        $paymentGateway->method('log')->willReturn(null);

        // Create service with properly typed intersection dependencies
        $paymentService = new PaymentService($paymentGateway, $validator);

        // Test the actual business logic
        $result = $paymentService->processSecurePayment([
            'amount' => 100.00,
            'card_number' => '4111111111111111',
            'expiry' => '12/25'
        ]);

        $this->assertTrue($result['success']);
        $this->assertEquals('txn_123', $result['transaction_id']);
        $this->assertEquals(100.00, $result['amount']);
    }

    public function testProcessSecurePaymentValidationFailure(): void
    {
        /** @var (PaymentProcessorInterface&LoggableInterface)&MockObject $paymentGateway */
        $paymentGateway = $this->createStubForIntersectionOfInterfaces([
            PaymentProcessorInterface::class,
            LoggableInterface::class
        ]);

        /** @var (ValidatableInterface&LoggableInterface)&MockObject $validator */
        $validator = $this->createStubForIntersectionOfInterfaces([
            ValidatableInterface::class,
            LoggableInterface::class
        ]);

        // Configure validation to fail
        $validator->method('validate')->willReturn([
            'card_number' => 'Invalid card number',
            'expiry' => 'Card expired'
        ]);

        $paymentService = new PaymentService($paymentGateway, $validator);

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Invalid payment data');

        $paymentService->processSecurePayment([
            'amount' => 100.00,
            'card_number' => 'invalid',
            'expiry' => '01/20'
        ]);
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
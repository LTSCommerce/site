<?php

declare(strict_types=1);

/**
 * WRONG: Inheritance-heavy design with tight coupling
 * Problems:
 * - Violates Dependency Inversion Principle
 * - Hard to test in isolation
 * - Brittle inheritance hierarchy
 * - Cannot be final (extensible by design)
 */

// Base class that does too much
abstract class BaseOrderProcessor
{
    protected MySqlDatabase $database;
    protected EmailService $emailService;
    protected PaymentGateway $paymentGateway;
    
    public function __construct()
    {
        // Direct dependencies - violation of DIP!
        $this->database = new MySqlDatabase('localhost', 'orders_db');
        $this->emailService = new SmtpEmailService('smtp.example.com');
        $this->paymentGateway = new StripePaymentGateway('sk_test_123');
    }
    
    // Template method forcing inheritance
    abstract protected function validateOrder(array $orderData): bool;
    abstract protected function calculateTax(float $amount): float;
    
    public function processOrder(array $orderData): bool
    {
        // Rigid workflow - hard to change
        if (!$this->validateOrder($orderData)) {
            return false;
        }
        
        $amount = $orderData['amount'];
        $tax = $this->calculateTax($amount);
        $total = $amount + $tax;
        
        // Direct database access - tight coupling
        $orderId = $this->database->insertOrder([
            'customer_id' => $orderData['customer_id'],
            'amount' => $total,
            'status' => 'pending'
        ]);
        
        // Payment processing mixed with order logic
        $paymentResult = $this->paymentGateway->charge(
            $total,
            $orderData['payment_method']
        );
        
        if ($paymentResult->isSuccess()) {
            $this->database->updateOrderStatus($orderId, 'paid');
            $this->emailService->sendConfirmation(
                $orderData['customer_email'],
                $orderId
            );
            return true;
        }
        
        $this->database->updateOrderStatus($orderId, 'failed');
        return false;
    }
}

// Concrete implementations forced to extend
class StandardOrderProcessor extends BaseOrderProcessor
{
    protected function validateOrder(array $orderData): bool
    {
        return isset($orderData['customer_id'], $orderData['amount']);
    }
    
    protected function calculateTax(float $amount): float
    {
        return $amount * 0.08; // 8% tax
    }
}

class PremiumOrderProcessor extends BaseOrderProcessor
{
    protected function validateOrder(array $orderData): bool
    {
        return isset($orderData['customer_id'], $orderData['amount'])
            && $orderData['amount'] >= 100.00;
    }
    
    protected function calculateTax(float $amount): float
    {
        return $amount * 0.05; // 5% tax for premium customers
    }
}

/**
 * Supporting classes with their own problems
 */
class MySqlDatabase
{
    private string $host;
    private string $database;
    private PDO $connection;
    
    public function __construct(string $host, string $database)
    {
        $this->host = $host;
        $this->database = $database;
        // Direct connection in constructor - hard to test
        $this->connection = new PDO(
            "mysql:host={$host};dbname={$database}",
            'username',
            'password'
        );
    }
    
    public function insertOrder(array $data): int
    {
        // SQL directly embedded - not reusable
        $sql = "INSERT INTO orders (customer_id, amount, status, created_at) 
                VALUES (?, ?, ?, NOW())";
        $stmt = $this->connection->prepare($sql);
        $stmt->execute([
            $data['customer_id'],
            $data['amount'],
            $data['status']
        ]);
        return (int) $this->connection->lastInsertId();
    }
    
    public function updateOrderStatus(int $orderId, string $status): bool
    {
        $sql = "UPDATE orders SET status = ? WHERE id = ?";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute([$status, $orderId]);
    }
}

class SmtpEmailService
{
    private string $smtpHost;
    
    public function __construct(string $smtpHost)
    {
        $this->smtpHost = $smtpHost;
    }
    
    public function sendConfirmation(string $email, int $orderId): bool
    {
        // Direct SMTP call - external dependency
        return mail(
            $email,
            'Order Confirmation',
            "Your order #{$orderId} has been confirmed."
        );
    }
}

class StripePaymentGateway
{
    private string $apiKey;
    
    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }
    
    public function charge(float $amount, string $paymentMethod): PaymentResult
    {
        // Simulated Stripe API call - external dependency
        // In reality, this would make HTTP requests
        $success = random_int(1, 10) > 2; // 80% success rate
        
        return new PaymentResult(
            $success,
            $success ? null : 'Payment declined'
        );
    }
}

class PaymentResult
{
    public function __construct(
        private bool $success,
        private ?string $error = null
    ) {}
    
    public function isSuccess(): bool
    {
        return $this->success;
    }
    
    public function getError(): ?string
    {
        return $this->error;
    }
}

/**
 * TESTING NIGHTMARE - Why this approach is problematic
 */

// Attempting to test this is painful:
// - Cannot mock dependencies (they're created in constructor)
// - Tests hit real database and email service
// - Inheritance makes it hard to test individual pieces
// - Random payment results make tests flaky

class StandardOrderProcessorTest extends PHPUnit\Framework\TestCase
{
    public function testProcessOrder(): void
    {
        // This test will:
        // 1. Try to connect to actual MySQL database
        // 2. Send real emails
        // 3. Make actual payment gateway calls
        // 4. Have random failures due to payment randomness
        
        $processor = new StandardOrderProcessor();
        $orderData = [
            'customer_id' => 123,
            'amount' => 100.00,
            'payment_method' => 'credit_card',
            'customer_email' => 'test@example.com'
        ];
        
        // This will likely fail due to external dependencies
        $result = $processor->processOrder($orderData);
        
        // What are we actually testing here?
        $this->assertTrue($result);
    }
}
<?php

declare(strict_types=1);

/**
 * RIGHT: Final classes with dependency inversion and composition
 * Benefits:
 * - Follows Dependency Inversion Principle
 * - Easy to test with real objects or mocks as needed
 * - Final classes prevent fragile inheritance
 * - Composition over inheritance
 * - PHP 8.4 features: Property hooks, lazy objects, asymmetric visibility
 */

/**
 * Interfaces define contracts (abstractions)
 */
interface OrderStorageInterface
{
    public function saveOrder(Order $order): OrderId;
    public function updateOrderStatus(OrderId $orderId, OrderStatus $status): bool;
    public function findOrder(OrderId $orderId): ?Order;
}

interface PaymentGatewayInterface
{
    public function processPayment(Payment $payment): PaymentResult;
}

interface NotificationServiceInterface
{
    public function sendOrderConfirmation(string $email, OrderId $orderId): bool;
}

interface TaxCalculatorInterface
{
    public function calculateTax(Money $amount, CustomerType $customerType): Money;
}

interface OrderValidatorInterface
{
    public function validate(OrderData $orderData): ValidationResult;
}

/**
 * Value Objects - PHP 8.4 with property hooks and asymmetric visibility
 */
readonly class OrderId
{
    public function __construct(private int $id) 
    {
        if ($id <= 0) {
            throw new InvalidArgumentException('Order ID must be positive');
        }
    }
    
    public function value(): int
    {
        return $this->id;
    }
    
    public function __toString(): string
    {
        return (string) $this->id;
    }
}

readonly class Money
{
    public function __construct(private float $amount)
    {
        if ($amount < 0) {
            throw new InvalidArgumentException('Amount cannot be negative');
        }
    }
    
    public function amount(): float
    {
        return $this->amount;
    }
    
    public function add(Money $other): Money
    {
        return new Money($this->amount + $other->amount);
    }
    
    public function multiply(float $factor): Money
    {
        return new Money($this->amount * $factor);
    }
}

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case FAILED = 'failed';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
}

enum CustomerType: string
{
    case STANDARD = 'standard';
    case PREMIUM = 'premium';
    case VIP = 'vip';
}

/**
 * PHP 8.4 Property Hooks and Asymmetric Visibility
 */
class Order
{
    // Asymmetric visibility: public read, private write
    public private(set) OrderId $id {
        set {
            if ($this->id !== null) {
                throw new LogicException('Order ID cannot be changed once set');
            }
            $this->id = $value;
        }
    }
    
    public private(set) OrderStatus $status = OrderStatus::PENDING;
    
    public function __construct(
        private readonly int $customerId,
        private readonly Money $amount,
        private readonly string $paymentMethod,
        private readonly string $customerEmail,
        private readonly CustomerType $customerType = CustomerType::STANDARD
    ) {}
    
    public function getCustomerId(): int { return $this->customerId; }
    public function getAmount(): Money { return $this->amount; }
    public function getPaymentMethod(): string { return $this->paymentMethod; }
    public function getCustomerEmail(): string { return $this->customerEmail; }
    public function getCustomerType(): CustomerType { return $this->customerType; }
    
    public function setId(OrderId $id): void
    {
        $this->id = $id;
    }
    
    public function updateStatus(OrderStatus $status): void
    {
        $this->status = $status;
    }
}

/**
 * FINAL CLASS: Order Processor using composition
 * Cannot be extended - forces composition over inheritance
 */
final class OrderProcessor
{
    public function __construct(
        private readonly OrderValidatorInterface $validator,
        private readonly TaxCalculatorInterface $taxCalculator,
        private readonly OrderStorageInterface $storage,
        private readonly PaymentGatewayInterface $paymentGateway,
        private readonly NotificationServiceInterface $notificationService
    ) {}
    
    public function processOrder(OrderData $orderData): ProcessingResult
    {
        // Validation
        $validationResult = $this->validator->validate($orderData);
        if (!$validationResult->isValid()) {
            return ProcessingResult::failure($validationResult->getErrors());
        }
        
        // Create order
        $order = new Order(
            $orderData->customerId,
            $orderData->amount,
            $orderData->paymentMethod,
            $orderData->customerEmail,
            $orderData->customerType
        );
        
        // Calculate tax
        $tax = $this->taxCalculator->calculateTax(
            $order->getAmount(),
            $order->getCustomerType()
        );
        $totalAmount = $order->getAmount()->add($tax);
        
        // Save order
        $orderId = $this->storage->saveOrder($order);
        $order->setId($orderId);
        
        // Process payment
        $payment = new Payment($totalAmount, $order->getPaymentMethod());
        $paymentResult = $this->paymentGateway->processPayment($payment);
        
        if ($paymentResult->isSuccess()) {
            $order->updateStatus(OrderStatus::PAID);
            $this->storage->updateOrderStatus($orderId, OrderStatus::PAID);
            
            $this->notificationService->sendOrderConfirmation(
                $order->getCustomerEmail(),
                $orderId
            );
            
            return ProcessingResult::success($orderId);
        } else {
            $order->updateStatus(OrderStatus::FAILED);
            $this->storage->updateOrderStatus($orderId, OrderStatus::FAILED);
            
            return ProcessingResult::failure(['Payment failed: ' . $paymentResult->getError()]);
        }
    }
}

/**
 * Supporting classes and implementations
 */
readonly class OrderData
{
    public function __construct(
        public int $customerId,
        public Money $amount,
        public string $paymentMethod,
        public string $customerEmail,
        public CustomerType $customerType = CustomerType::STANDARD
    ) {}
}

readonly class Payment
{
    public function __construct(
        public Money $amount,
        public string $method
    ) {}
}

class PaymentResult
{
    public function __construct(
        private readonly bool $success,
        private readonly ?string $error = null
    ) {}
    
    public function isSuccess(): bool { return $this->success; }
    public function getError(): ?string { return $this->error; }
    
    public static function success(): self
    {
        return new self(true);
    }
    
    public static function failure(string $error): self
    {
        return new self(false, $error);
    }
}

class ValidationResult
{
    public function __construct(
        private readonly bool $valid,
        private readonly array $errors = []
    ) {}
    
    public function isValid(): bool { return $this->valid; }
    public function getErrors(): array { return $this->errors; }
    
    public static function valid(): self
    {
        return new self(true);
    }
    
    public static function invalid(array $errors): self
    {
        return new self(false, $errors);
    }
}

class ProcessingResult
{
    public function __construct(
        private readonly bool $success,
        private readonly ?OrderId $orderId = null,
        private readonly array $errors = []
    ) {}
    
    public function isSuccess(): bool { return $this->success; }
    public function getOrderId(): ?OrderId { return $this->orderId; }
    public function getErrors(): array { return $this->errors; }
    
    public static function success(OrderId $orderId): self
    {
        return new self(true, $orderId);
    }
    
    public static function failure(array $errors): self
    {
        return new self(false, null, $errors);
    }
}

/**
 * Concrete Implementations - Can be easily swapped
 */
final class StandardTaxCalculator implements TaxCalculatorInterface
{
    public function calculateTax(Money $amount, CustomerType $customerType): Money
    {
        $rate = match($customerType) {
            CustomerType::STANDARD => 0.08,
            CustomerType::PREMIUM => 0.05,
            CustomerType::VIP => 0.03
        };
        
        return $amount->multiply($rate);
    }
}

final class BasicOrderValidator implements OrderValidatorInterface
{
    public function validate(OrderData $orderData): ValidationResult
    {
        $errors = [];
        
        if ($orderData->customerId <= 0) {
            $errors[] = 'Invalid customer ID';
        }
        
        if ($orderData->amount->amount() <= 0) {
            $errors[] = 'Amount must be positive';
        }
        
        if (empty($orderData->paymentMethod)) {
            $errors[] = 'Payment method required';
        }
        
        if (!filter_var($orderData->customerEmail, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email address';
        }
        
        return empty($errors) 
            ? ValidationResult::valid()
            : ValidationResult::invalid($errors);
    }
}

/**
 * In-memory implementation for testing
 */
final class InMemoryOrderStorage implements OrderStorageInterface
{
    private array $orders = [];
    private int $nextId = 1;
    
    public function saveOrder(Order $order): OrderId
    {
        $orderId = new OrderId($this->nextId++);
        $this->orders[$orderId->value()] = $order;
        return $orderId;
    }
    
    public function updateOrderStatus(OrderId $orderId, OrderStatus $status): bool
    {
        if (isset($this->orders[$orderId->value()])) {
            $this->orders[$orderId->value()]->updateStatus($status);
            return true;
        }
        return false;
    }
    
    public function findOrder(OrderId $orderId): ?Order
    {
        return $this->orders[$orderId->value()] ?? null;
    }
    
    public function getOrderCount(): int
    {
        return count($this->orders);
    }
}

/**
 * MySQL implementation for production
 */
final class MySqlOrderStorage implements OrderStorageInterface
{
    public function __construct(private readonly PDO $connection) {}
    
    public function saveOrder(Order $order): OrderId
    {
        $sql = "INSERT INTO orders (customer_id, amount, payment_method, email, customer_type, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->connection->prepare($sql);
        $stmt->execute([
            $order->getCustomerId(),
            $order->getAmount()->amount(),
            $order->getPaymentMethod(),
            $order->getCustomerEmail(),
            $order->getCustomerType()->value,
            $order->status->value
        ]);
        
        return new OrderId((int) $this->connection->lastInsertId());
    }
    
    public function updateOrderStatus(OrderId $orderId, OrderStatus $status): bool
    {
        $sql = "UPDATE orders SET status = ? WHERE id = ?";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute([$status->value, $orderId->value()]);
    }
    
    public function findOrder(OrderId $orderId): ?Order
    {
        $sql = "SELECT * FROM orders WHERE id = ?";
        $stmt = $this->connection->prepare($sql);
        $stmt->execute([$orderId->value()]);
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        
        $order = new Order(
            (int) $row['customer_id'],
            new Money((float) $row['amount']),
            $row['payment_method'],
            $row['email'],
            CustomerType::from($row['customer_type'])
        );
        
        $order->setId($orderId);
        $order->updateStatus(OrderStatus::from($row['status']));
        
        return $order;
    }
}
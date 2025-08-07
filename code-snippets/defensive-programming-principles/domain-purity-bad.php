<?php

// Bad: Domain object tightly coupled to infrastructure
class Order 
{
    private PDO $db;
    private LoggerInterface $logger;
    private MailerInterface $mailer;
    private PaymentGateway $paymentGateway;
    
    public function __construct(
        private string $id,
        private string $customerId,
        private array $items,
        private Money $total,
        PDO $db,
        LoggerInterface $logger,
        MailerInterface $mailer,
        PaymentGateway $paymentGateway
    ) {
        $this->db = $db;
        $this->logger = $logger;
        $this->mailer = $mailer;
        $this->paymentGateway = $paymentGateway;
    }
    
    public function process(): void 
    {
        // Domain logic mixed with infrastructure concerns
        $this->logger->info("Processing order {$this->id}");
        
        // Database query in domain object!
        $stmt = $this->db->prepare('SELECT * FROM inventory WHERE product_id = ?');
        
        foreach ($this->items as $item) {
            $stmt->execute([$item['product_id']]);
            $inventory = $stmt->fetch();
            
            if ($inventory['quantity'] < $item['quantity']) {
                $this->logger->error("Insufficient inventory for {$item['product_id']}");
                throw new InsufficientInventoryException();
            }
        }
        
        // Payment processing mixed in
        $paymentResult = $this->paymentGateway->charge(
            $this->total->getAmount(),
            $this->customerId
        );
        
        if (!$paymentResult->isSuccessful()) {
            $this->logger->error("Payment failed for order {$this->id}");
            throw new PaymentFailedException();
        }
        
        // Email sending in domain object!
        $this->mailer->send(
            'order-confirmation',
            $this->getCustomerEmail(),
            ['order' => $this]
        );
        
        // Update database
        $this->db->prepare('UPDATE orders SET status = ? WHERE id = ?')
                 ->execute(['completed', $this->id]);
        
        $this->logger->info("Order {$this->id} completed");
    }
    
    private function getCustomerEmail(): string 
    {
        // More database access in domain object!
        $stmt = $this->db->prepare('SELECT email FROM customers WHERE id = ?');
        $stmt->execute([$this->customerId]);
        return $stmt->fetchColumn();
    }
}

// Problems:
// 1. Domain object depends on 4 external services
// 2. Business logic is mixed with infrastructure concerns
// 3. Hard to test - requires database, mailer, payment gateway
// 4. Violates Single Responsibility Principle
// 5. Changes to infrastructure affect domain logic
<?php

// Good: Pure domain object with clean boundaries  
readonly class Order 
{
    public function __construct(
        private OrderId $id,
        private CustomerId $customerId,
        private OrderItems $items,
        private Money $total,
        private OrderStatus $status = OrderStatus::PENDING
    ) {}
    
    public function canBeProcessed(InventoryService $inventory): bool 
    {
        foreach ($this->items as $item) {
            if (!$inventory->hasAvailableQuantity($item->productId(), $item->quantity())) {
                return false;
            }
        }
        return true;
    }
    
    public function process(): OrderProcessed 
    {
        if ($this->status !== OrderStatus::PENDING) {
            throw new DomainException('Order can only be processed when pending');
        }
        
        $this->status = OrderStatus::PROCESSING;
        
        return new OrderProcessed(
            $this->id,
            $this->customerId,
            $this->total,
            new DateTimeImmutable()
        );
    }
    
    public function complete(): OrderCompleted 
    {
        if ($this->status !== OrderStatus::PROCESSING) {
            throw new DomainException('Order must be processing to complete');
        }
        
        $this->status = OrderStatus::COMPLETED;
        
        return new OrderCompleted(
            $this->id,
            $this->customerId,
            $this->items,
            $this->total,
            new DateTimeImmutable()
        );
    }
    
    public function fail(string $reason): OrderFailed 
    {
        $this->status = OrderStatus::FAILED;
        
        return new OrderFailed(
            $this->id,
            $this->customerId,
            $reason,
            new DateTimeImmutable()
        );
    }
    
    // Pure getters - no external dependencies
    public function id(): OrderId { return $this->id; }
    public function customerId(): CustomerId { return $this->customerId; }
    public function items(): OrderItems { return $this->items; }
    public function total(): Money { return $this->total; }
    public function status(): OrderStatus { return $this->status; }
}

// Application service handles orchestration
class ProcessOrderService 
{
    public function __construct(
        private OrderRepository $orders,
        private InventoryService $inventory,
        private PaymentService $payment,
        private EventDispatcher $events,
        private LoggerInterface $logger
    ) {}
    
    public function execute(ProcessOrderCommand $command): void 
    {
        $order = $this->orders->findById($command->orderId());
        
        if (!$order->canBeProcessed($this->inventory)) {
            $failed = $order->fail('Insufficient inventory');
            $this->orders->save($order);
            $this->events->dispatch($failed);
            return;
        }
        
        try {
            $processed = $order->process();
            $this->events->dispatch($processed);
            
            $this->payment->charge($order->total(), $order->customerId());
            
            $completed = $order->complete();
            $this->orders->save($order);
            $this->events->dispatch($completed);
            
        } catch (PaymentException $e) {
            $failed = $order->fail('Payment failed: ' . $e->getMessage());
            $this->orders->save($order);
            $this->events->dispatch($failed);
            
            $this->logger->error('Order payment failed', [
                'order_id' => $order->id()->value(),
                'error' => $e->getMessage()
            ]);
        }
    }
}

// Event handlers manage side effects
class OrderCompletedHandler 
{
    public function __construct(
        private MailerInterface $mailer,
        private CustomerRepository $customers
    ) {}
    
    public function handle(OrderCompleted $event): void 
    {
        $customer = $this->customers->findById($event->customerId());
        
        $this->mailer->send(
            'order-confirmation',
            $customer->email()->value(),
            [
                'order_id' => $event->orderId()->value(),
                'items' => $event->items()->toArray(),
                'total' => $event->total()->format()
            ]
        );
    }
}
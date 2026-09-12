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

    public function process(): self
    {
        if ($this->status !== OrderStatus::PENDING) {
            throw new DomainException('Order can only be processed when pending');
        }

        return new self($this->id, $this->customerId, $this->items, $this->total, OrderStatus::PROCESSING);
    }

    public function complete(): self
    {
        if ($this->status !== OrderStatus::PROCESSING) {
            throw new DomainException('Order must be processing to complete');
        }

        return new self($this->id, $this->customerId, $this->items, $this->total, OrderStatus::COMPLETED);
    }

    public function fail(): self
    {
        return new self($this->id, $this->customerId, $this->items, $this->total, OrderStatus::FAILED);
    }

    // Pure getters - no external dependencies
    public function id(): OrderId { return $this->id; }
    public function customerId(): CustomerId { return $this->customerId; }
    public function items(): OrderItems { return $this->items; }
    public function total(): Money { return $this->total; }
    public function status(): OrderStatus { return $this->status; }
}

// Application service handles orchestration, including building domain events
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
            $order = $order->fail();
            $this->orders->save($order);
            $this->events->dispatch(new OrderFailed(
                $order->id(),
                $order->customerId(),
                'Insufficient inventory',
                new DateTimeImmutable()
            ));
            return;
        }

        try {
            $order = $order->process();
            $this->orders->save($order);
            $this->events->dispatch(new OrderProcessed(
                $order->id(),
                $order->customerId(),
                $order->total(),
                new DateTimeImmutable()
            ));

            $this->payment->charge($order->total(), $order->customerId());

            $order = $order->complete();
            $this->orders->save($order);
            $this->events->dispatch(new OrderCompleted(
                $order->id(),
                $order->customerId(),
                $order->items(),
                $order->total(),
                new DateTimeImmutable()
            ));

        } catch (PaymentException $e) {
            $order = $order->fail();
            $this->orders->save($order);
            $this->events->dispatch(new OrderFailed(
                $order->id(),
                $order->customerId(),
                'Payment failed: ' . $e->getMessage(),
                new DateTimeImmutable()
            ));

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

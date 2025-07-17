<?php

declare(strict_types=1);

namespace App\Services\Order;

use App\ValueObjects\{OrderId, Money, CustomerId};
use App\Entities\Order;
use App\Events\OrderPlaced;
use App\Exceptions\{OrderValidationException, PaymentFailedException};

final readonly class OrderService
{
    public function __construct(
        private OrderValidator $validator,
        private PriceCalculator $calculator,
        private PaymentGateway $paymentGateway,
        private OrderRepository $repository,
        private EventDispatcher $eventDispatcher,
    ) {}

    public function processOrder(OrderData $orderData): Order
    {
        $this->validator->validate($orderData);
        
        $order = Order::create(
            OrderId::generate(),
            $orderData->customerId,
            $orderData->items,
            $this->calculator->calculate($orderData->items)
        );
        
        $paymentResult = $this->paymentGateway->charge(
            $order->total,
            $orderData->paymentMethod
        );
        
        if (!$paymentResult->isSuccessful()) {
            throw new PaymentFailedException($paymentResult->errorMessage);
        }
        
        $order->markAsPaid($paymentResult->transactionId);
        $this->repository->save($order);
        
        $this->eventDispatcher->dispatch(
            new OrderPlaced($order->id, $order->customerId)
        );
        
        return $order;
    }
}
<?php
// AFTER: Guard clauses with early returns - PHP 8.4 style

class OrderProcessor 
{
    public function processOrder(?Order $order): OrderResult
    {
        // Guard clauses handle exceptional cases upfront
        if ($order === null) {
            return new OrderResult(
                success: false, 
                message: 'Order cannot be null'
            );
        }

        if (!$order->isValid()) {
            return new OrderResult(
                success: false, 
                message: 'Order validation failed'
            );
        }

        if ($order->getStatus() !== OrderStatus::PENDING) {
            return new OrderResult(
                success: false, 
                message: 'Order is not in pending status'
            );
        }

        if ($order->getCustomer() === null) {
            return new OrderResult(
                success: false, 
                message: 'Order must have a customer'
            );
        }

        if (!$order->getCustomer()->isActive()) {
            return new OrderResult(
                success: false, 
                message: 'Customer account is inactive'
            );
        }

        if ($order->getItems()->count() === 0) {
            return new OrderResult(
                success: false, 
                message: 'Order must contain items'
            );
        }

        if (!$this->inventoryService->hasStock($order)) {
            return new OrderResult(
                success: false, 
                message: 'Insufficient inventory'
            );
        }

        if ($order->getTotal() <= 0) {
            return new OrderResult(
                success: false, 
                message: 'Order total must be greater than zero'
            );
        }

        if (!$this->paymentService->authorize($order)) {
            return new OrderResult(
                success: false, 
                message: 'Payment authorization failed'
            );
        }

        // Main business logic flows clearly at the bottom
        $this->inventoryService->reserve($order);
        $this->paymentService->capture($order);
        $order->setStatus(OrderStatus::PROCESSING);

        return new OrderResult(
            success: true,
            orderId: $order->getId(),
            message: 'Order processed successfully'
        );
    }
}
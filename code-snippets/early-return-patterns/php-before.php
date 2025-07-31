<?php
// BEFORE: Deeply nested conditions create complexity

class OrderProcessor 
{
    public function processOrder(Order $order): OrderResult
    {
        if ($order !== null) {
            if ($order->isValid()) {
                if ($order->getStatus() === OrderStatus::PENDING) {
                    if ($order->getCustomer() !== null) {
                        if ($order->getCustomer()->isActive()) {
                            if ($order->getItems()->count() > 0) {
                                if ($this->inventoryService->hasStock($order)) {
                                    if ($order->getTotal() > 0) {
                                        if ($this->paymentService->authorize($order)) {
                                            // Main business logic buried deep
                                            $this->inventoryService->reserve($order);
                                            $this->paymentService->capture($order);
                                            $order->setStatus(OrderStatus::PROCESSING);
                                            
                                            return new OrderResult(
                                                success: true,
                                                orderId: $order->getId(),
                                                message: 'Order processed successfully'
                                            );
                                        } else {
                                            return new OrderResult(
                                                success: false, 
                                                message: 'Payment authorization failed'
                                            );
                                        }
                                    } else {
                                        return new OrderResult(
                                            success: false, 
                                            message: 'Order total must be greater than zero'
                                        );
                                    }
                                } else {
                                    return new OrderResult(
                                        success: false, 
                                        message: 'Insufficient inventory'
                                    );
                                }
                            } else {
                                return new OrderResult(
                                    success: false, 
                                    message: 'Order must contain items'
                                );
                            }
                        } else {
                            return new OrderResult(
                                success: false, 
                                message: 'Customer account is inactive'
                            );
                        }
                    } else {
                        return new OrderResult(
                            success: false, 
                            message: 'Order must have a customer'
                        );
                    }
                } else {
                    return new OrderResult(
                        success: false, 
                        message: 'Order is not in pending status'
                    );
                }
            } else {
                return new OrderResult(
                    success: false, 
                    message: 'Order validation failed'
                );
            }
        } else {
            return new OrderResult(
                success: false, 
                message: 'Order cannot be null'
            );
        }
    }
}
<?php
// Anti-pattern: the payment disappears silently
try {
    $this->paymentGateway->charge($order->getAmount(), $card);
    $order->markAsPaid();
} catch (\Exception $e) {
    // TODO: handle this properly
}

// markAsPaid() never runs and the exception is gone.
// The user sees nothing unusual: no error, no retry, and no payment.

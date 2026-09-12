<?php

final class SecureOrderProcessor
{
    // Public read, private write - prevents external modification
    public private(set) PaymentGatewayInterface $paymentGateway;

    public function __construct(PaymentGatewayInterface $paymentGateway)
    {
        $this->paymentGateway = $paymentGateway;
    }

    // Gateway cannot be modified after construction
    // but can be read for testing and debugging
}

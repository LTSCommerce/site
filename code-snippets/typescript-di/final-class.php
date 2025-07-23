<?php
final class PaymentProcessor {
    private array $transactions = [];
    
    public function process(float $amount): void {
        // Critical business logic that shouldn't be modified
        $this->transactions[] = $amount;
    }
}

// This causes an error - can't extend final class
// class MockPaymentProcessor extends PaymentProcessor {}
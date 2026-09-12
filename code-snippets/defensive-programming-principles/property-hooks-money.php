<?php

readonly class Money
{
    public int $amount {
        set {
            if ($value < 0) {
                throw new InvalidArgumentException('Amount cannot be negative');
            }
            $this->amount = $value;
        }
    }

    public string $currency {
        set {
            if (!in_array($value, ['USD', 'EUR', 'GBP'])) {
                throw new InvalidArgumentException('Unsupported currency');
            }
            $this->currency = strtoupper($value);
        }
    }

    public function __construct(int $amount, string $currency)
    {
        $this->amount = $amount;   // Triggers validation hook
        $this->currency = $currency; // Triggers validation hook
    }
}

// Property hooks ensure validation happens automatically
$price = new Money(1000, 'usd'); // Currency normalized to 'USD'
// $invalid = new Money(-50, 'USD'); // Throws InvalidArgumentException

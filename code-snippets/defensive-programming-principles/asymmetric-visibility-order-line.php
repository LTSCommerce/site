<?php

class OrderLine
{
    // Publicly readable, privately settable
    public private(set) ProductId $productId;
    public private(set) int $quantity;
    public private(set) Money $unitPrice;

    // Computed property - publicly readable only
    public Money $totalPrice {
        get => new Money(
            $this->quantity * $this->unitPrice->amount,
            $this->unitPrice->currency
        );
    }

    public function __construct(ProductId $productId, int $quantity, Money $unitPrice)
    {
        if ($quantity <= 0) {
            throw new InvalidArgumentException('Quantity must be positive');
        }

        $this->productId = $productId;
        $this->quantity = $quantity;
        $this->unitPrice = $unitPrice;
    }

    public function changeQuantity(int $newQuantity): OrderLine
    {
        return new OrderLine($this->productId, $newQuantity, $this->unitPrice);
    }
}

// External code can read but not modify properties
$line = new OrderLine($product, 5, new Money(1000, 'USD'));
echo $line->quantity; // Works: 5
echo $line->totalPrice->amount; // Works: 5000 (computed property)
// $line->quantity = 10; // Compile error: property is private(set)

<?php

declare(strict_types=1);

namespace App\Shopping;

use App\Entities\Product;

// AI-generated prototype (basic)
class ShoppingCart
{
    private array $items = [];

    public function addItem(Product $product, int $quantity = 1): void
    {
        $this->items[] = ['product' => $product, 'quantity' => $quantity];
    }

    public function getTotal(): float
    {
        return array_sum(array_map(function (array $item) {
            return $item['product']->getPrice() * $item['quantity'];
        }, $this->items));
    }
}

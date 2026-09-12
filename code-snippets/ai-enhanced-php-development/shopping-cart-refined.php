<?php

declare(strict_types=1);

namespace App\Shopping;

use App\Collections\CartItemCollection;
use App\Entities\Product;
use App\Exceptions\{InvalidQuantityException, ProductNotFoundException};
use App\ValueObjects\{Money, ProductId, Quantity};

// Refine with modern PHP patterns and proper domain modelling
final class ShoppingCart
{
    private CartItemCollection $items;

    public function __construct()
    {
        $this->items = new CartItemCollection();
    }

    public function addItem(Product $product, Quantity $quantity): void
    {
        if ($quantity->isZero()) {
            throw new InvalidQuantityException('Quantity must be positive');
        }

        $existingItem = $this->items->findByProductId($product->getId());

        if ($existingItem !== null) {
            $existingItem->increaseQuantity($quantity);
        } else {
            $this->items->add(new CartItem($product, $quantity));
        }
    }

    public function removeItem(ProductId $productId): void
    {
        $item = $this->items->findByProductId($productId)
            ?? throw new ProductNotFoundException("Product not found: {$productId->value}");

        $this->items->remove($item);
    }

    public function getTotal(): Money
    {
        return $this->items->reduce(
            Money::zero(),
            fn (Money $total, CartItem $item) => $total->add($item->getSubtotal())
        );
    }

    public function getItemCount(): int
    {
        return $this->items->count();
    }

    public function isEmpty(): bool
    {
        return $this->items->isEmpty();
    }

    public function clear(): void
    {
        $this->items = new CartItemCollection();
    }
}

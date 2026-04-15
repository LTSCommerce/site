<?php

declare(strict_types=1);

namespace App\Http\Controller;

use App\Exception\Order\InsufficientStockException;

// Callers inspect *properties*, not strings. Refactor-safe, type-safe,
// trivially serialisable into a structured API error payload.

try {
    $orderService->place($order);
} catch (InsufficientStockException $e) {
    return new JsonResponse([
        'error' => 'insufficient_stock',
        'sku'   => $e->sku->value,
        'requested' => $e->requested,
        'available' => $e->available,
    ], status: 409);
}

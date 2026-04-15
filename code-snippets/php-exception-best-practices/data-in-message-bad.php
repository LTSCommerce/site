<?php

declare(strict_types=1);

// ❌ ANTI-PATTERN — data encoded into the message string.
//
// The only way to test, log, or react to the specifics is to parse
// the message back out again. Change the wording and every test that
// asserted on the string breaks. Monolog cannot index any of it.

throw new \RuntimeException(
    "Order #12345 for customer user-987 failed: insufficient stock for SKU ABC-42 (requested 10, available 3)"
);

// Downstream code ends up doing this:
try {
    $service->place($order);
} catch (\RuntimeException $e) {
    // Fragile regex to pick data out of a human-readable string.
    if (preg_match('/SKU ([A-Z0-9-]+).*requested (\d+).*available (\d+)/', $e->getMessage(), $m)) {
        // ...and it will silently break the day someone "improves the wording".
    }
}

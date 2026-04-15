<?php

declare(strict_types=1);

// ❌ ANTI-PATTERN — deep inheritance tree used to share behaviour.
//
// Every concrete exception lives at the bottom of a chain of bases that
// each add "a little bit" to the previous. You can no longer tell what
// a given exception actually is without walking the whole hierarchy.

abstract class AppException extends \RuntimeException {}
abstract class OrderException extends AppException {}
abstract class OrderValidationException extends OrderException {}
abstract class OrderStockException extends OrderValidationException {}
final class InsufficientStockException extends OrderStockException {}
//                                        ^
//  5 levels deep just to say "order failed because of stock".
//  Worse: subclassing `InsufficientStockException` to add a "partial"
//  variant creates a 6th level, and now a `catch` on the parent silently
//  also catches the child — rarely what you want.

// ❌ Also an anti-pattern — subclassing a *concrete* exception to tweak it.
final class PartialStockException extends InsufficientStockException {}

// The catch block below catches BOTH concretes. The developer who added
// PartialStockException may not have realised.
try {
    $this->place($order);
} catch (InsufficientStockException $e) {
    // ...
}

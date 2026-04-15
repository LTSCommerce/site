<?php

declare(strict_types=1);

// ❌ NEVER. This is the single most destructive pattern in PHP codebases.
try {
    $this->syncCustomer($customer);
} catch (\Throwable) {
    // "it's fine, we'll deal with it later"
}

// ❌ Also never. `@` is swallowing with extra steps.
$handle = @fopen($path, 'r');

// ❌ Logging without rethrowing is still swallowing — the caller is lied to.
try {
    $this->syncCustomer($customer);
} catch (\Throwable $e) {
    $this->logger->error('sync failed', ['exception' => $e]);
    // execution continues as if nothing went wrong
}

// ✅ If you catch, you must do ONE of:
//    1. Rethrow (optionally wrapped with more context and $previous chained)
//    2. Recover with a meaningful alternative path that the caller asked for
//    3. Translate into a different exception the caller is documented to expect

try {
    $this->syncCustomer($customer);
} catch (CustomerApiTimeoutException $previous) {
    // Recovery path — explicitly requested by the caller via a retry policy.
    // NOT "we hope it worked". The exception is replaced with a known state.
    $this->retryQueue->enqueue($customer);
    throw CustomerSyncDeferredException::createWithPrevious($customer->id, $previous);
}

<?php

// ❌ Without structured exception data, callers end up repeating themselves
// at every throw site. Brittle, noisy, easy to get out of sync.
$this->logger->error($msg, ['sku' => $sku, 'qty' => $qty, 'available' => $available]);

// ✅ With typed exception properties and the Monolog processor, this all
// happens automatically — the processor reflects the properties onto the
// log record. The throw site just throws.
throw InsufficientStockException::create($sku, $qty, $available);

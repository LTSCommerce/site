<?php

// Without named factories — ambiguous at the call site, especially once
// the constructor grows optional parameters.
throw new InsufficientStockException($sku, 10, 3, null);
throw new InsufficientStockException($sku, 10, 3, $previous);

// With named factories — the call site reads itself.
throw InsufficientStockException::create($sku, 10, 3);
throw InsufficientStockException::createWithPrevious($sku, 10, 3, $previous);

<?php

declare(strict_types=1);

// Memory-conscious logging
$context = array_slice($fullContext, 0, 50); // Limit context size
$logger->info($message, $context);
unset($context); // Explicit cleanup

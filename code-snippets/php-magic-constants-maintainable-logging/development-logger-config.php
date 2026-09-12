<?php

declare(strict_types=1);

// Development logger configuration
$logger = $loggerFactory->createLogger('app', Logger::DEBUG);
$logger->pushProcessor(new DebugContextProcessor(true, 0)); // Include full stack traces

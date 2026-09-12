<?php

declare(strict_types=1);

namespace App\Examples;

class NamespaceExample
{
    private $logger;

    public function __construct($logger)
    {
        $this->logger = $logger;

        $this->logger->info('Class instantiated', [
            'class' => __CLASS__,
            'namespace' => __NAMESPACE__,
            'method' => __METHOD__,
            'file' => __FILE__,
            'line' => __LINE__,
        ]);
    }

    public function doSomething(): void
    {
        $this->logger->debug('Method execution started', [
            'method' => __METHOD__,
            'class' => __CLASS__,
            'namespace' => __NAMESPACE__,
            'line' => __LINE__,
        ]);

        // Simulate work
        usleep(100000);

        $this->logger->debug('Method execution completed', [
            'method' => __METHOD__,
            'line' => __LINE__,
        ]);
    }
}

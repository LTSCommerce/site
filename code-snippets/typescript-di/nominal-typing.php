<?php
interface LoggerInterface {
    public function log(string $message): void;
}

class FileLogger implements LoggerInterface {
    public function log(string $message): void {
        // Implementation
    }
}

class Service {
    // Must explicitly implement LoggerInterface
    public function __construct(private LoggerInterface $logger) {}
}

// This won't work - EmailLogger doesn't implement LoggerInterface
class EmailLogger {
    public function log(string $message): void {
        // Same method signature, but not explicitly implementing the interface
    }
}

// Type error: EmailLogger is not a LoggerInterface
// $service = new Service(new EmailLogger());
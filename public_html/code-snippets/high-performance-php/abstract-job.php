<?php

abstract readonly class Job implements JobInterface
{
    protected int $attempts = 0;
    protected int $maxAttempts = 3;
    
    public function __construct(
        protected readonly JobId $id,
        protected readonly array $data = [],
    ) {}
    
    abstract public function handle(): void;
    
    public function failed(Throwable $exception): void
    {
        // Override in subclasses for custom failure handling
    }
    
    public function shouldRetry(): bool
    {
        return $this->attempts < $this->maxAttempts;
    }
    
    public function incrementAttempts(): void
    {
        $this->attempts++;
    }
    
    public function getAttempts(): int
    {
        return $this->attempts;
    }
    
    public function getMaxAttempts(): int
    {
        return $this->maxAttempts;
    }
    
    public function getId(): JobId
    {
        return $this->id;
    }
}
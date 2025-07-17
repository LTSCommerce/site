<?php

declare(strict_types=1);

namespace App\ObjectPool;

use App\Contracts\{PoolableInterface, ObjectFactoryInterface};
use App\Exceptions\PoolExhaustedException;
use App\ValueObjects\PoolSize;
use SplQueue;

final class ObjectPool
{
    private readonly SplQueue $pool;
    private int $currentSize = 0;
    
    public function __construct(
        private readonly ObjectFactoryInterface $factory,
        private readonly PoolSize $maxSize = new PoolSize(100),
    ) {
        $this->pool = new SplQueue();
    }
    
    public function get(): PoolableInterface
    {
        if ($this->pool->isEmpty()) {
            return $this->factory->create();
        }
        
        return $this->pool->dequeue();
    }
    
    public function return(PoolableInterface $object): void
    {
        if ($this->pool->count() >= $this->maxSize->value) {
            // Pool is full, let object be garbage collected
            return;
        }
        
        // Reset object state before returning to pool
        $object->reset();
        
        $this->pool->enqueue($object);
    }
    
    public function size(): int
    {
        return $this->pool->count();
    }
    
    public function drain(): void
    {
        while (!$this->pool->isEmpty()) {
            $this->pool->dequeue();
        }
    }
}
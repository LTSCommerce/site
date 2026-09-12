<?php

declare(strict_types=1);

namespace App\Performance;

use App\Exceptions\PoolExhaustedException;
use Closure;
use SplObjectStorage;

/**
 * @template T of object
 */
final class ObjectPool
{
    /** @var array<int, object> */
    private array $available = [];

    private SplObjectStorage $checkedOut;

    /**
     * @param Closure(): T $factory
     */
    public function __construct(
        private readonly Closure $factory,
        private readonly int $maxSize = 20,
    ) {
        $this->checkedOut = new SplObjectStorage();
    }

    /**
     * @return T
     */
    public function acquire(): object
    {
        $object = array_pop($this->available) ?? $this->createIfPermitted();

        $this->checkedOut->attach($object);

        return $object;
    }

    public function release(object $object): void
    {
        if (!$this->checkedOut->contains($object)) {
            throw new PoolExhaustedException('Cannot release an object this pool did not hand out');
        }

        $this->checkedOut->detach($object);
        $this->available[] = $object;
    }

    private function createIfPermitted(): object
    {
        $inUse = count($this->checkedOut);

        if ($inUse >= $this->maxSize) {
            throw new PoolExhaustedException("Pool exhausted: {$inUse} objects checked out");
        }

        return ($this->factory)();
    }
}

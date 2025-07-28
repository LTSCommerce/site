<?php

// Basic demonstration of all PHP magic constants
class ExampleService
{
    public function demonstrateMagicConstants(): array
    {
        return [
            '__FILE__' => __FILE__,
            '__DIR__' => __DIR__,
            '__LINE__' => __LINE__,
            '__FUNCTION__' => __FUNCTION__,
            '__CLASS__' => __CLASS__,
            '__METHOD__' => __METHOD__,
            '__NAMESPACE__' => __NAMESPACE__,
            '__TRAIT__' => null, // Only available inside traits
        ];
    }
}

trait ExampleTrait
{
    public function getTraitInfo(): string
    {
        return __TRAIT__; // Returns the trait name
    }
}

namespace App\Services {
    class NamespaceExample
    {
        public function getNamespace(): string
        {
            return __NAMESPACE__; // Returns 'App\Services'
        }
    }
}

// Usage examples
$service = new ExampleService();
$constants = $service->demonstrateMagicConstants();

foreach ($constants as $constant => $value) {
    if ($value !== null) {
        echo "{$constant}: {$value}" . PHP_EOL;
    }
}
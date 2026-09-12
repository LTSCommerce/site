<?php

namespace App\Services;

class NamespaceExample
{
    public function getNamespace(): string
    {
        return __NAMESPACE__; // Returns 'App\Services'
    }
}

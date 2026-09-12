<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in(__DIR__)
    ->exclude('vendor');

return (new Config())
    ->setRules([
        '@Symfony' => true,  // Includes @PER-CS2.0
        '@PER-CS' => true,   // Explicit PER compliance
        'declare_strict_types' => true,
        'void_return' => true,
    ])
    ->setFinder($finder)
    ->setRiskyAllowed(true);

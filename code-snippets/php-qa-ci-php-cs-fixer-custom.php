<?php

declare(strict_types=1);

// Include the default configuration
$config = require __DIR__ . '/../vendor/lts/php-qa-ci/configDefaults/generic/php_cs.php';

// Get the default finder
$finder = require __DIR__ . '/../vendor/lts/php-qa-ci/configDefaults/generic/php_cs_finder.php';

// Customize the finder if needed
$finder
    ->exclude('legacy')
    ->notPath('src/Migrations/Version*.php');

// Add or override rules
$rules = $config->getRules();
$rules['php_unit_test_class_requires_covers'] = false;
$rules['php_unit_internal_class'] = false;

return $config
    ->setFinder($finder)
    ->setRules($rules);
#!/bin/bash
# Create custom configuration directory
mkdir -p qaConfig

# Copy and customize PHPStan configuration
cp vendor/lts/php-qa-ci/configDefaults/generic/phpstan.neon qaConfig/
# Edit qaConfig/phpstan.neon as needed

# Copy and customize PHP CS Fixer configuration
cp vendor/lts/php-qa-ci/configDefaults/generic/php_cs.php qaConfig/
# Edit qaConfig/php_cs.php as needed

# The QA pipeline will automatically use your custom configs
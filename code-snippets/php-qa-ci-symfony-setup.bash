#!/bin/bash
# For Symfony projects: choose between Symfony defaults or php-qa-ci defaults

# Option 1: Use php-qa-ci defaults (more extensive)
rm phpunit.xml.dist
ln -s vendor/lts/php-qa-ci/configDefaults/generic/phpunit.xml

# Option 2: Keep Symfony defaults
# Simply accept the recipe prompts during installation

# Create project-specific overrides
mkdir -p qaConfig
echo "parameters:
    level: 8
    paths:
        - src
    excludePaths:
        - var
        - vendor" > qaConfig/phpstan.neon
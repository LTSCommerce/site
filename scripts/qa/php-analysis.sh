#!/bin/bash

# PHP Code Quality Analysis
set -e

echo "🔍 Running PHP code analysis..."

# Build containers if needed
docker-compose -f docker-compose.qa.yml build php-qa

# Run PHPStan
echo "📊 Running PHPStan (Level 8)..."
docker-compose -f docker-compose.qa.yml run --rm php-qa

# Run PHP-CS-Fixer (dry run to check style)
echo "🎨 Checking PHP code style..."
docker-compose -f docker-compose.qa.yml run --rm php-cs-fixer

echo "✅ PHP analysis complete"
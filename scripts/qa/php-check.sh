#!/bin/bash

# Single PHP file quality analysis
set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <php-file-path>"
    echo "Example: $0 dependency-inversion-final-classes/right-approach.php"
    exit 1
fi

FILE_PATH="$1"

# Check if file exists
if [ ! -f "code-snippets/$FILE_PATH" ]; then
    echo "❌ File not found: code-snippets/$FILE_PATH"
    exit 1
fi

echo "🔍 Running PHP quality analysis on: $FILE_PATH"
echo "================================================================"

# Build container if needed
echo "🏗️  Building PHP QA container..."
docker compose -f docker-compose.qa.yml build php-qa >/dev/null

echo "📊 PHPStan Analysis (Level 8)"
echo "--------------------------------"
docker compose -f docker-compose.qa.yml run --rm php-qa /app/bin/phpstan analyse "$FILE_PATH" --level=8 --no-progress

echo
echo "🎨 Code Style Check"
echo "-------------------"
docker compose -f docker-compose.qa.yml run --rm php-cs-fixer /app/bin/php-cs-fixer fix "$FILE_PATH" --dry-run --diff --verbose

echo
echo "✅ Analysis complete for: $FILE_PATH"
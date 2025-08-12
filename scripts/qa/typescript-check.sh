#!/bin/bash

# Single TypeScript file quality analysis
set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <ts-file-path>"
    echo "Example: $0 typescript-di/structural-typing.ts"
    exit 1
fi

FILE_PATH="$1"

# Check if file exists
if [ ! -f "code-snippets/$FILE_PATH" ]; then
    echo "❌ File not found: code-snippets/$FILE_PATH"
    exit 1
fi

echo "🔍 Running TypeScript quality analysis on: $FILE_PATH"
echo "================================================================"

# Build container if needed
echo "🏗️  Building TypeScript QA container..."
docker compose -f docker-compose.qa.yml build typescript-qa >/dev/null

echo "📜 TypeScript Compiler Check"
echo "-----------------------------"
docker compose -f docker-compose.qa.yml run --rm typescript-qa tsc --noEmit "$FILE_PATH"

echo
echo "📊 ESLint Analysis"
echo "------------------"
docker compose -f docker-compose.qa.yml run --rm eslint-qa eslint "$FILE_PATH"

echo
echo "✅ Analysis complete for: $FILE_PATH"
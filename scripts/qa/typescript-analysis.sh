#!/bin/bash

# TypeScript Code Quality Analysis
set -e

echo "🔍 Running TypeScript code analysis..."

# Build containers if needed
docker-compose -f docker-compose.qa.yml build typescript-qa

# Run TypeScript compiler (type checking only)
echo "🎨 Running TypeScript compiler (type checking)..."
docker-compose -f docker-compose.qa.yml run --rm typescript-qa

# Run ESLint
echo "📊 Running ESLint..."
docker-compose -f docker-compose.qa.yml run --rm eslint-qa

echo "✅ TypeScript analysis complete"
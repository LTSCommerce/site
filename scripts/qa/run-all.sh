#!/bin/bash

# Individual file quality analysis
set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <file-path>"
    echo ""
    echo "Examples:"
    echo "  $0 dependency-inversion-final-classes/right-approach.php"
    echo "  $0 typescript-di/structural-typing.ts"
    echo ""
    echo "This script automatically detects file type and runs appropriate QA tools."
    exit 1
fi

FILE_PATH="$1"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Change to project root
cd "$(dirname "$0")/../.."

# Determine file type and run appropriate analysis
if [[ "$FILE_PATH" == *.php ]]; then
    ./scripts/qa/php-check.sh "$FILE_PATH"
elif [[ "$FILE_PATH" == *.ts ]]; then
    ./scripts/qa/typescript-check.sh "$FILE_PATH" 
else
    echo "❌ Unsupported file type. Supported: .php, .ts"
    exit 1
fi
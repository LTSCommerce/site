# Code Quality Analysis

Docker-based code quality analysis for individual PHP and TypeScript code snippets.

## Setup

1. Ensure Docker is installed and running
2. Build the QA containers (done automatically on first run)

## Usage

### Analyze Individual Files
```bash
# Auto-detects file type and runs appropriate QA
./scripts/qa/run-all.sh <file-path>

# Examples:
./scripts/qa/run-all.sh dependency-inversion-final-classes/right-approach.php
./scripts/qa/run-all.sh typescript-di/structural-typing.ts
```

### File-Specific Analysis
```bash
# PHP files only
./scripts/qa/php-check.sh dependency-inversion-final-classes/right-approach.php

# TypeScript files only  
./scripts/qa/typescript-check.sh typescript-di/structural-typing.ts
```

### Manual Docker Commands

**PHP Analysis:**
```bash
# PHPStan (Level 8 static analysis)
docker compose -f docker-compose.qa.yml run --rm php-qa /app/bin/phpstan analyse <file> --level=8 --no-progress

# PHP-CS-Fixer (code style check)
docker compose -f docker-compose.qa.yml run --rm php-cs-fixer /app/bin/php-cs-fixer fix <file> --dry-run --diff
```

**TypeScript Analysis:**
```bash
# TypeScript compiler (type checking)
docker compose -f docker-compose.qa.yml run --rm typescript-qa tsc --noEmit <file>

# ESLint
docker compose -f docker-compose.qa.yml run --rm eslint-qa eslint <file>
```

## Quality Tools

### PHP (PHP 8.4 + PHPStan 2.1)
- **PHPStan**: Level 8 static analysis (strictest)
- **PHP-CS-Fixer**: PSR-12 + custom rules for consistent code style

### TypeScript  
- **TypeScript Compiler**: Full type checking with strict mode
- **ESLint**: Recommended rules + TypeScript-specific rules

## File-by-File Approach

**Why individual files?**
- Apply strict QA only to "good" example snippets
- Skip QA on intentional anti-pattern examples (e.g., `*-bad.php`, `*-wrong.ts`)
- Targeted analysis for specific code validation needs
- Avoid false positives from educational "bad" examples

## Notes

- QA tools run in read-only mode - they won't modify your files
- Containers are ephemeral and removed after each run
- File paths are relative to `code-snippets/` directory
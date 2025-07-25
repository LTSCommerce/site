#!/bin/bash
# Run the complete QA pipeline
./bin/qa

# Run with a specific PHP version
export PHP_QA_CI_PHP_EXECUTABLE=/usr/bin/php8.3
./bin/qa

# Run on a specific directory
./bin/qa /path/to/scan

# Run a single tool (example with PHPStan)
./bin/qa -t phpstan
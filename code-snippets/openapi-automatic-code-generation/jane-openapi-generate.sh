# Install the generator
composer require lts/php-openapi-generator

# Generate PHP models and API client from your spec
vendor/bin/jane-openapi generate --config-file .jane-openapi

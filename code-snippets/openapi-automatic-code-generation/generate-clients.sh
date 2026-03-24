# Install OpenAPI Generator via npm (cross-platform wrapper)
npm install @openapitools/openapi-generator-cli -g

# Generate a PHP client from your spec
openapi-generator-cli generate \
  -i api-spec.yaml \
  -g php \
  -o ./generated/php-client \
  --additional-properties=invokerPackage=App\\ApiClient,composerPackageName=mycompany/api-client

# Generate a TypeScript Axios client
openapi-generator-cli generate \
  -i api-spec.yaml \
  -g typescript-axios \
  -o ./generated/ts-client

# Generate Laravel server stubs
openapi-generator-cli generate \
  -i api-spec.yaml \
  -g php-laravel \
  -o ./generated/laravel-server

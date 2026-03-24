docker run --rm \
  -v "$(pwd):/local" \
  openapitools/openapi-generator-cli generate \
  -i /local/api-spec.yaml \
  -g php \
  -o /local/generated/php-client

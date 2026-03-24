# Use custom templates
openapi-generator-cli generate \
  -i api-spec.yaml \
  -g php \
  -o ./generated/php-client \
  -t ./openapi-templates/php

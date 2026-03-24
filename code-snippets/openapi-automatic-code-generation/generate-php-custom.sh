# Generate with custom namespace and Composer package name
openapi-generator-cli generate \
  -i api-spec.yaml \
  -g php \
  -o ./generated/php-client \
  --additional-properties=invokerPackage=Acme\\CatalogueClient \
  --additional-properties=composerPackageName=acme/catalogue-client \
  --additional-properties=phpVersion=8.2

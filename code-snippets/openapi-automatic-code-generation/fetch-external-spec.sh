# Grab the spec from the provider
curl -o payments-api.yaml https://api.payments-provider.com/v1/openapi.yaml

# Generate a PHP client
openapi-generator-cli generate \
  -i payments-api.yaml \
  -g php \
  -o ./generated/payments-client \
  --additional-properties=invokerPackage=App\\Payments

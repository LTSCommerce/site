# Generate JSON specification
php bin/console nelmio:apidoc:dump --format=json > openapi.json

# Generate YAML specification
php bin/console nelmio:apidoc:dump --format=yaml > openapi.yaml

# View in browser (default Symfony route)
# Visit http://localhost:8000/api/doc

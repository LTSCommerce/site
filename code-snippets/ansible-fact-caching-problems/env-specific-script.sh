#!/bin/bash

# Environment-specific Ansible execution script
# This is the only practical workaround for environment-specific fact caching

ENVIRONMENT=\${1:-development}

case \$ENVIRONMENT in
    "development")
        ANSIBLE_CONFIG="ansible-dev.cfg"
        ;;
    "staging")
        ANSIBLE_CONFIG="ansible-staging.cfg"
        ;;
    "production")
        ANSIBLE_CONFIG="ansible-prod.cfg"
        ;;
    *)
        echo "Error: Unknown environment '\$ENVIRONMENT'"
        echo "Usage: \$0 [development|staging|production]"
        exit 1
        ;;
esac

echo "Using configuration: $ANSIBLE_CONFIG"
echo "Fact cache will be environment-specific"

# Export the config and run ansible-playbook
export ANSIBLE_CONFIG
ansible-playbook -i "inventory/\$ENVIRONMENT" "\$@"
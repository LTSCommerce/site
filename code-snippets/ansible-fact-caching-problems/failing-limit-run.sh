#!/bin/bash

# This demonstrates the problem with --limit and memory caching
# The playbook will fail because facts for non-limited hosts aren't available

echo "=== Running with --limit (this will likely fail) ==="
ansible-playbook -i inventory/production deploy.yml --limit app01

echo ""
echo "Error: Cannot access hostvars for hosts not in the --limit scope"
echo "because memory cache only contains facts for gathered hosts"
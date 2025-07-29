#!/bin/bash

# Workaround: Pre-populate fact cache before running with --limit

echo "=== Step 1: Gather facts for all hosts (populates cache) ==="
ansible-playbook -i inventory/production gather-facts.yml

echo ""
echo "=== Step 2: Run deployment with --limit (now works with cached facts) ==="
ansible-playbook -i inventory/production deploy.yml --limit app01

echo ""
echo "Success: Cached facts are available for all hosts even with --limit"
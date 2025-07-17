#!/bin/bash

# Check Ansible connectivity
ansible all -i inventories/production/hosts -m ping

# Run playbook in check mode
ansible-playbook -i inventories/production/hosts playbooks/site.yml --check

# Run with increased verbosity
ansible-playbook -i inventories/production/hosts playbooks/site.yml -vvv

# Test specific host
ansible web1.example.com -i inventories/production/hosts -m setup

# Check syntax
ansible-playbook playbooks/site.yml --syntax-check

# List hosts
ansible-inventory -i inventories/production/hosts --list

# Run specific tags
ansible-playbook -i inventories/production/hosts playbooks/site.yml --tags "php,nginx"
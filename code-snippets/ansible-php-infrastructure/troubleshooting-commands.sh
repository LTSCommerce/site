# Test connectivity
ansible all -m ping -i inventories/production/hosts

# Check SSH configuration
ansible all -m setup -i inventories/production/hosts | grep ansible_ssh

# Debug playbook execution
ansible-playbook -i inventories/production/hosts playbooks/deploy.yml -vvv
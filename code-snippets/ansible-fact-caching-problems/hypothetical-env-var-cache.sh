# This should work but doesn't
export ANSIBLE_FACT_CACHE_CONNECTION="/tmp/facts-${ENVIRONMENT}"
ansible-playbook deploy.yml

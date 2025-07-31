#!/bin/bash
# AFTER: Guard clauses with early exits
set -euo pipefail  # Strict mode for better error handling

function deploy_application() {
    local app_name="$1"
    local environment="$2"
    
    # Guard clauses handle prerequisites upfront
    if [[ -z "$app_name" ]]; then
        echo "Application name required" >&2
        return 1
    fi
    
    if [[ "$environment" != "production" && "$environment" != "staging" ]]; then
        echo "Invalid environment. Use 'production' or 'staging'" >&2
        return 1
    fi
    
    if [[ ! -f "docker-compose.yml" ]]; then
        echo "docker-compose.yml not found" >&2
        return 1
    fi
    
    if [[ ! $(docker ps -q 2>/dev/null) ]]; then
        echo "Docker daemon not running" >&2
        return 1
    fi
    
    if [[ ! -d "deployment-configs/$environment" ]]; then
        echo "Environment config directory not found" >&2
        return 1
    fi
    
    # Main deployment logic - clean and focused
    echo "Starting deployment for $app_name to $environment..."
    
    docker-compose -f docker-compose.yml \
                   -f "deployment-configs/$environment/docker-compose.override.yml" \
                   up -d
    
    echo "Deployment successful for $app_name"
    return 0
}
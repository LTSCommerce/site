#!/bin/bash
# BEFORE: Deeply nested conditions

function deploy_application() {
    local app_name="$1"
    local environment="$2"
    
    if [[ -n "$app_name" ]]; then
        if [[ "$environment" == "production" || "$environment" == "staging" ]]; then
            if [[ -f "docker-compose.yml" ]]; then
                if [[ $(docker ps -q) ]]; then
                    if [[ -d "deployment-configs/$environment" ]]; then
                        echo "Starting deployment..."
                        docker-compose -f docker-compose.yml \
                                      -f "deployment-configs/$environment/docker-compose.override.yml" up -d
                        
                        if [[ $? -eq 0 ]]; then
                            echo "Deployment successful"
                            return 0
                        else
                            echo "Deployment failed"
                            return 1
                        fi
                    else
                        echo "Environment config directory not found"
                        return 1
                    fi
                else
                    echo "Docker daemon not running"
                    return 1
                fi
            else
                echo "docker-compose.yml not found"
                return 1
            fi
        else
            echo "Invalid environment. Use 'production' or 'staging'"
            return 1
        fi
    else
        echo "Application name required"
        return 1
    fi
}
#!/bin/bash

# Unix Philosophy in Practice: Shell Scripts for Infrastructure Management
# Each script does one thing well, works with text streams, and composes with others

set -euo pipefail  # Fail fast and handle errors

# Configuration (Unix principle: text-based configuration)
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG_FILE="${SCRIPT_DIR}/services.conf"
readonly LOG_FILE="/var/log/service-management.log"

# Logging function (single responsibility)
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Health check function (do one thing well)
check_service_health() {
    local service_name="$1"
    local health_url="$2"
    local timeout="${3:-10}"
    
    if curl -f -s --max-time "$timeout" "$health_url" > /dev/null 2>&1; then
        log "INFO" "Service $service_name is healthy"
        return 0
    else
        log "ERROR" "Service $service_name health check failed"
        return 1
    fi
}

# Service deployment (single focused task)
deploy_service() {
    local service_name="$1"
    local image_tag="$2"
    local port="$3"
    
    log "INFO" "Deploying $service_name with tag $image_tag"
    
    # Stop existing container if running
    if docker ps -q -f name="$service_name" | grep -q .; then
        log "INFO" "Stopping existing $service_name container"
        docker stop "$service_name" || true
        docker rm "$service_name" || true
    fi
    
    # Deploy new container
    docker run -d \
        --name "$service_name" \
        --restart unless-stopped \
        -p "$port:$port" \
        -e SERVICE_NAME="$service_name" \
        -e PORT="$port" \
        "company/$service_name:$image_tag"
    
    # Wait for service to be ready
    local health_url="http://localhost:$port/health"
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if check_service_health "$service_name" "$health_url" 5; then
            log "INFO" "Service $service_name deployed successfully"
            return 0
        fi
        
        log "INFO" "Waiting for $service_name to be ready (attempt $attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    log "ERROR" "Service $service_name failed to become healthy"
    return 1
}

# Load balancer configuration (text processing)
generate_nginx_config() {
    local config_file="$1"
    
    cat > "$config_file" << 'EOF'
upstream backend {
    least_conn;
EOF
    
    # Read service configurations and generate upstream servers
    while IFS='=' read -r service port; do
        # Skip comments and empty lines
        [[ "$service" =~ ^#.*$ ]] || [[ -z "$service" ]] && continue
        
        # Get running containers for this service
        local containers=$(docker ps --format "{{.Names}}" -f name="^${service}-[0-9]+$")
        
        if [[ -n "$containers" ]]; then
            while read -r container; do
                echo "    server localhost:$port max_fails=3 fail_timeout=30s;" >> "$config_file"
            done <<< "$containers"
        fi
    done < "$CONFIG_FILE"
    
    cat >> "$config_file" << 'EOF'
}

server {
    listen 80;
    server_name api.company.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
        }
    }
}
EOF
    
    log "INFO" "Generated nginx configuration: $config_file"
}

# Circuit breaker implementation (resilience pattern)
circuit_breaker() {
    local service_name="$1"
    local max_failures="${2:-5}"
    local timeout="${3:-300}"  # 5 minutes
    
    local failure_file="/tmp/circuit_breaker_${service_name}_failures"
    local timeout_file="/tmp/circuit_breaker_${service_name}_timeout"
    
    # Check if circuit is open (in timeout)
    if [[ -f "$timeout_file" ]]; then
        local timeout_start=$(cat "$timeout_file")
        local current_time=$(date +%s)
        
        if (( current_time - timeout_start < timeout )); then
            log "WARN" "Circuit breaker open for $service_name (cooling down)"
            return 1
        else
            # Timeout expired, reset circuit breaker
            rm -f "$timeout_file" "$failure_file"
            log "INFO" "Circuit breaker reset for $service_name"
        fi
    fi
    
    # Get current failure count
    local failures=0
    if [[ -f "$failure_file" ]]; then
        failures=$(cat "$failure_file")
    fi
    
    # Check if we've exceeded max failures
    if (( failures >= max_failures )); then
        echo "$(date +%s)" > "$timeout_file"
        log "WARN" "Circuit breaker opened for $service_name (max failures reached)"
        return 1
    fi
    
    return 0
}

# Record circuit breaker success/failure
record_circuit_breaker_result() {
    local service_name="$1"
    local success="$2"  # true or false
    
    local failure_file="/tmp/circuit_breaker_${service_name}_failures"
    
    if [[ "$success" == "true" ]]; then
        # Success: reset failure count
        rm -f "$failure_file"
        log "DEBUG" "Circuit breaker success recorded for $service_name"
    else
        # Failure: increment counter
        local failures=0
        if [[ -f "$failure_file" ]]; then
            failures=$(cat "$failure_file")
        fi
        echo $((failures + 1)) > "$failure_file"
        log "DEBUG" "Circuit breaker failure recorded for $service_name (count: $((failures + 1)))"
    fi
}

# Rolling deployment with health checks
rolling_deploy() {
    local service_name="$1"
    local new_version="$2"
    local instances="${3:-3}"
    
    log "INFO" "Starting rolling deployment of $service_name to version $new_version"
    
    # Get current running instances
    local current_instances=$(docker ps --format "{{.Names}}" -f name="^${service_name}-[0-9]+$" | sort)
    local instance_count=$(echo "$current_instances" | wc -l)
    
    # Deploy new instances one by one
    local port_base=8080
    for i in $(seq 1 "$instances"); do
        local instance_name="${service_name}-${i}"
        local port=$((port_base + i - 1))
        
        log "INFO" "Deploying instance $instance_name on port $port"
        
        # Deploy new instance
        docker run -d \
            --name "${instance_name}-new" \
            --restart unless-stopped \
            -p "$port:8080" \
            -e INSTANCE_NAME="$instance_name" \
            "company/$service_name:$new_version"
        
        # Wait for health check
        if check_service_health "${instance_name}-new" "http://localhost:$port/health" 30; then
            # Stop old instance and rename new one
            if docker ps -q -f name="^${instance_name}$" | grep -q .; then
                docker stop "$instance_name"
                docker rm "$instance_name"
            fi
            
            docker rename "${instance_name}-new" "$instance_name"
            log "INFO" "Instance $instance_name updated successfully"
        else
            # Rollback on failure
            log "ERROR" "Instance $instance_name health check failed, rolling back"
            docker stop "${instance_name}-new"
            docker rm "${instance_name}-new"
            return 1
        fi
        
        # Brief pause between deployments
        sleep 10
    done
    
    log "INFO" "Rolling deployment completed successfully"
}

# Data pipeline processing (text streams)
process_service_logs() {
    local service_pattern="$1"
    local output_file="${2:-/tmp/processed_logs.json}"
    
    log "INFO" "Processing logs for services matching: $service_pattern"
    
    # Get logs from all matching services and process through pipeline
    docker ps --format "{{.Names}}" | grep "$service_pattern" | while read -r container; do
        docker logs --since="1h" --timestamps "$container" 2>&1
    done | \
    # Parse timestamp and message
    sed -E 's/^([0-9T:-]+\.[0-9]+Z) (.*)$/{"timestamp":"\1","message":"\2","container":"'$container'"}/' | \
    # Filter for error messages
    grep -i 'error\|exception\|failed' | \
    # Format as JSON array
    jq -s '.' > "$output_file"
    
    log "INFO" "Processed logs saved to: $output_file"
}

# Backup and restore (composable tools)
backup_service_data() {
    local service_name="$1"
    local backup_dir="${2:-/backup}"
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    
    log "INFO" "Starting backup for $service_name"
    
    # Create backup directory
    mkdir -p "$backup_dir"
    
    # Get service data volume
    local volume=$(docker inspect "$service_name" --format '{{range .Mounts}}{{if eq .Destination "/data"}}{{.Source}}{{end}}{{end}}')
    
    if [[ -n "$volume" ]]; then
        # Create compressed backup
        tar -czf "${backup_dir}/${service_name}_${timestamp}.tar.gz" -C "$volume" .
        log "INFO" "Backup created: ${backup_dir}/${service_name}_${timestamp}.tar.gz"
        
        # Keep only last 7 backups
        find "$backup_dir" -name "${service_name}_*.tar.gz" -type f -mtime +7 -delete
        log "INFO" "Old backups cleaned up"
    else
        log "WARN" "No data volume found for $service_name"
        return 1
    fi
}

# Main orchestration function
main() {
    local command="${1:-help}"
    
    case "$command" in
        "deploy")
            [[ $# -ne 4 ]] && { echo "Usage: $0 deploy <service> <version> <port>"; exit 1; }
            deploy_service "$2" "$3" "$4"
            ;;
        "health")
            [[ $# -ne 3 ]] && { echo "Usage: $0 health <service> <url>"; exit 1; }
            check_service_health "$2" "$3"
            ;;
        "rolling-deploy")
            [[ $# -lt 3 ]] && { echo "Usage: $0 rolling-deploy <service> <version> [instances]"; exit 1; }
            rolling_deploy "$2" "$3" "${4:-3}"
            ;;
        "generate-config")
            [[ $# -ne 2 ]] && { echo "Usage: $0 generate-config <config-file>"; exit 1; }
            generate_nginx_config "$2"
            ;;
        "process-logs")
            [[ $# -lt 2 ]] && { echo "Usage: $0 process-logs <pattern> [output-file]"; exit 1; }
            process_service_logs "$2" "${3:-}"
            ;;
        "backup")
            [[ $# -lt 2 ]] && { echo "Usage: $0 backup <service> [backup-dir]"; exit 1; }
            backup_service_data "$2" "${3:-}"
            ;;
        "circuit-test")
            [[ $# -ne 2 ]] && { echo "Usage: $0 circuit-test <service>"; exit 1; }
            if circuit_breaker "$2"; then
                echo "Circuit breaker allows traffic for $2"
            else
                echo "Circuit breaker blocking traffic for $2"
            fi
            ;;
        "help"|*)
            cat << EOF
Unix Philosophy Infrastructure Management

Commands:
  deploy <service> <version> <port>     Deploy a single service
  health <service> <url>                Check service health
  rolling-deploy <service> <version>    Perform rolling deployment
  generate-config <config-file>         Generate nginx configuration
  process-logs <pattern> [output]       Process and analyze service logs
  backup <service> [backup-dir]         Backup service data
  circuit-test <service>                Test circuit breaker status

Each command follows Unix principles:
- Does one thing well
- Works with text streams
- Composes with other tools
- Fails fast with clear errors
EOF
            ;;
    esac
}

# Ensure we have required dependencies
check_dependencies() {
    local deps=("docker" "curl" "jq")
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log "ERROR" "Required dependency not found: $dep"
            exit 1
        fi
    done
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_dependencies
    main "$@"
fi
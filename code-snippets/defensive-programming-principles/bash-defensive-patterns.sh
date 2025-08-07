#!/bin/bash

# Bad: Non-defensive bash script
deploy_app() {
    cd /var/www/app
    git pull origin main
    composer install --no-dev
    php artisan migrate --force
    sudo systemctl restart php8.3-fpm
    php artisan cache:clear
}

# Good: Defensive bash script with proper error handling
deploy_app() {
    local app_dir="/var/www/app"
    local php_service="php8.3-fpm"
    
    # Validate environment
    if [[ ! -d "$app_dir" ]]; then
        echo "Error: Application directory does not exist: $app_dir" >&2
        return 1
    fi
    
    if ! command -v php >/dev/null 2>&1; then
        echo "Error: PHP is not installed or not in PATH" >&2
        return 1
    fi
    
    if ! command -v composer >/dev/null 2>&1; then
        echo "Error: Composer is not installed or not in PATH" >&2
        return 1
    fi
    
    # Change to app directory safely
    if ! cd "$app_dir"; then
        echo "Error: Could not change to directory: $app_dir" >&2
        return 1
    fi
    
    echo "Pulling latest code..."
    if ! git pull origin main; then
        echo "Error: Git pull failed" >&2
        return 1
    fi
    
    echo "Installing dependencies..."
    if ! composer install --no-dev --optimize-autoloader; then
        echo "Error: Composer install failed" >&2
        return 1
    fi
    
    echo "Running database migrations..."
    if ! php artisan migrate --force; then
        echo "Error: Database migration failed" >&2
        return 1
    fi
    
    echo "Restarting PHP-FPM..."
    if ! sudo systemctl restart "$php_service"; then
        echo "Error: Could not restart $php_service" >&2
        return 1
    fi
    
    echo "Clearing application cache..."
    if ! php artisan cache:clear; then
        echo "Error: Cache clear failed" >&2
        return 1
    fi
    
    echo "Deployment completed successfully!"
    return 0
}

# YAGNI Applied: Simple backup script
backup_database() {
    local db_name="${1:-app_production}"
    local backup_dir="/backups/mysql"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/${db_name}_${timestamp}.sql"
    
    # Simple validation - only what's actually needed
    [[ -z "$db_name" ]] && { echo "Database name required" >&2; return 1; }
    [[ ! -d "$backup_dir" ]] && mkdir -p "$backup_dir"
    
    # Perform backup
    if mysqldump "$db_name" > "$backup_file"; then
        echo "Backup created: $backup_file"
        # Keep only last 7 days of backups
        find "$backup_dir" -name "${db_name}_*.sql" -mtime +7 -delete
        return 0
    else
        echo "Backup failed" >&2
        return 1
    fi
}

# Make Invalid States Unrepresentable: File permissions
secure_file_permissions() {
    local file="$1"
    local expected_owner="$2"
    local expected_mode="$3"
    
    # Validate inputs exist
    if [[ -z "$file" || -z "$expected_owner" || -z "$expected_mode" ]]; then
        echo "Usage: secure_file_permissions <file> <owner> <mode>" >&2
        return 1
    fi
    
    # File must exist
    if [[ ! -f "$file" ]]; then
        echo "Error: File does not exist: $file" >&2
        return 1
    fi
    
    # Get current file stats
    local current_owner current_mode
    current_owner=$(stat -c "%U:%G" "$file")
    current_mode=$(stat -c "%a" "$file")
    
    # Fix ownership if incorrect
    if [[ "$current_owner" != "$expected_owner" ]]; then
        echo "Fixing ownership: $file ($current_owner -> $expected_owner)"
        chown "$expected_owner" "$file" || return 1
    fi
    
    # Fix permissions if incorrect
    if [[ "$current_mode" != "$expected_mode" ]]; then
        echo "Fixing permissions: $file ($current_mode -> $expected_mode)"
        chmod "$expected_mode" "$file" || return 1
    fi
    
    echo "File security validated: $file"
    return 0
}

# Usage with proper error handling
main() {
    if ! deploy_app; then
        echo "Deployment failed, aborting" >&2
        exit 1
    fi
    
    if ! backup_database "my_app"; then
        echo "Backup failed, but deployment succeeded" >&2
        exit 2
    fi
    
    echo "All operations completed successfully"
}
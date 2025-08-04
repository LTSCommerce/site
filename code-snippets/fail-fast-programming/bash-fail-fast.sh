#!/bin/bash

# ANTI-PATTERN: Defensive scripting that hides errors
deploy_application_defensive() {
    # Set some basic error handling, but not strict enough
    set -e
    
    local app_name="${1:-myapp}"  # Default fallback hides missing parameter
    local environment="${2:-dev}"  # Another default that masks problems
    local version="${3:-latest}"   # Generic fallback
    
    echo "Deploying $app_name to $environment..."
    
    # Anti-pattern: Check if directory exists, create if missing
    if [ ! -d "/opt/apps/$app_name" ]; then
        mkdir -p "/opt/apps/$app_name" 2>/dev/null || {
            echo "Warning: Could not create directory, trying to continue..."
            # Continue anyway - fingers crossed!
        }
    fi
    
    # Anti-pattern: Try to download, but continue if it fails
    if ! wget -q "https://releases.example.com/$app_name/$version.tar.gz" -O "/tmp/$app_name.tar.gz"; then
        echo "Warning: Download failed, checking for existing package..."
        if [ ! -f "/tmp/$app_name.tar.gz" ]; then
            echo "No package found, but continuing anyway..."
            # This will definitely fail later, but we hide it here
        fi
    fi
    
    # Anti-pattern: Extract without validating the archive
    cd "/opt/apps/$app_name" || {
        echo "Warning: Could not change to app directory"
        return 1  # Return instead of exit - caller might ignore this
    }
    
    # Continue even if extraction fails
    tar -xzf "/tmp/$app_name.tar.gz" 2>/dev/null || {
        echo "Warning: Extraction failed, but continuing..."
    }
    
    echo "Deployment complete (maybe?)"
}

# FAIL-FAST APPROACH: Strict validation and immediate failure
deploy_application_fail_fast() {
    # Strict error handling - fail on any error, undefined variable, or pipe failure
    set -euo pipefail
    
    # Guard clause: Validate all required parameters
    if [[ $# -ne 3 ]]; then
        echo "ERROR: Exactly 3 parameters required: app_name, environment, version" >&2
        echo "Usage: deploy_application_fail_fast <app_name> <environment> <version>" >&2
        exit 1
    fi
    
    local app_name="$1"
    local environment="$2"
    local version="$3"
    
    # Guard clause: Validate parameter values
    if [[ -z "$app_name" ]]; then
        echo "ERROR: app_name cannot be empty" >&2
        exit 1
    fi
    
    if [[ ! "$environment" =~ ^(dev|staging|prod)$ ]]; then
        echo "ERROR: environment must be one of: dev, staging, prod" >&2
        exit 1
    fi
    
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "ERROR: version must be in semantic versioning format (e.g., 1.2.3)" >&2
        exit 1
    fi
    
    echo "Starting deployment of $app_name v$version to $environment environment"
    
    # Guard clause: Validate system prerequisites
    if ! command -v wget >/dev/null 2>&1; then
        echo "ERROR: wget is required but not installed" >&2
        exit 1
    fi
    
    if ! command -v tar >/dev/null 2>&1; then
        echo "ERROR: tar is required but not installed" >&2
        exit 1
    fi
    
    # Guard clause: Validate sufficient disk space (example: 1GB minimum)
    local available_space
    available_space=$(df /opt/apps --output=avail | tail -n1)
    if [[ $available_space -lt 1048576 ]]; then
        echo "ERROR: Insufficient disk space. Need at least 1GB, have ${available_space}KB" >&2
        exit 1
    fi
    
    # Guard clause: Validate deployment directory is writable
    local app_dir="/opt/apps/$app_name"
    if [[ ! -d "$app_dir" ]]; then
        echo "Creating application directory: $app_dir"
        if ! mkdir -p "$app_dir"; then
            echo "ERROR: Failed to create directory $app_dir" >&2
            exit 1
        fi
    fi
    
    if [[ ! -w "$app_dir" ]]; then
        echo "ERROR: Directory $app_dir is not writable" >&2
        exit 1
    fi
    
    # Guard clause: Validate download URL is accessible
    local download_url="https://releases.example.com/$app_name/$version.tar.gz"
    local temp_package="/tmp/${app_name}-${version}.tar.gz"
    
    echo "Checking if package is available: $download_url"
    if ! wget --spider --quiet "$download_url"; then
        echo "ERROR: Package not found at $download_url" >&2
        exit 1
    fi
    
    # Guard clause: Download with verification
    echo "Downloading package..."
    if ! wget --quiet --show-progress "$download_url" -O "$temp_package"; then
        echo "ERROR: Failed to download package from $download_url" >&2
        exit 1
    fi
    
    # Guard clause: Validate downloaded package
    if [[ ! -f "$temp_package" ]] || [[ ! -s "$temp_package" ]]; then
        echo "ERROR: Downloaded package is missing or empty" >&2
        exit 1
    fi
    
    # Guard clause: Validate archive integrity
    echo "Validating package integrity..."
    if ! tar -tzf "$temp_package" >/dev/null; then
        echo "ERROR: Downloaded package is corrupted" >&2
        rm -f "$temp_package"
        exit 1
    fi
    
    # All validations passed - perform the actual deployment
    echo "Extracting package to $app_dir..."
    cd "$app_dir"
    tar -xzf "$temp_package"
    
    # Cleanup
    rm -f "$temp_package"
    
    echo "SUCCESS: $app_name v$version deployed to $environment"
}

# Example usage with error handling
main() {
    # This will fail fast if parameters are wrong
    if ! deploy_application_fail_fast "$@"; then
        echo "DEPLOYMENT FAILED" >&2
        exit 1
    fi
    
    echo "Post-deployment tasks can safely proceed here"
}

# Call main with all script arguments if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
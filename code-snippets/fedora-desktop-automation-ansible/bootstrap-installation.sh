#!/bin/bash
# Fedora Desktop Automation Bootstrap Script
# Based on LongTermSupport/fedora-desktop approach
# Transforms fresh Fedora installation into configured development environment

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration variables
readonly SCRIPT_NAME="$(basename "$0")"
readonly PROJECTS_DIR="$HOME/Projects"
readonly FEDORA_DESKTOP_REPO="https://github.com/LongTermSupport/fedora-desktop.git"
readonly MIN_FEDORA_VERSION=40

# Logging functions
log_info() {
    echo "ℹ️  [INFO] $*" >&2
}

log_success() {
    echo "✅ [SUCCESS] $*" >&2
}

log_warning() {
    echo "⚠️  [WARNING] $*" >&2
}

log_error() {
    echo "❌ [ERROR] $*" >&2
}

log_step() {
    echo "🚀 [STEP] $*" >&2
}

# Error handling
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Script failed with exit code: $exit_code"
        log_info "Check logs above for details"
    fi
    exit $exit_code
}

trap cleanup EXIT

# Preflight checks
check_prerequisites() {
    log_step "Running preflight checks..."
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        log_error "Do not run this script as root!"
        log_info "This script configures a user desktop environment"
        exit 1
    fi
    
    # Check Fedora distribution
    if ! grep -q "Fedora" /etc/os-release; then
        log_error "This script requires Fedora Linux"
        exit 1
    fi
    
    # Check Fedora version
    local fedora_version
    fedora_version=$(grep -oP 'VERSION_ID=\K\d+' /etc/os-release)
    if [[ $fedora_version -lt $MIN_FEDORA_VERSION ]]; then
        log_error "Fedora $MIN_FEDORA_VERSION or higher required (found: $fedora_version)"
        exit 1
    fi
    
    log_success "Preflight checks passed (Fedora $fedora_version)"
}

# System package installation
install_system_packages() {
    log_step "Installing system packages..."
    
    local packages=(
        git
        python3
        python3-pip
        ansible
        curl
        wget
        jq
        openssl
        dnf-plugins-core
    )
    
    log_info "Updating system packages..."
    sudo dnf update -y --refresh
    
    log_info "Installing required packages: ${packages[*]}"
    sudo dnf install -y "${packages[@]}"
    
    # Enable RPM Fusion repositories for multimedia
    log_info "Enabling RPM Fusion repositories..."
    sudo dnf install -y \
        "https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm" \
        "https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm" || true
    
    log_success "System packages installed"
}

# GitHub CLI installation
install_github_cli() {
    log_step "Installing GitHub CLI..."
    
    if command -v gh >/dev/null 2>&1; then
        log_info "GitHub CLI already installed: $(gh --version | head -n1)"
        return
    fi
    
    # Add GitHub CLI repository
    sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
    sudo dnf install -y gh
    
    log_success "GitHub CLI installed: $(gh --version | head -n1)"
}

# SSH key setup
setup_ssh_keys() {
    log_step "Setting up SSH keys..."
    
    local ssh_dir="$HOME/.ssh"
    local ssh_key="$ssh_dir/id_ed25519"
    
    # Create SSH directory
    [[ ! -d "$ssh_dir" ]] && mkdir -p "$ssh_dir" && chmod 700 "$ssh_dir"
    
    # Generate SSH key if it doesn't exist
    if [[ ! -f "$ssh_key" ]]; then
        log_info "Generating new SSH key..."
        read -p "Enter your email address for SSH key: " email
        ssh-keygen -t ed25519 -C "$email" -f "$ssh_key" -N ""
        chmod 600 "$ssh_key"
        log_success "SSH key generated: $ssh_key"
    else
        log_info "SSH key already exists: $ssh_key"
    fi
    
    # Start SSH agent and add key
    if ! pgrep -x ssh-agent >/dev/null; then
        eval "$(ssh-agent -s)"
    fi
    ssh-add "$ssh_key" 2>/dev/null || true
    
    # Display public key for user
    echo
    log_info "🔑 Your SSH public key (add this to GitHub):"
    echo "$(cat "${ssh_key}.pub")"
    echo
}

# Project directory setup
setup_project_structure() {
    log_step "Setting up project directory structure..."
    
    local dirs=(
        "$PROJECTS_DIR"
        "$PROJECTS_DIR/personal"
        "$PROJECTS_DIR/work"
        "$PROJECTS_DIR/opensource"
        "$PROJECTS_DIR/automation"
    )
    
    for dir in "${dirs[@]}"; do
        [[ ! -d "$dir" ]] && mkdir -p "$dir"
        log_info "Created directory: $dir"
    done
    
    log_success "Project structure created"
}

# Clone fedora-desktop repository
clone_automation_repo() {
    log_step "Cloning fedora-desktop automation repository..."
    
    local repo_dir="$PROJECTS_DIR/automation/fedora-desktop"
    
    if [[ -d "$repo_dir" ]]; then
        log_info "Repository already exists, updating..."
        cd "$repo_dir"
        git pull origin main
    else
        log_info "Cloning repository..."
        git clone "$FEDORA_DESKTOP_REPO" "$repo_dir"
        cd "$repo_dir"
    fi
    
    log_success "Repository ready: $repo_dir"
}

# Run Ansible playbook
run_ansible_automation() {
    log_step "Running Ansible automation..."
    
    cd "$PROJECTS_DIR/automation/fedora-desktop"
    
    # Install Ansible requirements if they exist
    [[ -f "requirements.yml" ]] && ansible-galaxy install -r requirements.yml
    
    # Run the main playbook
    log_info "Executing main Ansible playbook..."
    ansible-playbook -i "localhost," -c local playbooks/playbook-main.yml --ask-become-pass
    
    log_success "Ansible automation completed"
}

# Main execution
main() {
    log_info "🐧 Fedora Desktop Automation Bootstrap"
    log_info "======================================"
    
    check_prerequisites
    install_system_packages
    install_github_cli
    setup_ssh_keys
    setup_project_structure
    clone_automation_repo
    run_ansible_automation
    
    echo
    log_success "🎉 Fedora desktop automation completed!"
    log_info "Next steps:"
    echo "  1. Add your SSH key to GitHub: https://github.com/settings/keys"
    echo "  2. Authenticate GitHub CLI: gh auth login"
    echo "  3. Run optional playbooks as needed"
    echo "  4. Customize your environment in: $PROJECTS_DIR/automation/fedora-desktop"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
#!/bin/bash
# GitHub CLI Multi-Account Configuration Script
# Demonstrates modern GitHub workflow automation with multiple accounts

set -euo pipefail

# Configuration
readonly SCRIPT_NAME="$(basename "$0")"

# Logging functions
log_info() { echo "ℹ️  [INFO] $*" >&2; }
log_success() { echo "✅ [SUCCESS] $*" >&2; }
log_error() { echo "❌ [ERROR] $*" >&2; }
log_step() { echo "🚀 [STEP] $*" >&2; }

# Check GitHub CLI installation
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed"
        log_info "Install with: sudo dnf install gh"
        exit 1
    fi
    log_success "GitHub CLI found: $(gh --version | head -n1)"
}

# Setup multiple GitHub accounts
setup_multiple_accounts() {
    log_step "Setting up multiple GitHub accounts..."
    
    # Check current authentication status
    log_info "Current GitHub CLI authentication status:"
    gh auth status || log_info "No accounts currently authenticated"
    
    echo
    log_info "🔐 GitHub Multi-Account Setup Guide:"
    echo "=================================="
    
    # Personal account setup
    echo "1️⃣  PERSONAL ACCOUNT SETUP:"
    echo "   gh auth login --hostname github.com --git-protocol ssh --web"
    echo "   - Choose: GitHub.com"
    echo "   - Choose: SSH"
    echo "   - Choose: Upload SSH public key (or paste existing)"
    echo "   - Choose: Login with web browser"
    echo
    
    # Work account setup  
    echo "2️⃣  WORK ACCOUNT SETUP:"
    echo "   gh auth login --hostname github.com --git-protocol ssh --web"
    echo "   - Follow same steps with work credentials"
    echo "   - GitHub CLI will ADD (not replace) the second account"
    echo
    
    # Account switching
    echo "3️⃣  SWITCHING BETWEEN ACCOUNTS:"
    echo "   # List authenticated accounts:"
    echo "   gh auth status"
    echo
    echo "   # Switch to specific account:"
    echo "   gh auth switch --user YOUR_PERSONAL_USERNAME"
    echo "   gh auth switch --user YOUR_WORK_USERNAME"
    echo
    
    # Verify setup
    echo "4️⃣  VERIFY MULTI-ACCOUNT SETUP:"
    echo "   gh auth status"
    echo "   # Should show multiple accounts with one marked as 'active'"
    echo
}

# Create shell aliases for account management
create_shell_aliases() {
    log_step "Creating shell aliases for GitHub account management..."
    
    local bashrc="$HOME/.bashrc"
    local aliases_section="# GitHub CLI Multi-Account Aliases"
    
    # Remove existing aliases section if present
    if grep -q "$aliases_section" "$bashrc"; then
        log_info "Removing existing GitHub aliases..."
        sed -i "/$aliases_section/,/^$/d" "$bashrc"
    fi
    
    # Add new aliases section
    cat >> "$bashrc" << EOF

$aliases_section
alias gh-status='gh auth status'
alias gh-switch='gh auth switch --user'
alias gh-personal='gh auth switch --user \$GH_PERSONAL_USER'
alias gh-work='gh auth switch --user \$GH_WORK_USER'

# GitHub workflow aliases
alias gh-clone='gh repo clone'
alias gh-create='gh repo create'
alias gh-fork='gh repo fork'
alias gh-pr-create='gh pr create --web'
alias gh-pr-list='gh pr list'
alias gh-pr-view='gh pr view --web'

EOF

    log_success "Shell aliases added to $bashrc"
    log_info "Reload your shell or run: source ~/.bashrc"
}

# Setup environment variables
setup_environment_variables() {
    log_step "Setting up environment variables..."
    
    local bashrc="$HOME/.bashrc"
    
    echo
    log_info "Add these to your $bashrc file:"
    echo "export GH_PERSONAL_USER='your-personal-username'"
    echo "export GH_WORK_USER='your-work-username'"
    echo
    
    # Interactive setup
    read -p "Enter your personal GitHub username (or press Enter to skip): " personal_user
    read -p "Enter your work GitHub username (or press Enter to skip): " work_user
    
    if [[ -n "$personal_user" || -n "$work_user" ]]; then
        echo "# GitHub usernames for multi-account setup" >> "$bashrc"
        [[ -n "$personal_user" ]] && echo "export GH_PERSONAL_USER='$personal_user'" >> "$bashrc"
        [[ -n "$work_user" ]] && echo "export GH_WORK_USER='$work_user'" >> "$bashrc"
        log_success "Environment variables added to $bashrc"
    fi
}

# Create project directory structure for multi-account workflow
setup_project_structure() {
    log_step "Setting up multi-account project structure..."
    
    local projects_base="$HOME/Projects"
    
    # Create directory structure
    mkdir -p "$projects_base"/{personal,work,opensource}/{github,gitlab,other}
    
    log_success "Created project directory structure:"
    tree "$projects_base" 2>/dev/null || find "$projects_base" -type d | sed 's|[^/]*/|  |g'
}

# Create Git configuration for multiple accounts
setup_git_conditional_config() {
    log_step "Setting up Git conditional configuration..."
    
    local git_config="$HOME/.gitconfig"
    
    log_info "Adding conditional Git configuration..."
    
    # Backup existing config
    [[ -f "$git_config" ]] && cp "$git_config" "${git_config}.backup.$(date +%s)"
    
    cat >> "$git_config" << 'EOF'

# Conditional configuration for different project directories
[includeIf "gitdir:~/Projects/personal/"]
    path = ~/.gitconfig-personal

[includeIf "gitdir:~/Projects/work/"]
    path = ~/.gitconfig-work

EOF

    # Create personal Git config
    cat > "$HOME/.gitconfig-personal" << 'EOF'
[user]
    name = Your Personal Name
    email = your.personal@email.com
    signingkey = ~/.ssh/id_ed25519_personal.pub

[core]
    sshCommand = ssh -i ~/.ssh/id_ed25519_personal
EOF

    # Create work Git config  
    cat > "$HOME/.gitconfig-work" << 'EOF'
[user]
    name = Your Work Name
    email = your.work@company.com
    signingkey = ~/.ssh/id_ed25519_work.pub

[core]
    sshCommand = ssh -i ~/.ssh/id_ed25519_work
EOF

    log_success "Git conditional configuration created"
    log_info "Edit ~/.gitconfig-personal and ~/.gitconfig-work with your details"
}

# Display usage examples
show_usage_examples() {
    log_step "Usage examples for multi-account workflow..."
    
    echo "🔧 DAILY WORKFLOW EXAMPLES:"
    echo "=========================="
    echo
    echo "# Check which account is active:"
    echo "gh auth status"
    echo
    echo "# Switch to personal account:"
    echo "gh-personal  # (or: gh auth switch --user your-personal)"
    echo
    echo "# Clone personal project:"
    echo "cd ~/Projects/personal/github"
    echo "gh repo clone your-personal/my-project"
    echo
    echo "# Switch to work account:"
    echo "gh-work  # (or: gh auth switch --user your-work)"
    echo
    echo "# Clone work project:"
    echo "cd ~/Projects/work/github"
    echo "gh repo clone company/work-project"
    echo
    echo "# Create PR with active account:"
    echo "gh pr create --title 'Feature: Add awesome feature' --body 'Description'"
    echo
}

# Main execution
main() {
    log_info "🐙 GitHub CLI Multi-Account Configuration"
    log_info "========================================"
    
    check_gh_cli
    setup_multiple_accounts
    create_shell_aliases
    setup_environment_variables
    setup_project_structure
    setup_git_conditional_config
    show_usage_examples
    
    echo
    log_success "🎉 GitHub multi-account setup completed!"
    log_info "Next steps:"
    echo "  1. Run the authentication commands shown above"
    echo "  2. Edit Git config files with your actual details"
    echo "  3. Reload your shell: source ~/.bashrc"
    echo "  4. Test with: gh auth status"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
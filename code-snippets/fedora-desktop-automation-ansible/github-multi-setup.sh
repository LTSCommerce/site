# GitHub CLI multi-account aliases (from play-github-cli-multi.yml)
# Account-specific aliases for seamless switching
function gh-work() {
    # Get the default account to restore later
    local default_account=$(gh-get-default)
    
    # Switch to the work account
    local current_active=$(gh auth status 2>&1 | grep -A1 "account work-user" | grep "Active account" | grep -c "true")
    if [ "$current_active" -eq 0 ]; then
        echo "Switching to work-user..."
        gh auth switch --hostname github.com --user "work-user" 2>/dev/null
    fi
    
    # Run the gh command with all arguments
    gh "$@"
    local exit_code=$?
    
    # Switch back to default account if different
    if [[ -n "$default_account" && "$default_account" != "work-user" ]]; then
        gh auth switch --hostname github.com --user "$default_account" 2>/dev/null
    fi
    
    return $exit_code
}
# Create tracking issue in each repo
gh issue create -R org/backend --title "Auth API endpoints"
gh issue create -R org/frontend --title "Auth UI components"
gh issue create -R org/infrastructure --title "Auth service deployment"

# Link related issues
gh issue comment 123 --body "Related: org/frontend#456, org/infrastructure#789"

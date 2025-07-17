#!/bin/bash
# Git hook that runs AI code review
git diff --cached --name-only | grep '\.php$' | while read file; do
    if [ -f "$file" ]; then
        echo "AI reviewing $file..."
        php ai-review.php "$file"
    fi
done
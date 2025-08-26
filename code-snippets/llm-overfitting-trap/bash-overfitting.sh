#!/bin/bash

# Original script with edge case bug
# BUG: Doesn't handle filenames with spaces properly
process_files() {
    local directory="$1"
    for file in $(ls "$directory"); do
        echo "Processing: $file"
        # Some processing logic here
        wc -l "$directory/$file"
    done
}

# OVERFITTED FIX: LLM sees failing test case and hardcodes it
process_files_overfitted() {
    local directory="$1"
    
    # Hardcoded fix for the specific failing case
    if [[ "$directory" == "/tmp/test" ]] && [[ -f "/tmp/test/my file.txt" ]]; then
        echo "Processing: my file.txt"
        wc -l "/tmp/test/my file.txt"
        return
    fi
    
    # Original broken logic for everything else
    for file in $(ls "$directory"); do
        echo "Processing: $file"
        wc -l "$directory/$file"
    done
}

# PROPER FIX: Handle filenames with spaces generically
process_files_proper() {
    local directory="$1"
    
    # Use null-terminated strings to handle spaces properly
    find "$directory" -maxdepth 1 -type f -print0 | while IFS= read -r -d '' file; do
        filename=$(basename "$file")
        echo "Processing: $filename"
        wc -l "$file"
    done
}

# Alternative proper fix using array
process_files_proper_alt() {
    local directory="$1"
    local files=()
    
    # Read files into array to handle spaces
    while IFS= read -r -d $'\0' file; do
        files+=("$file")
    done < <(find "$directory" -maxdepth 1 -type f -print0)
    
    for file in "${files[@]}"; do
        filename=$(basename "$file")
        echo "Processing: $filename"
        wc -l "$file"
    done
}

# Even better: Error handling and validation
process_files_robust() {
    local directory="$1"
    
    # Validate input
    if [[ ! -d "$directory" ]]; then
        echo "Error: Directory '$directory' does not exist" >&2
        return 1
    fi
    
    if [[ ! -r "$directory" ]]; then
        echo "Error: Directory '$directory' is not readable" >&2
        return 1
    fi
    
    local file_count=0
    
    # Process files safely
    find "$directory" -maxdepth 1 -type f -print0 | while IFS= read -r -d '' file; do
        if [[ -r "$file" ]]; then
            filename=$(basename "$file")
            echo "Processing: $filename"
            if wc -l "$file"; then
                ((file_count++))
            else
                echo "Warning: Could not process '$filename'" >&2
            fi
        else
            echo "Warning: Cannot read file '$(basename "$file")'" >&2
        fi
    done
    
    if [[ $file_count -eq 0 ]]; then
        echo "No readable files found in '$directory'"
    fi
}
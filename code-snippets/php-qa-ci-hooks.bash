#!/bin/bash
# Create custom hooks for the QA pipeline
mkdir -p qaConfig

# Pre-hook: Run before QA pipeline starts
cat > qaConfig/preBashHook.bash << 'EOF'
#!/bin/bash
echo "Starting QA pipeline for project: $(basename $(pwd))"
echo "PHP Version: $($PHP_QA_CI_PHP_EXECUTABLE --version | head -n1)"

# Clear any caches that might affect results
if [ -d "var/cache" ]; then
    rm -rf var/cache/*
fi
EOF

# Post-hook: Run after QA pipeline completes
cat > qaConfig/postBashHook.bash << 'EOF'
#!/bin/bash
echo "QA Pipeline completed!"

# Generate a summary report
if [ -f "infection.log" ]; then
    echo "Mutation Score: $(grep -oP 'Mutation Score Indicator \(MSI\): \K[0-9.]+' infection.log)%"
fi

# Send notification (example)
# curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
#   -H 'Content-type: application/json' \
#   --data '{"text":"QA Pipeline completed successfully!"}'
EOF

chmod +x qaConfig/*.bash
#!/usr/bin/env bash
# Illustrative pre-push hook for a compatibility gate.
# A gate that has never failed has never been shown to work, so the hook
# is committed together with a recorded RED run and a recorded GREEN run.
set -euo pipefail

checks_passed=0
checks_total=5

run_check() {
    if "$@"; then
        checks_passed=$((checks_passed + 1))
    fi
}

run_check php_lint_at_oldest_supported_version
run_check php_lint_at_newest_supported_version
run_check compatibility_scan_over_git_tracked_files
run_check compatibility_scan_matches_committed_baseline
run_check gate_path_list_exists_in_this_checkout

echo "compatibility gate: ${checks_passed} of ${checks_total} checks passed"

# RED proof (recorded run):    0 of 5
# GREEN proof (recorded run):  5 of 5
[ "${checks_passed}" -eq "${checks_total}" ]

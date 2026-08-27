#!/usr/bin/env bash
# Illustrative sketch of the host-side watcher a systemd --user path unit
# invokes whenever a new file lands in the request spool.
set -euo pipefail

SPOOL_DIR="/path/to/example-app/.host-bridge/requests"
COMPLETED_DIR="/path/to/example-app/.host-bridge/completed"
REJECTED_DIR="/path/to/example-app/.host-bridge/rejected"

for request in "$SPOOL_DIR"/*.json; do
    [ -e "$request" ] || continue

    verb="$(jq -r '.verb' "$request")"

    # Look up the verb's fixed argv as an array. Never build a command
    # line out of request contents. Unknown verb, empty result.
    mapfile -t argv < <(example_lookup_argv "$verb")

    if [ "${#argv[@]}" -eq 0 ]; then
        record_audit_event "$request" "rejected" "verb not in allowlist"
        mv "$request" "$REJECTED_DIR/"
        continue
    fi

    if ! within_rate_limit "$verb"; then
        record_audit_event "$request" "rejected" "rate limit exceeded"
        mv "$request" "$REJECTED_DIR/"
        continue
    fi

    if requires_manual_approval "$verb"; then
        notify_human_for_approval "$request"
        continue
    fi

    unit_name="example-app-${verb}-$(date +%s)"
    systemd-run --user --scope --unit="$unit_name" -- "${argv[@]}"

    record_audit_event "$request" "executed" "$unit_name"
    mv "$request" "$COMPLETED_DIR/"
done

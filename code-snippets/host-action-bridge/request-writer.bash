#!/usr/bin/env bash
# request.bash <verb> [service]: runs INSIDE the runtime-less agent
# container. Writes a request file, polls for a response. Never touches
# the container engine itself.
set -euo pipefail

SPOOL="$REPO_ROOT/untracked/demo-bridge"
VERB="$1"; ARG="${2:-}"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
NONCE="$(od -An -tx1 -N8 /dev/urandom | tr -d ' \n')"
REQ_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
BASE="${TS}-${VERB}-${NONCE}.json"

TMP="$(mktemp "$SPOOL/tmp/req.XXXXXX")"
jq -n --arg verb "$VERB" --arg arg "$ARG" --arg ra "$REQ_AT" \
    '{verb:$verb, arg:($arg | select(length>0)), requested_at:$ra}' > "$TMP"
mv -f "$TMP" "$SPOOL/requests/$BASE"          # atomic publish

RESP="$SPOOL/responses/${BASE}.response.json"
elapsed=0
while [ "$elapsed" -lt 120 ]; do
    if [ -f "$RESP" ]; then
        state="$(jq -r '.state // empty' "$RESP")"
        case "$state" in
            done)   exit 0 ;;
            denied|expired|failed) echo "bridge: $state" >&2; exit 70 ;;
        esac
    fi
    sleep 2; elapsed=$((elapsed + 2))
done
echo "bridge: timed out waiting for a response" >&2
exit 75

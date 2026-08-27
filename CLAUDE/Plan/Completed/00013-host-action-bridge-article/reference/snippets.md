# Snippets

Sanitised, illustrative code for the article. Each is rewritten fresh —
same technique and structure as the real implementation, generic names,
trimmed to what's needed to make the point. Not copy-pasted from any
private source. Placeholder conventions used throughout:

- project slug: `demo-app`
- containers: `demoapp_web`, `demoapp_api`, `demoapp_db`
- host user: `dev`
- repo path: `~/Projects/demo-app`
- orchestration script: `./stack.bash`
- network: `demo-app-network`
- services: `web`, `api`, `worker`, `cache`, `db` (buildable: `web`, `api`, `worker`)

## 1. The verb allowlist and fixed-argv case table

```bash
# --- Hardcoded literals (cannot be changed from the container) -------------
readonly HARDCODED_DENY="reset-db shell:web shell:api shell:db exec"
readonly ALLOWLIST="ping status health up down restart rebuild init logs"
readonly ARG_VERBS="restart rebuild logs"
readonly READONLY_VERBS="ping status health logs"
readonly BUILDABLE_SERVICES="web api worker"

# --- Fixed-argv dispatch — the ONLY thing ever executed ---------------------
build_argv() {
    local verb="$1" arg="$2"
    ARGV=()
    case "$verb" in
        status)  ARGV=("$STACK_BIN" status) ;;
        health)  ARGV=("$STACK_BIN" health) ;;
        up)      ARGV=("$STACK_BIN" start) ;;
        down)    ARGV=("$STACK_BIN" stop) ;;
        restart) ARGV=("$STACK_BIN" restart "$arg") ;;
        rebuild) ARGV=("$STACK_BIN" build "$arg") ;;
        init)    ARGV=("$STACK_BIN" init) ;;
        logs)    ARGV=("$STACK_BIN" logs "$arg") ;;
        *)       return 2 ;;   # unreachable post-validation
    esac
    return 0
}
```

**What this shows**: the whole trust boundary in ~20 lines. The set of
commands that can ever run is fully enumerable by reading this table.
`arg` is a single argv element, never interpolated into a string.

## 2. The request writer (agent side)

```bash
#!/usr/bin/env bash
# request.bash <verb> [service] — runs INSIDE the runtime-less agent
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
```

**What this shows**: the agent side does exactly two things — write a
file, poll for a file. There is no dependency on the container engine
anywhere in this script, which is why it works even inside a container
that has no runtime installed at all.

## 3. The watcher's validate step

```bash
validate_request() {
    local base="$1" raw="$2"
    V_VERB=""; V_ARG=""; V_DENY=""

    # Filename schema — rejects hostile basenames outright.
    [[ "$base" =~ ^[0-9]{8}T[0-9]{6}Z-[a-z-]+-[0-9a-f]{16}\.json$ ]] \
        || { V_DENY="basename schema violation"; return 1; }

    local verb; verb="$(jq -r '.verb // ""' <<<"$raw")"
    [ -n "$verb" ] || { V_DENY="missing verb"; return 1; }

    # Hardcoded-deny checked BEFORE the allowlist — cannot be overridden
    # by any config file.
    for d in $HARDCODED_DENY; do
        [ "$verb" = "$d" ] && { V_DENY="hardcoded-deny: $verb"; return 1; }
    done

    local ok=0
    for a in $ALLOWLIST; do [ "$verb" = "$a" ] && ok=1; done
    [ "$ok" -eq 1 ] || { V_DENY="unknown verb: $verb"; return 1; }

    # Arg-taking verbs: required, regex-shaped, then enum-checked.
    for a in $ARG_VERBS; do
        if [ "$verb" = "$a" ]; then
            local arg; arg="$(jq -r '.arg // ""' <<<"$raw")"
            [ -n "$arg" ] || { V_DENY="verb '$verb' requires an arg"; return 1; }
            [[ "$arg" =~ ^[a-z][a-z0-9_-]*$ ]] || { V_DENY="arg shape"; return 1; }
            local enum="$SERVICE_ENUM"
            [ "$verb" = "rebuild" ] && enum="$BUILDABLE_SERVICES"
            local member found=0
            for member in $enum; do [ "$arg" = "$member" ] && found=1; done
            [ "$found" -eq 1 ] || { V_DENY="arg '$arg' not enumerated"; return 1; }
            V_ARG="$arg"
        fi
    done

    V_VERB="$verb"
    return 0
}
```

**What this shows**: the full validation pipeline — basename schema,
hardcoded-deny before allowlist, arg regex before enum membership. This
is what runs on every request before anything is dispatched.

## 4. The systemd `.path` and `.service` units

```ini
# demo-bridge.path
[Unit]
Description=Demo Bridge — watch the request spool

[Path]
PathModified=%h/Projects/demo-app/untracked/demo-bridge/requests
PathExistsGlob=%h/Projects/demo-app/untracked/demo-bridge/requests/*.json
Unit=demo-bridge.service

[Install]
WantedBy=default.target
```

```ini
# demo-bridge.service
[Unit]
Description=Demo Bridge — drain the request spool once
StartLimitIntervalSec=60
StartLimitBurst=50

[Service]
Type=oneshot
ExecStart=%h/.local/bin/demo-bridge-watcher drain
KillMode=process
StandardOutput=append:%h/.local/state/demo-bridge/service.log
StandardError=append:%h/.local/state/demo-bridge/service.log
NoNewPrivileges=true
RuntimeMaxSec=1200
```

**What this shows**: a `.path` unit reacting to filesystem changes
(including a glob check at start, so a request queued while the watcher
was down still gets picked up) triggering a `Type=oneshot` `.service`.
`KillMode=process` plus `RuntimeMaxSec` bound how much damage a hung
drain can do; `StartLimitBurst` is set generously enough that a
legitimate burst of requests can't trip systemd's own crash-loop
protection.

## 5. A `policy.conf` sample

```ini
# demo-bridge policy — per-verb execution mode.
# Parsed as KEY=value, never sourced. Unknown/missing keys fail CLOSED
# to deny. There is no "confirm" mode by design — deny it here and run
# it by hand if you want a human gate.

MODE_ping=auto
MODE_status=auto
MODE_health=auto
MODE_logs=auto

MODE_up=auto
MODE_down=auto
MODE_restart=auto
MODE_rebuild=auto

# init resets seed data — flip to deny if you'd rather run it by hand.
MODE_init=auto
```

**What this shows**: policy is a flat allowlist of *modes*, not
commands — the verbs themselves are still fixed in code (snippet 1). This
file can only make a verb stricter (deny) or leave it at the code-level
default (auto); it cannot introduce a new verb or a new argv shape.

## 6. The atomic publish helper

```bash
# Write into a pinned spool subdirectory atomically and symlink-safely.
# tmp/ is on the same filesystem as the destination, so mv is atomic;
# rename() replaces a destination symlink rather than following it.
publish_atomic() {
    local destsub="$1" destname="$2" content="$3"
    local tmp
    tmp="$(mktemp "$SPOOL/tmp/wtmp.XXXXXX")" || return 1
    printf '%s' "$content" > "$tmp" || { rm -f "$tmp"; return 1; }
    mv -f "$tmp" "$SPOOL/$destsub/$destname" || { rm -f "$tmp"; return 1; }
}
```

**What this shows**: the one write pattern used for every file the
watcher produces (responses, exec logs, audit mirrors). Same-filesystem
temp + atomic rename is what makes "a response file either doesn't exist
or is fully written" a property the reader (the agent's poll loop) can
rely on — no partial reads.

## 7. Per-project namespacing (slug → unit/config/state names)

```bash
# project-slug.bash — sourced by every host-side script.
PROJECT_SLUG="${PROJECT_SLUG:-demo-app}"

# Derived, namespaced locations — every host-global artefact carries the
# slug so a second project's install can never collide with the first's.
UNIT_PATH="demo-bridge-${PROJECT_SLUG}.path"
UNIT_SERVICE="demo-bridge-${PROJECT_SLUG}.service"
CONFIG_DIR="$HOME/.config/demo-bridge/${PROJECT_SLUG}"
STATE_DIR="$HOME/.local/state/demo-bridge/${PROJECT_SLUG}"
WATCHER_BIN="$HOME/.local/bin/demo-bridge-watcher-${PROJECT_SLUG}"
```

**What this shows**: the fix for the "two projects clobber each other's
bridge" lesson (see `lessons.md`). Nothing here is namespaced by
convention alone — every path that lives outside the project's own repo
checkout (units, config, state, the installed binary) has the slug baked
into its name, so `demo-app` and a second project `other-app` can each
run their own bridge on the same host without either one's install
overwriting the other's.

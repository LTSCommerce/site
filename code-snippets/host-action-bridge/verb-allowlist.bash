# --- Hardcoded literals (cannot be changed from the container) -------------
readonly HARDCODED_DENY="reset-db shell:web shell:api shell:db exec"
readonly ALLOWLIST="ping status health up down restart rebuild init logs"
readonly ARG_VERBS="restart rebuild logs"
readonly READONLY_VERBS="ping status health logs"
readonly BUILDABLE_SERVICES="web api worker"

# --- Fixed-argv dispatch: the ONLY thing ever executed ----------------------
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

validate_request() {
    local base="$1" raw="$2"
    V_VERB=""; V_ARG=""; V_DENY=""

    # Filename schema: rejects hostile basenames outright.
    [[ "$base" =~ ^[0-9]{8}T[0-9]{6}Z-[a-z-]+-[0-9a-f]{16}\.json$ ]] \
        || { V_DENY="basename schema violation"; return 1; }

    local verb; verb="$(jq -r '.verb // ""' <<<"$raw")"
    [ -n "$verb" ] || { V_DENY="missing verb"; return 1; }

    # Hardcoded-deny checked BEFORE the allowlist: cannot be overridden
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

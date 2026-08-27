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

# Security model

The bridge exists to preserve one invariant: **the agent container never
gains the ability to run an arbitrary command on the host.** Every design
choice below traces back to that.

## 1. Closed verb allowlist, fixed argv — the single most important property

The request the agent writes contains a `verb` (a short enumerated
string) and, for a handful of verbs, an `arg` (also enumerated). It never
contains a command line, a flag, or free text that ends up on an
executed argv. The watcher's dispatcher is a `case` statement: each verb
maps to one, and only one, hardcoded argv shape.

```
case "$verb" in
    status)  ARGV=("$STACK_BIN" status) ;;
    up)      ARGV=("$STACK_BIN" start) ;;
    restart) ARGV=("$STACK_BIN" restart "$arg") ;;
    rebuild) ARGV=("$STACK_BIN" build "$arg") ;;
    *)       return 2 ;;   # unreachable post-validation — deny by construction
esac
```

Nothing here interpolates request content into a shell string. The `arg`
value is validated against an enumerated service list _before_ it ever
reaches this table (see §3), and even then it's passed as a single argv
element, never concatenated into a command string that a shell parses.
There is no `eval`, no `sh -c "$user_input"`, no string-built command
anywhere in the pipeline. This is what makes "closed allowlist" a real
security property rather than a naming convention: the set of possible
executed commands is fully enumerable by reading the `case` statement,
independent of what the agent sends.

## 2. Read-only vs. mutating verb split

Verbs are classified read-only (`status`, `health`, `logs`, `ping`) or
mutating (`up`, `down`, `restart`, `rebuild`, `init`, …). This split
matters in three places:

- **Rate limiting** (§4) exempts read-only verbs — an agent polling
  status in a loop shouldn't burn its mutation budget.
- **The integrity gate** (§7) only runs before mutating verbs — there's
  nothing to protect against a stale/dirty checkout for a verb that
  changes nothing.
- It's also a mental model for policy: read-only verbs are close to
  risk-free and can usually stay on auto-approve; mutating verbs are
  where a project should think harder about what to leave unattended.

## 3. Arg-taking verbs validated against an enumerated service list

A handful of verbs (`restart`, `rebuild`, `logs`) take a required
argument naming which service to act on. That argument is checked twice:
against a regex shape (`^[a-z][a-z0-9_-]*$`, rejecting anything with
shell metacharacters, path separators, or whitespace) and then against an
**enumerated list of real service names** derived from the project's own
compose file at install time. An argument that doesn't match a known
service name is denied outright — it never reaches the argv. `rebuild`
uses a narrower "buildable" enum than `restart`/`logs`, since not every
declared service is meant to be rebuildable from the bridge (a
test-runner sidecar container, for instance, is deliberately excluded so
it can never be bridge-built or bridge-targeted).

## 4. Per-verb policy: auto vs. deny

A small config file, seeded once at install and never overwritten on
reinstall, maps each verb to `auto` (executed immediately once other
gates pass) or `deny` (always refused, cleanly, with an audited reason).
There is deliberately **no** third "ask for confirmation" mode — a
bridge that can pause mid-flight waiting on a human is a bridge that
needs a process listening for that confirmation, which reintroduces the
kind of standing channel the design is trying to avoid. If a project
wants a human in the loop for some verb, the answer is to set that verb
to `deny` in policy and run the underlying command by hand — a real gate,
not a soft one. Any verb missing from the policy file, or carrying an
unrecognised mode string, fails **closed** to deny.

## 5. Rate limiting

A sliding-window counter (a handful of mutating requests per ten
minutes, in the reference implementation) caps how often mutating verbs
can run, independent of policy. Read-only verbs are exempt. This exists
to bound the blast radius of a runaway agent loop — a bug that causes
the agent to hammer `rebuild` in a tight loop degrades to "denied, rate
limited" rather than repeatedly rebuilding images or bouncing containers.
It is explicitly _not_ meant as a pacing mechanism for legitimate use;
during heavy interactive debugging it is normal, and correct, to
occasionally hit the limit and simply wait out the window.

## 6. Nonce, atomic publish, and symlink-safe moves

Every request filename embeds a timestamp and a random nonce, so
requests never collide and can't be replayed by re-submitting an old
filename. Every write into the spool — the agent's request, the
watcher's response, the exec log — goes through the same pattern:
write to a temp file in a scratch subdirectory _on the same filesystem_,
then `mv -f` into the destination. `rename()` is atomic and, critically,
_replaces_ a destination path rather than following it, so a symlink
planted at the destination name can't be used to write through to an
arbitrary target. The watcher goes one step further: it holds one
directory file descriptor open per spool subdirectory for the whole
drain, verifies each is a real directory rooted under the spool (not a
swapped-in symlink), and performs every open/move/prune through that
pinned descriptor (`openat` semantics) rather than by re-resolving a
path string each time — closing the window between "I checked this path"
and "I wrote to this path."

## 7. Quarantine on malformed input

If a file in `requests/` can't even be parsed as valid JSON, has a
filename that doesn't match the expected schema, or turns out not to be
a plain regular file (a symlink or FIFO planted where a request should
be, say), it is moved to `quarantine/` rather than left in place, deleted
silently, or processed. This is a poison-pill defence: leaving it in
`requests/` would keep re-triggering the `.path` unit forever (a
crash-loop), while silently deleting it would erase evidence of an
attempted attack or of a genuine bug on the writer side. Quarantine keeps
the forward-progress invariant ("every request leaves the inbox") intact
while preserving the artefact for inspection.

## 8. Audit log

Every request's outcome — accepted, denied and why, expired, succeeded,
failed with what exit code — is appended to an audit log that lives
**off** the shared mount (under the host's own state directory), so a
compromised agent container cannot tamper with or truncate its own
history. A best-effort mirror of the recent audit tail is copied onto
the mount for the agent's own diagnostics, but that copy is documented
as diagnostic-only, never the authoritative record.

## 9. `.env`-hash and git-dirty guards (TCB integrity gate)

Before running a _mutating_ verb, the watcher checks two things:

- A small set of tracked files that define what the orchestration
  actually does (the compose file, the orchestration script itself, the
  reverse-proxy config) are checked with `git status --porcelain`
  against `HEAD`. If any are locally modified, mutating verbs are
  refused until the change is committed or reverted. This closes an
  otherwise-obvious bypass: if the agent could edit the compose file and
  then trigger `rebuild`, it could get the watcher to build and run
  whatever the modified file describes.
- A SHA-256 of the untracked `.env` file is computed once at install
  time and baked into the host-only watcher copy. If `.env` changes
  afterwards, mutating verbs are refused until a human re-runs the
  installer to accept the new hash. `.env` typically isn't tracked by
  git at all, so the git-dirty check alone wouldn't catch a change to
  it — this closes that gap specifically.

Both checks are honestly scoped: they cover the files that directly
define orchestration behaviour, not every file a build might transitively
touch (a service's own Dockerfile, for instance). That's a deliberate,
documented boundary rather than an oversight — the goal is to catch the
obvious "edit the config, trigger a rebuild that does something else"
attack, not to fully sandbox arbitrary build logic.

## 10. Transient scopes so containers survive the ephemeral exec session

A `Type=oneshot` systemd service is, by definition, a process that starts,
does its work, and exits — and by default its whole cgroup is torn down
with it. But some bridged verbs (`up`, `restart`, `rebuild`, …)
deliberately leave long-running containers behind. Left naively wired
up, either the containers get killed the instant the oneshot exits, or
(depending on kill mode) they linger _inside_ the oneshot's cgroup and
the service can never fully settle back to idle — which then stops the
watcher from being re-triggered for the _next_ request. The fix is to
launch those specific verbs inside a transient systemd scope
(`systemd-run --user --scope`), which puts the spawned containers in a
sibling unit rather than as descendants of the drain's own cgroup. The
containers outlive the drain that started them; the drain's own cgroup
still empties out cleanly. The one wrinkle worth knowing: any inherited
file descriptor from the drain (a lock file descriptor, a spool
directory descriptor) will keep a scoped child process alive-for-locking
purposes even after the drain exits, so those descriptors need to be
explicitly closed in the child before the scope's real command runs.

## What the bridge deliberately CANNOT do

- **No arbitrary shell.** There is no verb, no argument, no combination
  of inputs that reaches an `eval`, a `sh -c`, or a string-built command.
  The executed surface is exactly the fixed argv table.
- **No privileged or root actions.** The watcher runs as the same
  unprivileged host user under a systemd `--user` session — not root,
  not a privileged container, no `sudo` anywhere in the pipeline.
- **No parameter that reaches a shell.** Every argument that can vary
  (a service name) is validated against a closed enumeration before use,
  and is always passed as a discrete argv element, never interpolated
  into a string a shell then parses.
- **No socket, no SSH, no open port.** The channel is a shared
  filesystem path the two sides already both have access to — nothing
  new is exposed to the network, and nothing new is exposed to the
  container engine either. See `alternatives.md` for why each of those
  more obvious designs is worse.

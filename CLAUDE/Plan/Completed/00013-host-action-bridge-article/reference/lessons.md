# Lessons — war stories, generalised

Six things that only became obvious by building this and watching it
break. Told with generic names throughout; none of these reference the
private project the pattern was drawn from.

## 1. Namespace everything, or the second project silently wins

The first version of a bridge like this tends to get built for one
project, and it's natural to give the systemd units, config directory,
and installed binary simple, global-sounding names — `demo-bridge.path`,
`~/.config/demo-bridge/policy.conf`, `~/.local/bin/demo-bridge-watcher`.
That works fine right up until a second, unrelated project on the same
machine installs its own copy of the same bridge. Its installer writes
to the same unit names, the same config path, the same binary path — and
because installers of this kind are designed to be idempotent and
self-healing (that's a feature: re-running one should repair a broken
install), the second project's install doesn't _fail_, it just silently
overwrites the first project's live bridge. Now project A's agent
container is issuing requests that get validated against project B's
service enum, or worse, executed against project B's orchestration
script. Nothing crashes; it just quietly does the wrong thing, which is
the worst kind of bug to notice.

The fix is to namespace every host-global artefact by a project slug
from day one — unit names, config directory, state directory, installed
binary name all carry the slug (`demo-bridge-demo-app.path` rather than
`demo-bridge.path`). The in-repo spool itself doesn't need namespacing,
because it already lives inside each project's own repo checkout — it's
only the things that live in shared, global host locations
(`~/.config`, `~/.local/bin`, the systemd user unit namespace) that
collide. A good installer also detects a legacy, un-namespaced install
left over from before this fix, warns loudly about exactly what it
found, and prints the precise cleanup commands — but doesn't delete
those files itself, because another project might still be depending on
the un-namespaced version.

## 2. Resolve aliased binaries at install time, not call time

A tool the operator uses every day from an interactive shell is often
not a real binary on `PATH` — it's a shell alias, or a shell function
defined in `.bashrc`/`.zshrc`. That's invisible to anything that isn't
that specific interactive shell. A systemd `--user` unit's `PATH` is
built from the unit's own environment, not from sourcing the user's
shell rc files — so a watcher script that tries to `command -v` a
tool the operator normally invokes as an alias will fail to find it,
even though typing the same name at a prompt works perfectly.

The fix is to resolve any such binary once, at install time (in a real
interactive shell, where aliases _are_ visible, or via an explicit
environment override), and bake the resolved absolute path into the
generated config — never re-resolve it at call time from inside the
systemd unit's much narrower environment. The installer should also
degrade gracefully: if it can't resolve the binary and no override was
given, disable just the verb that depends on it rather than failing the
whole install, and print exactly what the operator needs to run to fix
it (see lesson 3).

## 3. Remediation output should be copy-pasteable, with no log prefix glued on

The instinct when writing operational tooling is to make every line of
output consistent — timestamp, level, message. That's the right instinct
for a log stream and the wrong one for a remediation instruction. A
warning that reads `[install:WARN] systemctl --user disable --now demo-bridge.path` cannot be pasted directly into a terminal; the human
has to first mentally strip the prefix, which is exactly the kind of
friction that turns a five-second fix into a "I'll deal with this
later." When an installer or watcher needs to hand the operator an exact
command to run — a cleanup step, a diagnostic command, a reinstall
invocation — print that command on its own, unprefixed, ideally set off
from the surrounding log lines by blank lines, so it can be selected and
run with zero editing.

## 4. "The agent can't reach the app" is usually a networking-join problem, not a firewall problem

A very common shape of failure: the agent container can start the
application stack (via the bridge) but then can't _talk_ to it — health
checks against `host.containers.internal:<port>` time out, even though
the same address works fine from the host itself. The instinctive fix
is to open the relevant ports on the host firewall for the container
interface. That works, but it's the wrong default: it's untracked
config drift (nothing records why that port is open, and nothing closes
it again later), it exposes the service to anything else that can reach
that interface, and it still leaves the agent doing address/port-based
access instead of name-based service discovery.

The better default is to give the bridge one more verb whose entire job
is joining the agent container to the application's own container
network — the same private network the app's containers already use to
talk to each other. Once joined, the agent reaches services by
container/service name over the internal network, exactly the way the
application's own containers do, with no host port ever opened and no
firewall rule to remember to remove later. It costs one more bridged
verb; it saves an entire class of "which port did we open and why"
questions six months later.

## 5. Restrictive file permissions from one process can break a completely different process

A subtle one: a subagent or worker process operating on the shared
checkout can end up with a much more restrictive default file-creation
mode (umask) than the rest of the toolchain expects — for example
writing new files as `600`/`700` (owner-only) where the rest of the
project's files are `644`/`755`. Nothing about that looks wrong from the
writing process's own point of view; the files exist, they're readable
by the user that wrote them, tests that run as that same user pass
fine. The failure shows up somewhere completely different: an
application container running as a _different_ user or UID inside its
own namespace tries to read one of those files — a config file, a class
the framework autoloads, an asset — and gets a permission-denied that,
depending on how the failure is surfaced, can look like almost anything
except a permissions problem (a missing symbol, a constant that "isn't
defined", a 500 with no obvious cause).

The generalised lesson: whenever two different processes — especially
ones running as different users or in different container namespaces —
share a filesystem, treat unexpectedly-strict file permissions as a
standing suspect the moment something downstream can't find or read a
file that clearly exists. It's worth checking early, specifically
because the symptom it produces is so often misleading.

## 6. Rate limits biting during interactive debugging is the system working, not a bug

The first time a bridge's rate limiter actually engages mid-session — a
request comes back `denied: rate limit exceeded` in the middle of active
back-and-forth debugging — the instinct is to treat it as a nuisance to
raise or remove. Worth resisting that instinct. The limiter exists
specifically to bound how much damage a stuck loop or a misbehaving
agent can do by hammering a mutating verb; hitting it occasionally during
legitimate heavy use is exactly the cost that buys that protection, not
a sign the limit is miscalibrated. The correct response in the moment is
simply to wait out the window — the same way a human operator would
naturally pace repeated manual restarts rather than firing them as fast
as possible.

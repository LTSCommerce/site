# Alternatives considered — and why the bridge wins

Four ways to solve "agent needs to control containers it can't directly
reach", roughly in increasing order of how tempting each looks and how
bad it actually is.

## Mount the container engine's socket into the agent container

The obvious shortcut: bind-mount `/var/run/docker.sock` (or the podman
equivalent) into the agent container, install a client, done.

**What it grants an attacker who compromises the agent**: everything.
Access to a container engine socket is equivalent to root on the host —
not "root inside a container", actual root on the machine the engine
runs on. From that socket you can start a new container with the host
filesystem bind-mounted in, run as root inside it, and read or write
anything on the host. There is no meaningful sandbox left once the
socket is reachable; every other precaution taken when setting up the
agent container (no privileges, no capabilities, non-root user) is
rendered irrelevant by this one mount. This is the single worst option
on the list and also the easiest one to reach for, because it "just
works" the moment it's mounted.

## SSH back to the host

Give the agent container an SSH key and let it `ssh dev@host` to run
orchestration commands directly.

**What it grants**: host credentials living inside the sandbox. The
entire point of running the agent in a disposable, restricted container
is that compromising it should cost an attacker as little as possible.
An SSH private key that authenticates as a real host user undoes that in
one step — now compromising the container means compromising a
credential that works everywhere that key is trusted, not just inside
the container's own blast radius. It also reintroduces a full shell on
the other end: SSH doesn't naturally constrain _which_ commands can run
unless a great deal of additional plumbing (forced commands, restricted
shells) is bolted on afterwards — and that plumbing is, in effect, a
worse-designed version of the bridge itself.

## Run the agent privileged

Skip the sandbox model, run the agent container with elevated
capabilities or as root, let it talk to the engine directly because
nothing is stopping it.

**What it grants**: this isn't even really an alternative — it's giving
up on the premise. A privileged container can escape to the host through
any of several well-known techniques. If the agent container is
privileged, "can it damage the host" stops being a bridge design
question and starts being a "how much do we trust every dependency the
agent might pull in during a session" question, which for an
autonomously-acting coding agent is not a comfortable place to be.

## Open host firewall ports for a control API

Stand up a small HTTP service on the host, listen on a port the agent
container can reach, and let the agent hit REST endpoints for
`restart`/`rebuild`/etc.

**What it grants**: a smaller, but still real, expansion of the attack
surface, plus operational drift that nothing tracks. Every port opened
this way is a port that has to be remembered, is easy to forget once the
immediate need passes, and — because it's reachable over the network
rather than gated by filesystem placement — needs its own
authentication, TLS, and audit story built from scratch. None of that
comes for free the way file permissions and directory placement do.
It's also _architecturally_ the same idea as the bridge (closed set of
actions, validated input) but reimplemented on a strictly worse
foundation: a listening network service has to defend against being
reached by more than just the one agent container, while a spool inside
a bind mount that only one container has access to is authenticated by
its placement alone.

## Why the bridge is the better trade

The bridge's request/response channel rides a bind mount that already
exists — no new port, no new credential, no new standing service beyond
a `.path`-triggered oneshot that's idle almost all the time. The
executable surface is closed at the code level (a `case` statement, not
a config file, not a runtime-interpreted rule set), so "what can this
channel actually do" is answerable by reading one function rather than
auditing a whole API surface or a socket's full capability. And because
validation, policy, rate limiting, and the audit trail all live on the
host side in a copy the agent container cannot edit, none of those
protections can be argued away by anything that happens inside the
sandboxed container — including a fully compromised one.

The cost is real but bounded: multi-second latency instead of an
instant RPC, and a fixed, deliberately small set of things the agent can
ask for. For orchestration verbs — start, stop, restart, rebuild, check
status — that trade is a clear win.

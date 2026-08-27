# Article angles

Five candidate framings. Pick one as the primary spine; the others can
survive as a paragraph or a section within whichever is chosen, but
trying to be all five at once will produce a shapeless piece.

## 1. "The Sandbox That Still Needs to Turn Things On" (recommended)

**Pitch**: Start from the concrete tension — an AI coding agent running
in a deliberately runtime-less container is a genuinely good security
default, but it immediately collides with the reality of agentic
development against a real multi-container app, which needs someone to
start, stop, and rebuild the stack. Walk through the bridge as the
resolution: a closed, file-based, fixed-argv channel that lets the agent
ask for a small set of privileged actions without ever gaining the
ability to run one. Spend the back half on the trust model in depth
(allowlist, fixed argv, policy, rate limiting, audit) since that's the
part with real transferable value, then close on the general principle
that applies well beyond this one setup.

**Length**: 2200–2800 words. **Key takeaway**: when a sandboxed
component legitimately needs to do something privileged, the answer is
a narrow, closed, auditable channel purpose-built for that one need —
not loosening the sandbox.

## 2. "Least Privilege for AI Agents: A Worked Example"

**Pitch**: Frame it explicitly as a case study in applying
least-privilege thinking to autonomous coding agents specifically —
a newer problem than classical sandboxing, since the "user" issuing
commands is now software that can act continuously and unattended. Use
the bridge as the worked example of what least-privilege looks like in
practice for this class of system: closed verb set, per-verb
auto/deny policy, rate limiting tuned for a loop that might misbehave
rather than a human who paces themselves naturally. Good angle for a
security-focused readership; weaker if the audience is more general
infra/DevOps.

**Length**: 1800–2400 words. **Key takeaway**: autonomous agents need
their own least-privilege model — the same principle as classical
sandboxing, but the threat model (a tireless, sometimes-buggy caller
rather than an occasional human mistake) changes what "enough
protection" looks like.

## 3. "Four Ways to Let a Container Talk to Its Host (and Why Three Are Wrong)"

**Pitch**: Structure the whole piece around the alternatives comparison
— open with "you need a sandboxed thing to trigger a privileged host
action, here are the four ways people reach for, and what each one
actually costs" and use the bridge as the fifth, correct answer,
introduced only after the reader has felt why socket-mounting,
SSH-back, running privileged, and firewall holes are each worse. This
is the most "listicle-shaped" framing and reads faster, at the cost of
spending less depth on the trust-model internals.

**Length**: 1600–2200 words. **Key takeaway**: the security cost of each
tempting shortcut is concrete and specific, not vague — and a
purpose-built closed channel beats all four on every axis that matters.

## 4. "Building a Crash-Proof, Symlink-Safe File Queue on Purpose"

**Pitch**: A lower-level, more implementation-focused piece aimed at
readers who build file-based IPC or job-queue systems generally,
independent of the AI-agent framing. Cover the specific hardening
techniques — atomic publish via same-filesystem temp + rename, pinned
directory file descriptors and openat semantics against symlink
write-through, the poison-pill quarantine invariant, the single-flight
lock with a "loser still acks" design to avoid a false timeout. The
agent-sandbox motivation becomes the opening hook rather than the main
subject; the meat is systems-programming technique that outlives this
one use case.

**Length**: 1800–2400 words. **Key takeaway**: a handful of well-known
but easy-to-skip techniques (atomic rename, held dirfds, poison-pill
quarantine) turn a simple file-drop queue into one that's genuinely safe
against a hostile or malformed writer.

## 5. "What We Got Wrong Building an Agent-to-Host Bridge"

**Pitch**: A lessons-first, narrative-driven piece — lead with the war
stories (namespace collisions, PATH-vs-alias resolution, the
networking-join fix, the file-permission mismatch across container
users) as the spine, using each one as the entry point into the piece
of the design that fixes it. More personal and battle-tested in tone
than the others; risks feeling like a grab-bag if the throughline back
to "here's the general architecture" isn't kept explicit throughout.

**Length**: 1600–2000 words. **Key takeaway**: most of what makes a
system like this trustworthy in practice was learned by watching it
fail in small, specific, very fixable ways — the lessons are as much the
content as the design itself.

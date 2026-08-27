# Plan 00013: Host-Action Bridge Article

**Status**: In Progress
**Created**: 2026-08-27
**Owner**: Claude
**Priority**: Medium

## Overview

Write an article explaining the **Host-Action Bridge** pattern: a technique
for letting a sandboxed, runtime-less AI coding agent container safely
orchestrate containers on its host, without handing the agent a container
runtime, a socket, or SSH access back to the host.

This grew out of real work on an agentic coding setup where the agent
container deliberately ships with no `docker`/`podman` binary and no way to
talk to the container engine — a defensible security boundary — but the
agent still needs to start, stop, restart, and rebuild the application
stack it's working on. The article generalises the solution into a
reusable pattern.

## Goals

- Explain the problem clearly: why agent containers should have no runtime,
  and why that creates a real friction point for anyone doing agentic
  development against a multi-container app.
- Document the trust model of the bridge in enough technical depth that a
  reader could implement their own: a file-based request spool, a host-side
  watcher process, a closed verb allowlist mapping to fixed argv, per-verb
  policy, rate limiting, an audit log, and the read-only/mutating verb split.
- Contrast the approach with the obvious-but-wrong alternatives (socket
  passthrough, SSH, ad-hoc firewall holes) and explain concretely why each
  one is worse.
- Share the non-obvious lessons learned building this, as general
  principles — not project specifics.
- Land the general claim: this pattern applies to any situation where a
  sandboxed agent needs to trigger privileged actions on a host it cannot
  otherwise reach.

## Non-Goals

- Not a step-by-step "copy this config" tutorial — it is a concepts and
  reasoning piece, illustrated with pseudo-config, not a real deployment
  manifest.
- Not a product pitch. No real hostnames, ports, container names, file
  paths, usernames, or client/project identifiers appear anywhere in the
  piece.
- Does not cover unrelated sandboxing techniques (VMs, gVisor, seccomp
  profiles) except where a one-line contrast is useful.

## Context & Background

The surrounding tooling ecosystem worth mentioning for context (both public,
both fair to name):

- **ccy / claude-yolo** — the wrapper that launches Claude Code inside a
  disposable, permission-relaxed container ("yolo mode") for agentic coding
  sessions.
- **LongTermSupport/fedora-desktop** on GitHub — the Ansible-provisioned
  desktop environment that hosts these containers.

Both are referenced only as "the surrounding tooling that motivated this",
not as a deep-dive subject of the article.

## Reference Pack

A self-contained `reference/` folder now sits alongside this PLAN.md,
built specifically so the writer of Task 2.1 (who works only in this
public repo, with no access to the private source project) has
everything needed without cross-repo access:

- [`reference/architecture.md`](./reference/architecture.md) — components
  and responsibilities (spool, request writer, `.path`/`.service` units,
  watcher, response files, diagnostics), a mermaid component diagram, a
  mermaid sequence diagram of the full request lifecycle, and a mermaid
  state-machine diagram (`queued -> running -> done/failed/denied/expired -> archive/quarantine`).
- [`reference/security-model.md`](./reference/security-model.md) — the
  reasoning behind every design choice: closed verb allowlist + fixed
  argv (the single most important property), enumerated arg validation,
  read-only/mutating split, per-verb auto/deny policy, rate limiting,
  atomic publish + symlink-safe moves, quarantine, audit log, the
  `.env`-hash + git-dirty integrity gate, transient systemd scopes, and
  an explicit list of what the bridge deliberately cannot do.
- [`reference/snippets.md`](./reference/snippets.md) — sanitised,
  illustrative code excerpts the writer can embed directly: the
  allowlist/fixed-argv case table, the request writer, the watcher's
  validate step, the systemd unit files, a `policy.conf` sample, the
  atomic-publish helper, and the per-project namespacing pattern.
- [`reference/alternatives.md`](./reference/alternatives.md) — socket
  passthrough, SSH back to the host, running privileged, and ad hoc
  firewall holes: what each grants an attacker who compromises the
  agent, and why the bridge is the better trade.
- [`reference/lessons.md`](./reference/lessons.md) — six hard-won
  lessons as narrative war stories with generic illustration: per-project
  namespacing, resolving aliased binaries at install time, unprefixed
  copy-pasteable remediation output, network-join over firewall holes,
  cross-container file-permission mismatches, and rate limits during
  interactive debugging being correct behaviour, not a bug.
- [`reference/article-angles.md`](./reference/article-angles.md) — five
  candidate framings/titles, each with a one-paragraph pitch, a suggested
  length, and the key takeaway to land.

All code in `reference/snippets.md` (and inline in the other reference
files) is **already sanitised** to the placeholder convention below —
generic project slug, container names, host user, paths, ports, and
network name, with no reference to the private source project or its
business vertical. The writer should draw directly from this pack and
must keep any further examples they add to the same convention.

## Article Outline

1. **The problem** — agentic coding containers deliberately ship with no
   container runtime (via ccy / claude-yolo, provisioned on something like
   LongTermSupport/fedora-desktop). That's a good security default. But real
   work on a multi-container app means the agent legitimately needs to
   start/stop/restart/rebuild the stack it's editing. Something has to
   bridge that gap without punching a hole in the sandbox.

2. **The trust model** — the actual bridge design:

   - A file-based request spool living inside the repo bind mount, so both
     sides can see it without a network hop.
   - A host-side watcher — a systemd `--user` path unit reacting to new
     request files — picks up requests and acts on them.
   - A **closed allowlist** of verbs, each mapping to a fixed, hardcoded
     argv. No parameter injection: the agent can select a verb, never
     compose a command line.
   - Per-verb auto-approve vs. deny policy, so low-risk verbs run
     unattended and higher-risk ones require a human in the loop.
   - Rate limiting, so a runaway agent loop can't hammer the host.
   - An audit log of every request and its outcome.
   - A read-only vs. mutating verb split, since read-only actions
     (status/health checks) are categorically safer than mutating ones
     (restart/rebuild).
   - Transient systemd scopes for verbs that leave long-running containers
     behind, so the host can track and reap what it started on the agent's
     behalf.

3. **Why not the obvious alternatives**:

   - Handing the agent the container engine's socket — equivalent to full
     root on the host; defeats the point of sandboxing.
   - SSH back to the host — puts host credentials inside the sandbox, which
     is exactly the blast-radius the sandbox exists to contain.
   - Opening firewall ports ad hoc for a control API — untracked drift; no
     audit trail, no allowlist, nothing durable.

4. **Hard-won lessons** (stated as general principles, not project
   specifics):

   - Namespace everything per project. Two unrelated projects using
     unnamespaced global systemd unit or config names will silently clash.
   - Resolve any user-aliased binaries at install time, not at call time —
     a systemd `--user` unit's `PATH` is not the same as an interactive
     shell's, so aliases and shell functions the agent expects to exist
     often don't.
   - Error and remediation messages should be copy-pasteable as-is — no log
     timestamp/level prefixes glued onto the command the human needs to run.
   - Joining the agent container to the application's container network is
     a better default than opening host ports — it keeps traffic off the
     host network entirely.
   - Files written by a subagent can inherit a restrictive umask that the
     application containers (running as a different user/context) can't
     read — worth calling out as a class of bug, not a one-off.

5. **Closing** — generalise: any time a sandboxed agent needs to reach
   outside its own boundary to perform a privileged action, the same shape
   applies — narrow, closed, auditable, human-tunable, rather than broad
   and implicit.

## Tone Notes

- Practical and first-person — "we hit this, here's what we did and why",
  not an abstract whitepaper.
- Battle-tested, not theoretical — every claim should trace back to a real
  problem this solved, described generically.
- Assume a technically strong reader (they know containers, systemd, and
  sandboxing already) — don't over-explain the basics, spend the words on
  the trust-model reasoning and the lessons.

## Public-Repo Hygiene Checklist (for the eventual writer)

This repo is public. Before publishing, verify the article:

- [ ] Contains **no** real hostnames, IP addresses, or port numbers from any
  private project.
- [ ] Contains **no** real file paths, directory layouts, or repo names
  from any private project.
- [ ] Contains **no** container/service names, user names, or project
  names beyond the two explicitly public tools named in this plan
  (ccy / claude-yolo, LongTermSupport/fedora-desktop).
- [ ] Contains **no** copy-pasted code, config, or shell snippets lifted
  directly from a private project — all examples are written fresh as
  illustrative pseudo-config (e.g. `verb-name -> /usr/bin/example-tool arg1 arg2`
  style, not real unit files or real request-spool contents).
- [ ] Contains **no** client, customer, or employer names.
- [ ] Any systemd unit, allowlist, or spool example is clearly illustrative
  — generic placeholder names throughout (e.g. `myapp`, `example-verb`),
  never anything traceable to a real deployment.
- [ ] A final read-through by a second pass (or the writer re-reading cold)
  confirms nothing in the piece could identify the private project it
  was drawn from.
- [ ] Every code excerpt in the article traces back to
  `reference/snippets.md` (or is newly written to the same placeholder
  convention) — the reference pack's snippets are already sanitised and
  MUST stay that way: do not "restore" real names, paths, or ports when
  adapting them into `code-snippets/host-action-bridge/`.
- [ ] Any new example the writer adds beyond the reference pack follows
  the same placeholder set already established there (`demo-app` /
  `demoapp_web` / `demoapp_db` / user `dev` / `~/Projects/demo-app` /
  ports `9100`/`9101` / network `demo-app-network` / `./stack.bash`) —
  do not introduce a second, inconsistent set of placeholders.

## Tasks

### Phase 1: Scoping (this plan)

- [x] ✅ **Task 1.1**: Explore repo conventions (plan workflow, article/snippet
  system, existing CLAUDE.md guidance) and follow them.
- [x] ✅ **Task 1.2**: Scope the article outline, tone, and public-repo
  hygiene checklist in this PLAN.md.
- [x] ✅ **Task 1.3**: Build the self-contained `reference/` pack
  (architecture, security model, snippets, alternatives, lessons,
  article-angles) so a writer with no access to the private source repo
  has everything needed to draft a detailed 2000+ word article.

### Phase 2: Writing v1 (superseded — see Phase 3)

- [x] ✅ **Task 2.1**: Draft the article content following the outline above.
- [x] ✅ **Task 2.2**: Create `code-snippets/host-action-bridge/` with
  illustrative pseudo-config examples.
- [x] ✅ **Task 2.3**: Add the article object to `src/data/articles.ts`
  following the existing article authoring convention.
- [x] ✅ **Task 2.4**: Run the `article-reviewer` agent per
  `CLAUDE.md` Step 3b and resolve all CRITICAL findings.
- [x] ✅ **Task 2.5**: Run through the public-repo hygiene checklist above as
  a final pass before commit.

Phase 2 shipped a working but thin v1, written before the `reference/`
pack (Task 1.3) existed — it invented its own placeholder set instead of
using the pack's, and covered only the outline's five bullets rather
than the pack's full depth (quarantine, atomic publish/symlink safety,
the TCB integrity gate, transient-scope fd wrinkle, per-arg enum
validation, hardcoded-deny-before-allowlist, "no confirm mode" policy
reasoning, rate-limit-as-a-feature). Phase 3 supersedes it with a
full-depth rewrite drawing on the pack.

### Phase 3: Rewrite to full depth using the reference pack

- [ ] ⬜ **Task 3.1**: Pick the article angle from `reference/article-angles.md`
  (Angle 1, "The Sandbox That Still Needs to Turn Things On", is the
  recommended spine — 2200-2800 words) and re-draft via the
  `technical-article-writer` agent, briefed on the full `reference/` pack
  rather than the thin Phase 1 outline. Keep the `host-action-bridge` id
  and URL slug; replace the `content` field in place.
  Note: this site's article renderer has no mermaid support (checked
  `src/` and `package.json` — no mermaid dependency), so the pack's three
  mermaid diagrams (component, sequence, state machine) must be
  translated into prose/numbered-step narrative, not embedded as mermaid
  fences.
- [ ] ⬜ **Task 3.2**: Rebuild `code-snippets/host-action-bridge/` from
  `reference/snippets.md`'s seven excerpts (adapt formatting/length for
  the article; keep the pack's placeholder set exactly:
  `demo-app` / `demoapp_web`/`demoapp_api`/`demoapp_db` / user `dev` /
  `~/Projects/demo-app` / `./stack.bash` / `demo-app-network`).
- [ ] ⬜ **Task 3.3**: Run a voice/quality pass (`voice-check` skill and/or
  `content-editor` agent) for formal-register compliance and to remove
  any AI-writing tells before the structural review.
- [ ] ⬜ **Task 3.4**: Run the `article-reviewer` agent and resolve all
  CRITICAL and MODERATE findings.
- [ ] ⬜ **Task 3.5**: Rebuild (`npm run build`), verify
  `dist/articles/host-action-bridge/index.html` renders with no leftover
  `{{SNIPPET:...}}` placeholders, and re-run the public-repo hygiene
  checklist below in full.
- [ ] ⬜ **Task 3.6**: Commit the rewrite.

## Success Criteria

- PLAN.md exists with a clear outline, tone notes, and a hygiene checklist
  a future writer (human or agent) can execute against directly.
- The eventual article, once written, passes the hygiene checklist with no
  private-project details present.
- The eventual article, once written, passes `article-reviewer` with
  `READY TO PUBLISH`.

## Dependencies

- None.

## Notes & Updates

- 2026-08-27: Plan created, scoping the article; writing itself is a
  follow-up task, not part of this plan.
- 2026-08-27: Phase 2 completed in the same session. Article written and
  added to `src/data/articles.ts` (id `host-action-bridge`, category
  infrastructure, register formal). Snippets created under
  `code-snippets/host-action-bridge/`. Build verified (69/69 routes,
  `dist/articles/host-action-bridge/index.html` renders with no leftover
  `{{SNIPPET:...}}` placeholders). `article-reviewer` returned NEEDS FIXES
  on the first pass (one formal-register first-person leak, two em dashes
  in code comments) — all three fixed, then re-verified with a clean
  rebuild. Public-repo hygiene checklist passed: no real hostnames, paths,
  container/project names, or client identifiers; ccy/claude-yolo and
  LongTermSupport/fedora-desktop were not named in the final text.
- 2026-08-27: A parallel session (merged via `git pull`, commit
  `bcd986a`) landed a much deeper self-contained `reference/` pack
  (architecture, security-model, snippets, alternatives, lessons,
  article-angles) built while unaware the v1 article had already
  shipped. Reopening the plan (status back to In Progress, folder moved
  back out of `Completed/`) to do a full-depth Phase 3 rewrite against
  the pack rather than leave the thinner v1 as the published article.

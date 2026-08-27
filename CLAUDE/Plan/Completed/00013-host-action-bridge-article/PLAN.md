# Plan 00013: Host-Action Bridge Article

**Status**: Complete
**Created**: 2026-08-27
**Owner**: Claude
**Priority**: Medium

## Overview

Write an article explaining the **Host-Action Bridge** pattern: a technique
for letting a sandboxed, runtime-less AI coding agent container safely
orchestrate containers on its host, without handing the agent a container
runtime, a socket, or SSH access back to the host.

This grew out of real work on an agentic coding setup where the agent
container deliberately ships with no container-engine binary and no way to
talk to the engine — a defensible security boundary — but the agent still
needs to start, stop, restart, and rebuild the application stack it is
working on. The article generalises the solution into a reusable pattern.

This plan is a **donated hand-off** in the sense of
[`CONTRIBUTING-PROJECTS.md`](../../../CONTRIBUTING-PROJECTS.md): the source
material came from a private project, was sanitised at source, and is written
up here by a writer who has no access to that project. That document is the
worked-example reference for this folder, so this folder has to stay worthy
of the citation.

## Brief for the writer: read these, in this order

A writing agent with **only this folder** should be able to produce a
publish-ready article. Nothing else needs to be opened.

1. [`reference/publishing-conventions.md`](./reference/publishing-conventions.md)
   — **read this first.** Output paths, the article object schema (the site's
   equivalent of front matter) with the exact values to use, HTML structure
   rules, the mandatory snippet system, the diagram rule, the voice and
   register contract, content policy, the placeholder set, and the ordered
   QA gates.
2. [`reference/article-angles.md`](./reference/article-angles.md) — five
   candidate framings. **Angle 1, "The Sandbox That Still Needs to Turn
   Things On", is the chosen spine** at 2,200–2,800 words.
3. [`reference/architecture.md`](./reference/architecture.md) — the mechanism
   in reimplementable detail: components and responsibilities (spool, request
   writer, `.path`/`.service` units, watcher, response files, diagnostics), a
   component diagram, a full request-lifecycle sequence, and the state
   machine (`queued -> running -> done/failed/denied/expired -> archive/quarantine`).
4. [`reference/security-model.md`](./reference/security-model.md) — the
   reasoning behind every design choice, and the highest-value file in the
   pack: closed verb allowlist plus fixed argv (the single most important
   property), enumerated arg validation, the read-only/mutating split,
   per-verb auto/deny policy, rate limiting, nonces and atomic publish,
   symlink-safe moves, quarantine, the audit log, the config-hash and
   git-dirty integrity gate, transient scopes, and an explicit list of what
   the bridge deliberately cannot do.
5. [`reference/alternatives.md`](./reference/alternatives.md) — socket
   passthrough, SSH back to the host, running privileged, and ad hoc firewall
   holes: what each one grants an attacker who compromises the agent, and why
   the bridge is the better trade.
6. [`reference/lessons.md`](./reference/lessons.md) — six hard-won lessons as
   generalised war stories: per-project namespacing, resolving aliased
   binaries at install time, unprefixed copy-pasteable remediation output,
   network-join over firewall holes, cross-container file-permission
   mismatches, and rate limits biting during interactive debugging being
   correct behaviour rather than a bug.
7. [`reference/snippets.md`](./reference/snippets.md) — seven sanitised code
   excerpts to embed close to verbatim, and the authoritative statement of
   the placeholder set.
8. [`reference/diagrams/`](./reference/diagrams/) — the Mermaid source for
   the one diagram that reaches the published article, plus the render recipe
   for producing the committed SVG.

## Goals

- Explain the problem clearly: why agent containers should have no runtime,
  and why that creates a real friction point for anyone doing agentic
  development against a multi-container application.
- Document the trust model in enough technical depth that a reader could
  implement their own: a file-based request spool, a host-side watcher, a
  closed verb allowlist mapping to fixed argv, per-verb policy, rate
  limiting, an audit log, and the read-only/mutating verb split.
- Contrast the approach with the obvious-but-wrong alternatives and explain
  concretely why each one is worse.
- Share the non-obvious lessons as general principles, not project
  specifics.
- Land the general claim: this pattern applies wherever a sandboxed agent
  needs to trigger privileged actions on a host it cannot otherwise reach.

## Non-Goals

- Not a step-by-step "copy this config" tutorial. It is a concepts and
  reasoning piece, illustrated with sanitised, illustrative code.
- Not a product pitch, and not a claim about Joseph, his clients, or his
  availability (see the SITE-TRUTH constraint in the conventions file).
- Does not cover unrelated sandboxing techniques (VMs, gVisor, seccomp
  profiles) beyond a one-line contrast where it is useful.

## Context worth naming

Two public projects are explicitly fair to name, and nothing else is:

- **ccy / claude-yolo** — the wrapper that launches Claude Code inside a
  disposable, permission-relaxed container for agentic coding sessions.
- **LongTermSupport/fedora-desktop** on GitHub — the Ansible-provisioned
  desktop environment that hosts these containers.

Both are referenced only as the surrounding tooling that motivated the work,
never as a deep-dive subject.

## Article Outline

1. **The problem** — agentic coding containers deliberately ship with no
   container runtime. That is a good security default. Real work on a
   multi-container application means the agent legitimately needs to
   start, stop, restart, and rebuild the stack it is editing, and something
   has to bridge that gap without punching a hole in the sandbox.

2. **The trust model** — the bridge design itself, carried by the committed
   architecture diagram and then unpacked: the file-based request spool
   inside the existing bind mount, the host-side `systemd --user` path unit
   and oneshot watcher, the closed allowlist of verbs each mapping to fixed
   hardcoded argv, per-verb auto-approve versus deny policy, rate limiting,
   the audit log, the read-only versus mutating split, and transient scopes
   for verbs that leave long-running containers behind.

3. **The hardening that is easy to skip** — drawn from
   `security-model.md`, and the depth the thin first version lacked: atomic
   publish and symlink-safe moves, the quarantine invariant that guarantees
   forward progress, enumerated per-arg validation, hardcoded denies
   evaluated before the allowlist, the integrity gate, and the deliberate
   absence of a confirm mode.

4. **Why not the obvious alternatives** — engine socket passthrough (root on
   the host in a thin disguise), SSH back to the host (host credentials
   inside the blast radius the sandbox exists to contain), running
   privileged, and ad hoc firewall holes (untracked drift, no allowlist, no
   audit trail).

5. **Hard-won lessons**, stated as transferable principles — namespace
   everything per project; resolve aliased binaries at install time because a
   systemd user unit's `PATH` is not an interactive shell's; keep remediation
   output copy-pasteable with no log prefix glued on; join the agent
   container to the application network rather than opening host ports; watch
   for restrictive umasks from one process breaking a different one; treat a
   rate limit biting during debugging as the system working.

6. **Closing** — generalise: whenever a sandboxed component legitimately
   needs to reach outside its boundary to perform a privileged action, the
   answer is a narrow, closed, auditable, human-tunable channel built for
   that one need, rather than a looser sandbox.

## Public-Repo Hygiene Checklist

The full rule set, including the placeholder table, is
[`reference/publishing-conventions.md`](./reference/publishing-conventions.md)
section 8. Before publishing, confirm the article, every snippet file, and
every diagram asset:

- [ ] Contain no real hostnames, IP addresses, or port numbers.
- [ ] Contain no real file paths, directory layouts, or repository names.
- [ ] Contain no container, service, user, or project names beyond the two
  public tools named above.
- [ ] Contain no client, customer, or employer names.
- [ ] Contain no code, config, or shell text lifted from a private project.
  Every excerpt is a fresh, sanitised rewrite, and the ones in
  `reference/snippets.md` already are — do not "restore" real names, paths,
  or ports when adapting them into `code-snippets/host-action-bridge/`.
- [ ] Use the pack's single placeholder set throughout, with no second set
  introduced: `demo-app` / `demoapp_web` / `demoapp_api` / `demoapp_db` /
  user `dev` / `~/Projects/demo-app` / ports `9100`, `9101` / network
  `demo-app-network` / `./stack.bash`.
- [ ] Survive a cold re-read confirming nothing in the piece could identify
  the private project it was drawn from.

## Tasks

### Phase 1: Scoping and reference pack

- [x] ✅ **Task 1.1**: Explore repo conventions (plan workflow, article and
  snippet systems, CLAUDE.md guidance) and follow them.
- [x] ✅ **Task 1.2**: Scope the article outline, tone, and hygiene checklist.
- [x] ✅ **Task 1.3**: Build the self-contained `reference/` pack
  (architecture, security model, snippets, alternatives, lessons, article
  angles).
- [x] ✅ **Task 1.4**: Bring the folder into line with
  `CONTRIBUTING-PROJECTS.md`: add
  `reference/publishing-conventions.md` (output paths, article object schema
  with real values, HTML structure, snippet system, diagram rule, voice and
  register contract, content policy, placeholder set, ordered QA gates) and
  `reference/diagrams/` (Mermaid source plus render recipe for the committed
  SVG), so the folder alone is a sufficient brief.

### Phase 2: Writing v1 (superseded — see Phase 3)

- [x] ✅ **Task 2.1**: Draft the article content.
- [x] ✅ **Task 2.2**: Create `code-snippets/host-action-bridge/`.
- [x] ✅ **Task 2.3**: Add the article object to `src/data/articles.ts`.
- [x] ✅ **Task 2.4**: Run `article-reviewer` and resolve CRITICAL findings.
- [x] ✅ **Task 2.5**: Run the hygiene checklist as a final pass.

Phase 2 shipped a working but thin v1, written before the `reference/` pack
existed. It invented its own placeholder set instead of using the pack's and
covered only the outline's five bullets rather than the pack's full depth
(quarantine, atomic publish and symlink safety, the integrity gate, the
transient-scope wrinkle, per-arg enum validation, hardcoded-deny-before-
allowlist, the "no confirm mode" reasoning, rate-limit-as-a-feature). Phase 3
supersedes it with a full-depth rewrite drawing on the pack.

### Phase 3: Rewrite to full depth using the reference pack

- [x] ✅ **Task 3.1**: Re-drafted via the `technical-article-writer` agent on
  Angle 1, briefed on the whole `reference/` pack. Final length 2,829 words
  of prose; `readingTime` updated to 14.
- [x] ✅ **Task 3.2**: Rebuilt `code-snippets/host-action-bridge/` from
  `reference/snippets.md`'s excerpts (8 files: `verb-allowlist.bash`,
  `request-writer.bash`, `validate-request.bash`,
  `demo-bridge-path-unit.bash`, `demo-bridge-service-unit.bash`,
  `policy-conf.bash`, `atomic-publish.bash`, `project-namespacing.bash`).
  Old thin-v1 snippet files deleted.
- [x] ✅ **Task 3.3**: Architecture diagram placed as a `<figure><img src="/images/host-action-bridge/architecture.svg">` with descriptive alt
  text and a caption. Sequence and state machine stayed as prose, per the
  "earns its place" bar.
- [x] ✅ **Task 3.4**: Ran the `voice-check` skill against this slug.
  Mechanical scan clean (zero corporate buzzwords, zero American
  spellings); the eight "X, not Y" contrastive clauses were checked
  individually and each one corrects a real misconception rather than
  being decorative. Noted (not fixed): the skill's "sound like Joseph's
  book voice" calibration is deliberately the opposite of this article's
  mandatory `register: 'formal'` (no first person, no hedging) — a
  pre-existing, intentional site policy for articles, not a defect here.
- [x] ✅ **Task 3.5**: Ran `article-reviewer` twice — once inline by the
  writer (fixed em dashes and two contractions from the first pass), and
  once as an independent adversarial second opinion by a fresh agent.
  Second pass returned NEEDS FIXES with one MODERATE (a stray second-person
  "tells you" in the closing sentence, the only register slip in ~2,900
  words) and two MINOR heading-style inconsistencies. All three fixed;
  re-verified clean.
- [x] ✅ **Task 3.6**: `npm run build` passed (69/69 routes). Confirmed
  `dist/articles/host-action-bridge/index.html` has zero leftover
  `{{SNIPPET:` placeholders and the diagram image resolves. Also ran
  `npm run type-check` (clean), `npm run lint` (12 pre-existing errors, all
  in unrelated files — `Typewriter.tsx`, `tsQaConfig/*.ts` — none touched by
  this work), and `npm run test:run` (12/12 passing). Skipped `npm run format`: `CLAUDE.md` states formatting is CI-only and local formatting
  commands should not be run.
- [x] ✅ **Task 3.7**: Hygiene checklist re-run in full: zero real
  hostnames/IPs/ports/paths/repo names, only the declared placeholder set
  across article prose, all 8 snippets, and the diagram SVG. Also found and
  fixed a latent inconsistency in the reference pack itself (not in the
  published output): `architecture.md` and `diagrams/architecture.mmd` both
  said `untracked/host-bridge/` where every other file said `demo-bridge`
  — corrected both for a clean template.

## Success Criteria

- The plan folder alone is a sufficient brief: a writer with no other context
  can produce a publish-ready article from it, including correct output
  paths, metadata, structure, voice, and QA steps.
- The published article covers the pack's full depth at 2,200–2,800 words,
  not the thin v1's coverage.
- The article passes `article-reviewer` with READY TO PUBLISH.
- The hygiene checklist passes with no private-project details present
  anywhere in the article, the snippets, or the diagram assets.

## Dependencies

- None.

## Notes & Updates

- 2026-08-27: Plan created and scoped; reference pack built.
- 2026-08-27: Phase 2 shipped v1 — article added to `src/data/articles.ts`
  (id `host-action-bridge`, category infrastructure, register formal),
  snippets created, build verified, `article-reviewer` findings fixed.
- 2026-08-27: A parallel session landed the much deeper `reference/` pack
  while unaware v1 had already shipped. Plan reopened for a full-depth
  Phase 3 rewrite against the pack rather than leaving v1 published.
- 2026-08-27: Folder brought into line with `CONTRIBUTING-PROJECTS.md`
  (Task 1.4). The site's publishing contract now lives in
  `reference/publishing-conventions.md` instead of being assumed knowledge,
  and the architecture diagram's Mermaid source is committed alongside the
  rendered SVG so it can be regenerated. Phase 3 gained an explicit diagram
  task and a full QA-gate task; the previous note that the pack's Mermaid had
  to become prose is superseded by the render-once-to-SVG rule.
- 2026-08-27: Phase 3 complete. Article rewritten to 2,829 words covering
  the pack's full depth, snippets rebuilt to match, architecture diagram
  wired in as a static SVG `<figure>`, `voice-check` and two independent
  `article-reviewer` passes run with all findings resolved, and the full
  QA gate list passed (build, type-check, lint, tests; format skipped per
  `CLAUDE.md`'s CI-only formatting rule). Fixed a latent `host-bridge` vs
  `demo-bridge` placeholder inconsistency in the reference pack itself
  (never reached the published output). Plan marked Complete and archived.

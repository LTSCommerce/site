# Plan 011: ts-qa-ci — TypeScript QA/CI Harness Package

**Status**: Not Started
**Created**: 2026-07-10
**Owner**: Claude Code
**Priority**: High
**Type**: New Package / Tooling
**Related**: Plan 008 (ESLint Custom Rules Adoption — precursor/superseded-by this plan's CDD rule tier)

## Overview

`lts/php-qa-ci` (github.com/LongTermSupport/php-qa-ci) is a mature, single-devDependency QA/CI harness for PHP projects: it pulls in every quality tool transitively, encapsulates delivery (PHARs via PHIVE, an isolated Rector sub-project, replace-section tricks) so it never pollutes a consumer's own dependency graph, ships opinionated-but-overridable default configs via a cascade (defaults → platform → project), runs everything through one orchestrator binary (`vendor/bin/qa`) in a fail-fast phased pipeline, and includes first-class Claude Code integration (`deploy-skills.bash` pushes hooks/skills/agents into the consumer project).

This plan creates `ts-qa-ci`, the equivalent harness for TypeScript/React projects, published as `@longtermsupport/ts-qa-ci` from a new GitHub repo `LongTermSupport/ts-qa-ci`. It is developed by first cloning `php-qa-ci` for reference (`./untracked/repos/php-qa-ci`, done) and scaffolding the new package in `./untracked/repos/ts-qa-ci` (gitignored working copy) before it is pushed to its own GitHub repo. Once the package exists, **this repo (lts-commerce-site) is the first and mandatory dogfooding consumer** — every rough edge is found and fixed here, and the pipeline is wired into this repo's GitHub Actions CI, before ts-qa-ci is considered ready to roll out to any other project.

A first-class deliverable of this plan is a **Component-Driven Development (CDD) ESLint rule tier**: a set of custom rules that ban ad hoc raw HTML outside designated component files and ban ad hoc/arbitrary CSS class strings, forcing all styling through component variant props that internally resolve to a constrained, reviewable set of classes.

This repo is explicitly **not** assumed to be a paragon of best practice going in — dogfooding is expected to surface real violations in the existing codebase, and fixing them is part of the plan, not a sign the plan is broken.

## Goals

1. **Extract transferable concepts from php-qa-ci** via structured research (phased fail-fast pipeline, hybrid tool-delivery encapsulation, config cascade, platform detection, per-tool override hooks, pre/post pipeline hooks, the arkitect-vs-stan "where does a rule belong" tiering philosophy, the managed-source pattern, Claude Code deployment scripts) and document which concepts transfer directly, which need TS-specific adaptation, and which don't apply.
2. **Select and group the TS/JS tool landscape** into the equivalent of php-qa-ci's four phases (code-modification, lint/validation, static analysis, testing) with concrete tool choices and justification for each.
3. **Design and scaffold the `ts-qa-ci` package architecture**: a single npm devDependency exposing a `ts-qa` orchestrator binary, phased pipeline execution, config cascade (defaults → framework/bundler detection [Vite/Next.js/generic] → project overrides), and a dependency-encapsulation strategy (evaluate: peerDependencies + internal pinning, a vendored/isolated tool-install step analogous to PHIVE, or npm's own overrides mechanism) so consumers get one line in `package.json`, not forty.
4. **Build a custom ESLint rule suite**: always-on core rules plus opt-in tiers, explicitly including a **Component-Driven Development (CDD) tier**:
   - Ban ad hoc/raw HTML elements outside designated component definition files.
   - Ban ad hoc/arbitrary CSS class strings (raw Tailwind utility soup, inline `className="..."` literals) in favour of a component variant-prop API that internally maps variants to a fixed, auditable set of classes.
   - Enforce the variant API pattern itself (naming, typing, exhaustiveness) so variants are the only sanctioned styling surface.
5. **Write progressive-enhancement, high-quality documentation** mirroring php-qa-ci's `docs/` structure: pipeline architecture, configuration/override guide, per-tool docs, coding-standards guide, CI integration guide, and the CDD rules guide — each written so a reader gets value from the first paragraph and can go arbitrarily deep.
6. **Build Claude Code integration tooling**: a `deploy-skills`-equivalent script that pushes ts-qa-ci's skills/hooks/agents/config into a consumer project, mirroring php-qa-ci's approach.
7. **Dogfood on lts-commerce-site**: integrate ts-qa-ci into this repo, run the full pipeline, fix every violation it surfaces (both pipeline-config issues and genuine code-quality issues in this codebase), wire it into `.github/workflows/`, and iterate until CI is fully green and the maintainer considers it production-ready.
8. **Prepare for external rollout** only after dogfooding is clean — final polish pass, versioning/publish plan — as the closing phase of this plan.

## Non-Goals

- **Not building QA tools from scratch.** Same philosophy as php-qa-ci: orchestrate best-in-class existing tools (ESLint, Prettier or Biome, `tsc`, Vitest/Playwright, etc.), don't reinvent them.
- **Not full multi-framework support in v1.** Target generic TS + React/Vite (this repo's stack) as the fully-implemented platform. Architecture should leave room for Next.js/other-framework detection later, but that detection does not need to be built now.
- **Not publishing to the public npm registry as part of this plan.** Publishing is a deliberate, separate go/no-go decision after dogfooding proves the package out — this plan ends at "ready to publish," not "published."
- **Not a big-bang rewrite of this repo's existing ESLint config as a standalone exercise.** CDD rule adoption happens through dogfooding ts-qa-ci against this repo, which surfaces and fixes violations organically (same pattern as Plan 008).
- **Not deciding final CI secrets/publish credentials setup** (npm token provisioning, GitHub org settings) — flagged as a follow-up once rollout is greenlit.

## Context & Background

- Reference implementation: `LongTermSupport/php-qa-ci` (github.com/LongTermSupport/php-qa-ci), cloned locally to `./untracked/repos/php-qa-ci` for research. Composer package `lts/php-qa-ci`, orchestrator binary `bin/qa`, four-phase pipeline (code-mod → lint/validate → static analysis → test), hybrid PHAR/composer/isolated-subproject tool delivery, `qaConfig/` cascade, per-tool `qaConfig/tools/{tool}.inc.bash` overrides, `hookPre.bash`/`hookPost.bash`, PHPArkitect for structural rules vs PHPStan for semantic rules (explicit "never enforce the same convention in both engines" SSoT principle), always-on + opt-in PHPStan rule tiers, a "managed source" codegen mechanism, and `scripts/deploy-skills.bash` for Claude Code integration.
- This repo (`lts-commerce-site`) stack: React 18 + TypeScript (strict) + Vite 6 + Tailwind CSS v4 + React Router v7, SSG via custom prerender script. Existing tooling: ESLint flat config with 11 custom rules already (see Plan 008), Prettier, `tsc` type-checking as a build gate. See root `CLAUDE.md` for full architecture.
- **npm/GitHub scope decision** (resolved 2026-07-10, see Technical Decisions): package will be `@longtermsupport/ts-qa-ci` in a new repo `LongTermSupport/ts-qa-ci`. `@edmondscommerce` is confirmed owned by the maintainer and has genuine prior art (`@edmondscommerce/feqa`, a dormant 2019 "Frontend QA Pipeline" package) but was not chosen — see decision rationale.
- This plan explicitly treats lts-commerce-site as an imperfect dogfood target, not a reference implementation to be preserved as-is.

## Tasks

### Phase 1: Research — php-qa-ci Concept Extraction

- [ ] ⬜ **Task 1.1**: Dispatch Sonnet research agents (dynamic workflow) over `./untracked/repos/php-qa-ci` to produce a structured concept-extraction report
  - [ ] ⬜ Pipeline architecture & phasing philosophy (why 4 phases, why code-mod runs first, fail-fast design)
  - [ ] ⬜ Tool delivery/encapsulation strategy (PHARs via PHIVE, isolated Rector sub-project, `replace` trick, `bin/` shims) and what has a realistic npm/Node equivalent
  - [ ] ⬜ Config cascade & override system (`qaConfig/`, per-tool `.inc.bash` overrides, platform detection)
  - [ ] ⬜ Hook system (`hookPre.bash`/`hookPost.bash`, per-tool override files) and its Claude Code hooks (`deploy-skills.bash`, hook list, migration-on-update behaviour)
  - [ ] ⬜ Rule-tiering philosophy (PHPArkitect vs PHPStan "where does a rule belong," always-on vs opt-in rule tiers, SSoT-never-duplicate principle) — this directly informs the CDD ESLint tier design
  - [ ] ⬜ Documentation structure and style (`docs/`, tool-specific docs, README structure) as the template for ts-qa-ci's docs
  - [ ] ⬜ CI/GitHub Actions templates (`templates/github-actions/*.yml`, the autofix-then-gate pattern, branch protection setup script)
- [ ] ⬜ **Task 1.2**: Opus review pass on the concept-extraction report — confirm nothing load-bearing was missed before design work starts

### Phase 2: Design — TS Tool Landscape & Package Architecture

- [ ] ⬜ **Task 2.1**: Research and select the TS/JS tool for each pipeline phase, with rationale:
  - [ ] ⬜ Phase 1 equivalent (code-modification): formatter (Prettier vs Biome) + codemod/upgrade tool (ts-migrate / Biome's own rules / manual)
  - [ ] ⬜ Phase 2 equivalent (lint/validation): ESLint (flat config), `tsc --noEmit`, import/dependency validation (depcheck / knip), markdown link checking
  - [ ] ⬜ Phase 3 equivalent (static analysis): `tsc` strict mode as the PHPStan analogue; evaluate whether a structural/architecture tool (dependency-cruiser, or a custom ESLint import-boundary tier) is the arkitect analogue
  - [ ] ⬜ Phase 4 equivalent (testing): Vitest (unit) + Playwright (e2e/smoke), mutation testing analogue (Stryker Mutator, optional tier like Infection)
  - [ ] ⬜ Decide the npm-package encapsulation strategy (peerDependencies vs internal pinning vs vendored binaries) and document the tradeoffs explicitly — this has no exact npm equivalent to PHIVE/PHAR and needs its own design
- [ ] ⬜ **Task 2.2**: Design the `ts-qa` orchestrator CLI: phases, `-t <tool>` single-tool mode, `-p <path>` path scoping, config cascade resolution order, platform detection (generic vs Vite vs Next.js), exit-code/retry semantics
- [ ] ⬜ **Task 2.3**: Opus review of the tool-selection + architecture design before scaffolding starts

### Phase 3: Build — Package Scaffold

- [ ] ⬜ **Task 3.1**: Scaffold `ts-qa-ci` in `./untracked/repos/ts-qa-ci` — package.json (`@longtermsupport/ts-qa-ci`), orchestrator CLI, config defaults, directory layout mirroring php-qa-ci's clarity (`configDefaults/`, `bin/`, `docs/`, `.claude/`)
- [ ] ⬜ **Task 3.2**: Implement Phase 1–4 tool runners with the config cascade and per-tool override mechanism
- [ ] ⬜ **Task 3.3**: Implement the CDD ESLint rule tier
  - [ ] ⬜ `no-ad-hoc-html` (or similarly named): bans raw HTML tags outside designated component files
  - [ ] ⬜ `no-ad-hoc-classnames`: bans arbitrary/inline CSS class strings outside a component's internal variant-to-class mapping
  - [ ] ⬜ Variant-API enforcement rule(s): every styleable component must expose typed variant props; internal class resolution is the only place raw classes may appear
  - [ ] ⬜ Rule documentation (purpose, examples, escape hatches) for each, matching the granularity of Plan 008's rule docs
- [ ] ⬜ **Task 3.4**: Implement the Claude Code integration deploy script (skills/hooks/agents push into a consumer project)
- [ ] ⬜ **Task 3.5**: Write the docs set (`docs/pipeline.md`, `docs/configuration.md`, `docs/tools/*.md`, `docs/coding-standards.md`, `docs/cdd-rules.md`, `docs/github-actions.md`) — progressive enhancement style: short/skimmable at the top, full depth available below
- [ ] ⬜ **Task 3.6**: Push scaffolded package to new GitHub repo `LongTermSupport/ts-qa-ci`

### Phase 4: Dogfood — Integrate into lts-commerce-site

- [ ] ⬜ **Task 4.1**: `npm link` (or workspace/file: dependency) ts-qa-ci into this repo as a devDependency
- [ ] ⬜ **Task 4.2**: Run the full `ts-qa` pipeline against this repo; triage every failure into "pipeline/config bug in ts-qa-ci" vs "genuine code-quality issue in lts-commerce-site"
- [ ] ⬜ **Task 4.3**: Fix ts-qa-ci pipeline/config bugs surfaced by the real run (iterate with Phase 3 as needed)
- [ ] ⬜ **Task 4.4**: Fix genuine violations surfaced in this repo's code, including CDD violations (ad hoc HTML/CSS classes) — this is expected to be non-trivial given the current codebase was not built against these rules
- [ ] ⬜ **Task 4.5**: Wire `ts-qa` into `.github/workflows/ci.yml`, replacing/consolidating the existing separate format/lint/typecheck/build steps where appropriate
- [ ] ⬜ **Task 4.6**: Confirm CI green end-to-end on a real PR, not just local runs
- [ ] ⬜ **Task 4.7**: Deploy the Claude Code integration tooling into this repo and confirm it works (skills/hooks show up correctly, no conflicts with existing hooks-daemon setup)

### Phase 5: Rollout Readiness

- [ ] ⬜ **Task 5.1**: Retrospective on dogfooding — what broke, what was surprising, what's still rough
- [ ] ⬜ **Task 5.2**: Final documentation pass incorporating dogfooding lessons
- [ ] ⬜ **Task 5.3**: Decide and document the publish plan (npm publish access, versioning strategy, semver policy) — decision only, execution is a follow-on
- [ ] ⬜ **Task 5.4**: Update this plan's status to Complete and record the outcome

## Dependencies

- **Depends on**: Plan 008 (ESLint Custom Rules Adoption) — provides the existing 11-rule baseline the CDD tier extends, and prior art for how this repo evaluates/adapts external rule sets.
- **Blocks**: Nothing directly; future articles/portfolio content about ts-qa-ci depend on this plan reaching Phase 5.
- **Related**: `LongTermSupport/php-qa-ci` (reference implementation, external repo).

## Technical Decisions

### Decision 1: Package location — new standalone GitHub repo

**Context**: php-qa-ci is a standalone repo/package that projects depend on, not a subdirectory of any one consumer.

**Options Considered**:

1. New standalone GitHub repo (`LongTermSupport/ts-qa-ci`) — matches the proven php-qa-ci model exactly.
2. Develop in `untracked/repos/ts-qa-ci` only, promote later.
3. Subdirectory package (`packages/ts-qa-ci/`) inside lts-commerce-site.

**Decision**: Option 1, with the practical bootstrapping detail from option 2 folded in: scaffold in `./untracked/repos/ts-qa-ci` first (fast iteration, no repo-admin overhead while the shape is still changing), then push to the new `LongTermSupport/ts-qa-ci` GitHub repo once the initial scaffold is solid. Rejected option 3 because it conflates a reusable cross-project tool with a single portfolio-site codebase, and would make dogfooding (a package installed as a dependency) impossible to test honestly.

**Date**: 2026-07-10

### Decision 2: npm scope and package name

**Context**: Needed a real, ownership-confirmed npm scope. Checked three candidates against the npm registry API on 2026-07-10.

**Findings**:

- `@lts` — the scope exists on npm but its member list is hidden via the public API (`{}` returned); ownership by the maintainer could not be confirmed without authenticating. Given how generic "lts" is as a scope name, risky to assume.
- `@longtermsupport` — confirmed **unclaimed** (registry org-lookup returned 404). Exact match to the existing `LongTermSupport` GitHub org, which already hosts `php-qa-ci`.
- `@edmondscommerce` — confirmed **owned** by the maintainer (`registry.npmjs.org/-/org/edmondscommerce/user` → `{"edmondscommerce":"owner"}`). Has genuine prior art: `@edmondscommerce/feqa`, a "Frontend QA Pipeline" package published 2019, now dormant.

**Decision**: `@longtermsupport/ts-qa-ci`, in a new `LongTermSupport/ts-qa-ci` GitHub repo. Chosen for exact consistency with the existing, already-established `php-qa-ci` branding and org, and because ownership is unambiguous (unclaimed scope registered fresh) versus the uncertain `@lts` status. `@edmondscommerce/feqa`'s existence is worth a look during Phase 1 research for any reusable ideas, but the new package supersedes it under the LTS/php-qa-ci lineage rather than reviving the edmondscommerce scope.

**Date**: 2026-07-10

## Success Criteria

- [ ] Concept-extraction report from Phase 1 exists and was reviewed by an Opus pass
- [ ] `ts-qa-ci` package scaffolded, pushed to `LongTermSupport/ts-qa-ci`, installable as a devDependency
- [ ] All four pipeline phases implemented with working default configs
- [ ] CDD ESLint tier implemented, documented, and enforced with zero violations in this repo
- [ ] Full documentation set written in progressive-enhancement style
- [ ] Claude Code integration deploy tooling implemented and verified working in this repo
- [ ] `ts-qa` pipeline wired into this repo's GitHub Actions CI and green on a real PR
- [ ] Rollout-readiness retrospective and publish plan documented

## Risks & Mitigations

| Risk                                                                                          | Impact | Probability | Mitigation                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No clean npm equivalent to PHIVE/PHAR encapsulation exists                                    | Medium | High        | Treat as an open design question in Phase 2, not an assumed solved problem; evaluate peerDependencies + strict version pinning as the pragmatic default |
| CDD rules surface a large volume of violations in this repo, stalling dogfooding              | Medium | Medium      | Expected and budgeted for in Phase 4; fix incrementally, consider `warn` level temporarily if volume is large (same pattern as Plan 008)                |
| Scope creep into full multi-framework support before dogfooding proves the core               | High   | Medium      | Non-Goals explicitly exclude this; architecture leaves room but generic + Vite/React is the only fully-implemented target                               |
| `@longtermsupport` npm scope registration turns out to have friction (e.g. requires paid org) | Low    | Low         | Confirmed unclaimed via registry API; verify actual registration mechanics early in Phase 3 rather than assuming                                        |

## Notes & Updates

### 2026-07-10 - Plan Creation

- Cloned `LongTermSupport/php-qa-ci` to `./untracked/repos/php-qa-ci` for reference research
- Resolved package location (new standalone repo, bootstrapped via `untracked/repos/` first) and npm scope (`@longtermsupport/ts-qa-ci`) via direct npm registry API checks — see Technical Decisions
- Next: dispatch Opus review of this plan's requirements/scope, then kick off the Phase 1 research workflow

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-07-10

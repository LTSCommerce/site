# Plan 012: Migrate ec-site onto `ts-qa-ci`

**Status**: Not Started
**Created**: 2026-07-10
**Owner**: Claude Code
**Priority**: Medium
**Type**: Migration / Refactor
**Related**: Plan 011 (`ts-qa-ci` package — this plan depends on it reaching a usable, installable state)

## Overview

Plan 011 builds `@longtermsupport/ts-qa-ci`, a TypeScript QA/CI harness, dogfooded first on `lts-commerce-site`. Per the maintainer's explicit direction (2026-07-10, recorded at `CLAUDE/Plan/011-ts-qa-ci-package/ec-site-lift-signoff.md`), the second half of that direction is this plan: **ec-site** (a separate, private LongTermSupport codebase — see `untracked/ec-site`) gets refactored to consume `ts-qa-ci` for its generic QA/CI needs, while its private, brand/business-specific rules stay local, layered on top via `ts-qa-ci`'s project-override mechanism (`tsQaConfig/eslint.config.js` additions + `tsQaConfig/tier-a-exemptions.json`, designed in Plan 011's `phase2-design.md` §2.4/§4).

This plan is deliberately **separate from Plan 011**, not a phase within it — an independent Fable-model audit of Plan 011 (`plan-audit-fable-1.md`, finding S5) found that plan already carrying more scope than a single QA-tooling plan should absorb (the package itself, this repo's first-ever tests/CI gates, and a from-scratch design-system build); adding a second codebase's migration on top would compound that. Splitting here follows that audit's own recommendation.

## Goals

1. **Wait for a real dependency to exist**: this plan cannot meaningfully start until Plan 011 has produced an installable `ts-qa-ci` (at minimum: package scaffolded, core tool runners working, CDD Tier A rules implemented — realistically, once Plan 011 reaches Phase 4 dogfooding on `lts-commerce-site` and the pipeline is proven against a real consumer).
2. **Install `ts-qa-ci` into ec-site** via the same CI-reproducible mechanism Plan 011 designs (Task 2.6 — git dependency pinned to a commit SHA, or the published npm package if Plan 011 reaches that point first).
3. **Audit ec-site's own 57-file `eslint-rules/` set against the lift/adapt/drop verdicts already produced in Plan 011's Phase 1 research** (`untracked/plan-011-ecsite-detail-REFERENCE.md` has the full, unredacted per-rule catalogue) — confirm which rules ec-site keeps locally (the drop-tier, business/brand-specific ones) vs. which it now gets for free from `ts-qa-ci` (the lift-as-is/adapt-tier ones, once built) and can delete from its own local rule set.
4. **Refactor ec-site's remaining private rules onto `ts-qa-ci`'s project-override layer** (`tsQaConfig/`) rather than a bespoke local ESLint config — this is the concrete proof that the "easy to layer project-specific/private rules on top of global ones" design goal actually works for a second, independent consumer, not just the single lts-commerce-site dogfood target.
5. **Wire `ts-qa-ci` into ec-site's own CI**, replacing or supplementing whatever QA/CI ec-site runs today (baseline not yet measured — first task of this plan once started).
6. **Retire ec-site's own bespoke orchestrator** (`npm run llm:qa` / `scripts/llm-*.ts`) once `ts-qa-ci`'s orchestrator covers the same ground, to avoid maintaining two parallel QA pipelines for the same stack.

## Non-Goals

- **Not re-deriving the lift/adapt/drop analysis from scratch.** Plan 011's Phase 1 research already did this work — reuse it (`untracked/plan-011-ecsite-detail-REFERENCE.md`), don't re-run the research workflow.
- **Not changing ec-site's content, brand, or business logic.** This is a QA-tooling refactor only.
- **Not starting before Plan 011 has something installable.** No point designing this plan's tasks in detail against a package that doesn't exist yet — this PLAN.md is intentionally light until Plan 011 reaches Phase 4.

## Context & Background

- ec-site is a private React+TS+Vite+Tailwind LongTermSupport codebase, cloned locally to `untracked/ec-site` for Plan 011's research. It already has 57 custom ESLint rule files (54 real rules), a working CDD rule set, and a TS-native orchestrator (`npm run llm:qa`) — Plan 011 Phase 1 catalogued all of them (lift-as-is / adapt / drop, 8/25/21).
- The maintainer's sign-off for Plan 011's Task 3.0 (`CLAUDE/Plan/011-ts-qa-ci-package/ec-site-lift-signoff.md`) is also this plan's mandate: "lets get these site repos fully sorted with this new ts-qa-ci package being used for QA and CI properly."
- This plan's own detailed baseline (ec-site's current CI setup, exact rule counts to retire, etc.) has not yet been measured — that's the first real task once this plan starts, following Plan 011's own discipline of measuring rather than assuming.

## Tasks

### Phase 1: Wait & Prepare

- [ ] ⬜ **Task 1.1 (gate)**: Confirm Plan 011 has reached a state where `ts-qa-ci` is installable in a second, independent project (realistically: Phase 4 dogfooding proven on `lts-commerce-site`, or further). Do not start Phase 2 of this plan before then.
- [ ] ⬜ **Task 1.2**: Measure ec-site's real current QA/CI baseline (existing CI workflow, current `npm run llm:qa` behaviour, current lint/test/build gate status) — mirror Plan 011's own "measure, don't assume" discipline.

### Phase 2: Migrate

- [ ] ⬜ **Task 2.1**: Install `ts-qa-ci` into ec-site via Plan 011's Task 2.6 mechanism
- [ ] ⬜ **Task 2.2**: Re-run the lift/adapt/drop audit against ec-site's actual current rule files (they may have changed since Plan 011's Phase 1 snapshot) and finalise which local rules get deleted vs. kept
- [ ] ⬜ **Task 2.3**: Move ec-site's retained private/brand-specific rules onto the `tsQaConfig/` project-override layer
- [ ] ⬜ **Task 2.4**: Wire `ts-qa-ci` into ec-site's CI, replacing/supplementing existing gates
- [ ] ⬜ **Task 2.5**: Retire ec-site's bespoke `llm:qa` orchestrator once parity is confirmed
- [ ] ⬜ **Task 2.6**: Retrospective — confirm the project-override layering mechanism worked cleanly for a second, independent consumer; feed any friction back into `ts-qa-ci` itself (Plan 011 Phase 5 or a follow-on)

## Dependencies

- **Depends on**: Plan 011 (`ts-qa-ci` package) — hard gate, see Task 1.1.
- **Blocks**: Nothing.
- **Related**: `untracked/ec-site` (target codebase, private); `CLAUDE/Plan/011-ts-qa-ci-package/ec-site-lift-signoff.md` (mandate).

## Success Criteria

- [ ] `ts-qa-ci` installed and running in ec-site's CI
- [ ] ec-site's local rule set contains only genuinely private/brand-specific rules; everything generic now comes from `ts-qa-ci`
- [ ] ec-site's bespoke orchestrator retired (or a documented reason it wasn't)
- [ ] No regression in ec-site's QA coverage versus its pre-migration baseline

## Notes & Updates

### 2026-07-10 - Plan Created

- Split out of Plan 011 per the maintainer's direction to migrate ec-site onto `ts-qa-ci` while keeping ec-site's private rules local, and per the pass-2 Fable audit's S5 finding that Plan 011 shouldn't also absorb a second codebase's migration
- Deliberately light on Phase 2 task detail — this plan is gated on Plan 011 producing something installable first (Task 1.1)

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-07-10

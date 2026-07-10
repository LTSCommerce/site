# Plan 011: ts-qa-ci — TypeScript QA/CI Harness Package

**Status**: In Progress
**Created**: 2026-07-10
**Owner**: Claude Code
**Priority**: High
**Type**: New Package / Tooling
**Related**: Plan 008 (ESLint Custom Rules Adoption — precursor/superseded-by this plan's CDD rule tier)

## Overview

`lts/php-qa-ci` (github.com/LongTermSupport/php-qa-ci) is a mature, single-devDependency QA/CI harness for PHP projects: it pulls in every quality tool transitively, encapsulates delivery (PHARs via PHIVE, an isolated Rector sub-project, replace-section tricks) so it never pollutes a consumer's own dependency graph, ships opinionated-but-overridable default configs via a cascade (defaults → platform → project), runs everything through one orchestrator binary (`vendor/bin/qa`) in a fail-fast phased pipeline, and includes first-class Claude Code integration (`deploy-skills.bash` pushes hooks/skills/agents into the consumer project).

This plan creates `ts-qa-ci`, the equivalent harness for TypeScript/React projects, published as `@longtermsupport/ts-qa-ci` from a new GitHub repo `LongTermSupport/ts-qa-ci`. It is developed by cloning **two** references for research, not one: `php-qa-ci` (`./untracked/repos/php-qa-ci`, done) for orchestration/delivery philosophy, and `./untracked/ec-site/` — a React+TS+Vite+Tailwind LongTermSupport site that **already implements most of this plan's ambitions in idiomatic TypeScript** (57 custom ESLint rules with per-rule docs, working Component-Driven-Development rules including a solved articles/raw-HTML collision, a `bin/qa`-equivalent `npm run llm:qa` orchestrator, meta-rules) — for the TS-native realisations. The new package is scaffolded in `./untracked/repos/ts-qa-ci` (gitignored working copy) before being pushed to its own GitHub repo. Once the package exists, **this repo (lts-commerce-site) is the first and mandatory dogfooding consumer** — every rough edge is found and fixed here, and the pipeline is wired into this repo's GitHub Actions CI, before ts-qa-ci is considered ready to roll out to any other project.

A first-class deliverable of this plan is a **Component-Driven Development (CDD) ESLint rule tier**: a set of custom rules that ban ad hoc raw HTML outside designated component files and ban ad hoc/arbitrary CSS class strings, forcing all styling through component variant props that internally resolve to a constrained, reviewable set of classes.

This repo is explicitly **not** assumed to be a paragon of best practice going in — dogfooding is expected to surface real violations in the existing codebase, and fixing them is part of the plan, not a sign the plan is broken. A pre-flight Opus review (2026-07-10) confirmed this and quantified the real baseline (see Context & Background): CI today enforces nothing but the build, there are zero test files despite Vitest being configured, and the CDD ambition collides with a 19.7k-line article-content file that no AST rule can see inside.

## Goals

1. **Extract transferable concepts from BOTH references**, researched in parallel:

   - `php-qa-ci` for orchestration & delivery philosophy: phased fail-fast pipeline, the read-only/CI-write duality (mutating tools dry-run-and-fail in CI, auto-fix locally), hybrid tool-delivery encapsulation, config cascade, the arkitect-vs-stan "where does a rule belong" tiering philosophy, the "estate-wide checks must be pipeline-owned, not opt-in rules" lesson, the managed-source pattern, Claude Code deployment scripts.
   - `ec-site` for TS-native realisations: catalogue its 57 custom ESLint rules (lift/adapt/drop), its working CDD rules (`no-html-in-pages`, `no-raw-block-html-in-articles` — a solved version of this plan's own articles-HTML collision), its `npm run llm:qa` orchestrator shape, its meta-rules, and the synchronous-ESLint-handler gotcha documented in its `eslint-rules/CLAUDE.md`.

   Document every extracted concept as transfers-directly / needs-TS-adaptation / doesn't-apply, and note whether ec-site already implements it.

2. **Select and group the TS/JS tool landscape** into the equivalent of php-qa-ci's four phases (code-modification, lint/validation, static analysis, testing), pre-committing to the parts this repo and ec-site already force (ESLint flat config + Prettier + `tsc` + Vitest + Playwright — Biome is off the table because the CDD tier requires custom JS-authored ESLint rules) and reserving genuine research time for the parts that are actually open (dependency-cruiser vs. custom import-boundary rule as the arkitect analogue; Stryker as an optional mutation tier; knip vs. depcheck).

3. **Design and scaffold the `ts-qa-ci` package architecture**: a single npm devDependency exposing a `ts-qa` orchestrator binary, phased pipeline execution with the read-only/CI-write duality as a first-class concept, config cascade (defaults → framework/bundler detection [Vite/Next.js/generic] → project overrides), and a dependency-encapsulation strategy. Note going in: npm's nested dependency model means the PHIVE/PHAR problem (Composer's flat graph forcing autoloader pollution) mostly doesn't exist in npm — the real open questions are narrower (peerDependencies vs. bundled deps for `typescript`/`eslint`/`vite`, and ESLint plugin delivery via exported flat-config rule objects, which ec-site already demonstrates).

4. **Build a custom ESLint rule suite**: always-on core rules plus opt-in tiers, explicitly including a **Component-Driven Development (CDD) tier**:

   - Ban ad hoc/raw HTML elements in `.tsx` JSX (component/page files) outside designated component definition files. Scoped to JSX only — `src/data/articles.ts`'s template-literal HTML content is a sanctioned, separately-governed string-HTML surface (an AST/JSX rule cannot see inside a string literal anyway; see Context & Background and ec-site's `no-raw-block-html-in-articles` for the precedent of treating article prose HTML as legitimately different from page/component HTML).
   - Ban ad hoc/arbitrary CSS class strings (raw Tailwind utility soup, inline `className="..."` literals) in favour of a component variant-prop API that internally maps variants to a fixed, auditable set of classes.
   - Enforce the variant API pattern itself (naming, typing, exhaustiveness) so variants are the only sanctioned styling surface. This repo currently has **no** variant-prop infrastructure (0 `class-variance-authority` usage, 17 component files) to redirect violators to, unlike ec-site — building that catalogue is explicitly brought into this plan's scope (Phase 4) rather than quietly dropped, because it's necessary infrastructure for the CDD vision, not optional polish.
   - Decide (Phase 2) whether ts-qa **owns and runs** its own ESLint config over a consumer, rather than merely publishing includable rule objects — the direct TS analogue of php-qa-ci's "estate-wide checks can't be opt-in rules" lesson (its SensitiveParameter check is an always-on pipeline tool, not an opt-in PHPStan rule, for exactly this reason).

5. **Write progressive-enhancement, high-quality documentation** mirroring php-qa-ci's `docs/` structure: pipeline architecture, configuration/override guide, per-tool docs, coding-standards guide, CI integration guide, and the CDD rules guide — each written so a reader gets value from the first paragraph and can go arbitrarily deep.

6. **Build Claude Code integration tooling**: a `deploy-skills`-equivalent script that pushes ts-qa-ci's skills/hooks/agents/config into a consumer project, mirroring php-qa-ci's approach, authored in Node (not bash) for cross-platform portability, with an explicit manual-deploy-vs-postinstall-auto-deploy decision (Phase 2) and compatibility check against this repo's existing hooks-daemon `.claude/settings.json` policy (Phase 4).

7. **Dogfood on lts-commerce-site**: integrate ts-qa-ci into this repo, run the full pipeline, fix every violation it surfaces (both pipeline-config issues and genuine code-quality issues in this codebase), wire it into `.github/workflows/` **for the first time** (this repo's CI currently runs build+deploy only — nothing to "consolidate"), and iterate until CI is fully green and the maintainer considers it production-ready.

8. **Prepare for external rollout** only after dogfooding is clean — final polish pass, versioning/publish plan — as the closing phase of this plan.

## Non-Goals

- **Not building QA tools from scratch.** Same philosophy as php-qa-ci: orchestrate best-in-class existing tools (ESLint, Prettier, `tsc`, Vitest/Playwright, etc.), don't reinvent them.
- **Not adopting Biome to replace ESLint.** The CDD tier requires custom JS-authored ESLint rules; Biome's plugin story (GritQL) cannot run them. Biome as an additional/alternative *formatter* alongside Prettier is a minor, deferrable optimisation, not something this plan needs to settle.
- **Not full multi-framework support in v1.** Target generic TS + React/Vite (this repo's stack) as the fully-implemented platform. Architecture should leave room for Next.js/other-framework detection later, but that detection does not need to be built now.
- **Not publishing to the public npm registry as part of this plan.** Publishing is a deliberate, separate go/no-go decision after dogfooding proves the package out — this plan ends at "ready to publish," not "published."
- **Not migrating `src/data/articles.ts` HTML content to JSX/MDX/components.** The CDD "no ad hoc HTML" rule targets `.tsx` JSX only; article prose HTML stays a sanctioned string-content surface. Policing that content is a separate, later, string-linter-or-MDX-migration plan, named here only to be explicitly out of scope.
- **Not a big-bang rewrite of this repo's existing ESLint config as a standalone exercise.** CDD rule adoption happens through dogfooding ts-qa-ci against this repo, which surfaces and fixes violations organically (same pattern as Plan 008).
- **Not Windows-first.** Targets Linux CI (matches php-qa-ci and this repo's GitHub Actions runners); the Claude Code deploy tooling is authored in Node for portability, but Windows dev-machine support is not a requirement of this plan.
- **Not deciding final CI secrets/publish credentials setup** (npm token provisioning, GitHub org settings) — flagged as a follow-up once rollout is greenlit.

## Context & Background

- Reference 1: `LongTermSupport/php-qa-ci` (github.com/LongTermSupport/php-qa-ci), cloned locally to `./untracked/repos/php-qa-ci`. Composer package `lts/php-qa-ci`, orchestrator binary `bin/qa`, four-phase pipeline (code-mod → lint/validate → static analysis → test), the `qaReadOnly`/`detectReadOnly` read-only-in-CI/auto-fix-locally duality governing every mutating tool, hybrid PHAR/composer/isolated-subproject tool delivery, `qaConfig/` cascade, per-tool `qaConfig/tools/{tool}.inc.bash` overrides, `hookPre.bash`/`hookPost.bash`, PHPArkitect for structural rules vs PHPStan for semantic rules (explicit "never enforce the same convention in both engines" SSoT principle), always-on + opt-in PHPStan rule tiers (SensitiveParameter coverage is deliberately an always-on pipeline tool, *not* an opt-in rule, because opt-in rules "can't be relied on estate-wide"), a "managed source" codegen mechanism, and `scripts/deploy-skills.bash` for Claude Code integration.
- Reference 2: `./untracked/ec-site/` (LongTermSupport org, React+TS+Vite+Tailwind — same stack as this repo). **Confirmed present**: 57 files in `eslint-rules/*.js` each with a paired `.md` doc; CDD rules already built, including `no-html-in-pages.js` (bans raw HTML in page files, ships a component-replacement fix prompt) and `no-raw-block-html-in-articles.js` (the solved version of this plan's own articles-HTML collision — distinguishes allowed prose HTML from block HTML that must become components); `eslint-plugin-tailwindcss` for class ordering/validation; a TS-native orchestrator (`scripts/llm-*.ts`: `llm-lint.ts`, `llm-fix.ts`, `llm-type-check.ts`, `llm-format-check.ts`, wired as `npm run llm:qa`, caching under `var/qa/`); meta-rules that lint the rules themselves. Its `eslint-rules/CLAUDE.md` documents that ESLint rule handlers must be synchronous (use `execSync`, not async) — a gotcha worth avoiding rediscovery of. ec-site is a private repo; lifting its rules into a package intended to be publishable needs the maintainer's explicit sign-off (see Technical Decisions).
- This repo (`lts-commerce-site`) stack: React 18 + TypeScript (strict) + Vite 6 + Tailwind CSS v4 + React Router v7, SSG via custom prerender script. Existing tooling: ESLint flat config with 11 custom rules already (see Plan 008), Prettier, `tsc` type-checking, Vitest configured. It already has its own `llm:lint` / `llm:type-check` / `llm:test` / `llm:qa` npm scripts mirroring ec-site's convention. See root `CLAUDE.md` for full architecture (note: CLAUDE.md's CI description is partly aspirational — see baseline facts below).
- **Real baseline measured 2026-07-10** (run directly, not from CLAUDE.md's description):
  - `.github/workflows/ci.yml` runs **only** `npm run build` then deploy. There is no ESLint, Prettier, or test step in CI today. Phase 4 therefore **adds** quality gates to CI for the first time — it does not "consolidate" existing ones.
  - `npm run lint` (ESLint): **5 pre-existing errors**, all SEO-metadata length violations in `Home.tsx` and `NotFound.tsx`, unrelated to this plan.
  - `npm run format:check` (Prettier): **53 files under `src/`** have formatting drift (plus a large amount of noise outside `src/` — `.claude/`, vendored `untracked/` subprojects — that ts-qa-ci's own finder should exclude, mirroring php-qa-ci's `php_cs_finder.php` exclusions; not a real signal).
  - `npm run test:run` (Vitest): **zero test files exist** ("No test files found", exit 1) despite Vitest being fully configured. Testing is Phase 4 (Testing) of php-qa-ci's pipeline and has no baseline to protect — every test ts-qa-ci's pipeline requires will be new.
  - `src/data/articles.ts` is **19,714 lines** containing roughly **10,000+ raw HTML tags** — but as content inside JavaScript template-literal strings in a `.ts` data file, not JSX. An AST/JSX-based ESLint rule cannot see inside a string literal; this is why the CDD rule is explicitly scoped to `.tsx` JSX only (see Goals/Non-Goals).
  - This repo has **zero** `class-variance-authority` usage and only 17 component files — there is no existing variant-prop catalogue for a `className` ban to redirect violators to. Building one is in scope for Phase 4, not assumed to pre-exist.
- **npm/GitHub scope decision** (resolved 2026-07-10, see Technical Decisions): package will be `@longtermsupport/ts-qa-ci` in a new repo `LongTermSupport/ts-qa-ci`. `@edmondscommerce` is confirmed owned by the maintainer and has genuine prior art (`@edmondscommerce/feqa`, a dormant 2019 "Frontend QA Pipeline" package) but was not chosen — see decision rationale.
- **Pre-flight review**: an Opus agent reviewed this plan's first draft against both references and this repo's real state before Phase 1 research was dispatched; findings are folded into this version. Full critique retained at `untracked/plan-011-review.md` (gitignored, not part of the plan itself) for anyone who wants the raw reasoning.
- This plan explicitly treats lts-commerce-site as an imperfect dogfood target, not a reference implementation to be preserved as-is.

## Tasks

### Phase 1: Research — Concept Extraction from Both References ✅ Complete (2026-07-10)

- [x] ✅ **Task 1.1**: Dispatched 12 parallel Sonnet research agents over both references; synthesized into `untracked/plan-011-phase1-concept-report.md` (391 lines, Parts A/B/C + appendix). Covered all planned bullets for both `php-qa-ci` (7 areas: pipeline phasing, read-only/CI duality, tool delivery, config cascade, hooks/Claude integration, rule-tiering, docs/CI templates) and `ec-site` (5 areas: full 54-rule catalogue lift/adapt/drop, CDD deep-dive, orchestrator/caching, meta-rules, licensing flag)
- [x] ✅ **Task 1.2**: Opus review pass complete — verdict **READY FOR PHASE 2**, 6/6 spot-checked claims verified true against source, only 2 cosmetic findings (rule-count framing, one file citation), zero load-bearing gaps. Review at `untracked/plan-011-phase1-review.md`

### Phase 2: Design — TS Tool Landscape & Package Architecture

- [ ] ⬜ **Task 2.1**: Confirm the pre-committed baseline stack (ESLint flat config + Prettier + `tsc` + Vitest + Playwright) against Phase 1 findings, and resolve the genuinely open tool choices:
  - [ ] ⬜ Structural/architecture tool for the arkitect analogue: dependency-cruiser vs. a custom ESLint import-boundary rule tier
  - [ ] ⬜ Optional mutation-testing tier (Stryker Mutator, matching Infection's optional-tier treatment)
  - [ ] ⬜ Dead-code/unused-dependency tool: knip vs. depcheck
  - [ ] ⬜ Markdown link checking (a direct `mdlinks` analogue)
- [ ] ⬜ **Task 2.2**: Design the `ts-qa` orchestrator CLI: phases, `-t <tool>` single-tool mode, `-p <path>` path scoping, config cascade resolution order, platform detection (generic vs Vite vs Next.js), exit-code/retry semantics, and the read-only/CI-write duality as a built-in mode (not bolted on later)
- [ ] ⬜ **Task 2.3**: Decide the npm dependency-encapsulation strategy concretely: which tools are peerDependencies (must match consumer's own version — `typescript`, `eslint`, `vite`) vs. bundled `dependencies`; confirm ESLint plugin delivery via exported flat-config rule objects (ec-site's approach)
- [ ] ⬜ **Task 2.4**: Decide whether ts-qa **owns and runs** its own ESLint config over a consumer (estate-wide enforcement, php-qa-ci's SensitiveParameter pattern) vs. shipping includable rule sets a consumer must opt into — this determines whether the CDD tier can ever be guaranteed-on, not just available
- [ ] ⬜ **Task 2.5**: Decide the Claude Code integration deploy mechanism: manual `deploy-skills`-style script only, vs. npm `postinstall` auto-deploy (document the `--ignore-scripts`/CI-policy/dirty-tree caveats php-qa-ci's own README flags for its composer-plugin equivalent) — and design the opt-out flag either way
- [ ] ⬜ **Task 2.6**: Decide the non-publish CI install mechanism needed for Phase 4 (git dependency, GitHub Packages, or committed tarball) — required before Task 4.6 can be attempted, since `npm ci` in GitHub Actions cannot resolve an `npm link` or a gitignored `file:` path
- [ ] ⬜ **Task 2.7**: Opus review of the tool-selection + architecture design before scaffolding starts

### Phase 3: Build — Package Scaffold

- [ ] ⬜ **Task 3.0 (gate)**: Obtain the maintainer's explicit sign-off on lifting ec-site code per Decision 5 before any other Phase 3 task begins — (1) confirms ec-site code may be relicensed/republished under `@longtermsupport`, (2) confirms the lift/adapt/drop audit boundary (generic infrastructure vs. brand-specific rules that must stay private)
- [ ] ⬜ **Task 3.1**: Scaffold `ts-qa-ci` in `./untracked/repos/ts-qa-ci` — package.json (`@longtermsupport/ts-qa-ci`), orchestrator CLI, config defaults, directory layout mirroring php-qa-ci's clarity (`configDefaults/`, `bin/`, `docs/`, `.claude/`)
- [ ] ⬜ **Task 3.2**: Implement Phase 1–4 tool runners with the config cascade, per-tool override mechanism, and the read-only/CI-write duality
- [ ] ⬜ **Task 3.3**: Implement the CDD ESLint rule tier — **iteratively, cross-checked against this repo's real code from the start** (do not treat this as a frozen deliverable to hand to Phase 4 unchanged; prototype early against this repo's actual JSX/className surface and adapt ec-site's already-tuned versions rather than re-deriving from zero)
  - [ ] ⬜ `no-ad-hoc-html` (JSX-scoped, adapted from ec-site's `no-html-in-pages`): bans raw HTML tags in `.tsx` component/page files outside designated component definition files
  - [ ] ⬜ `no-ad-hoc-classnames`: bans arbitrary/inline CSS class strings outside a component's internal variant-to-class mapping
  - [ ] ⬜ Variant-API enforcement rule(s): every styleable component must expose typed variant props; internal class resolution is the only place raw classes may appear
  - [ ] ⬜ Rule documentation (purpose, examples, escape hatches) for each, matching the granularity of Plan 008's and ec-site's rule docs
- [ ] ⬜ **Task 3.4**: Implement the Claude Code integration deploy script (Node-authored, per Decision) — skills/hooks/agents push into a consumer project
- [ ] ⬜ **Task 3.5**: Write the docs set (`docs/pipeline.md`, `docs/configuration.md`, `docs/tools/*.md`, `docs/coding-standards.md`, `docs/cdd-rules.md`, `docs/github-actions.md`) — progressive enhancement style: short/skimmable at the top, full depth available below
- [ ] ⬜ **Task 3.6**: Push the scaffolded package to the new GitHub repo `LongTermSupport/ts-qa-ci` — timed to when Phase 4 actually needs a CI-installable ref (Task 2.6's mechanism), not as an earlier formality

### Phase 4: Dogfood — Integrate into lts-commerce-site

- [ ] ⬜ **Task 4.1**: Install ts-qa-ci into this repo via the Task 2.6 mechanism (not a bare `npm link`, which CI cannot reproduce)
- [ ] ⬜ **Task 4.2**: Run the full `ts-qa` pipeline against this repo; triage every failure into "pipeline/config bug in ts-qa-ci" vs "genuine code-quality issue in lts-commerce-site". Expect the full measured baseline (5 ESLint errors, 53 files of Prettier drift, zero existing tests) plus whatever the new rule tiers surface — this is a first-time gate, not a consolidation
- [ ] ⬜ **Task 4.3**: Fix ts-qa-ci pipeline/config bugs surfaced by the real run (iterate with Phase 3 as needed)
- [ ] ⬜ **Task 4.4**: Fix the pre-existing baseline violations (5 ESLint errors, Prettier drift) — independent of and prior to CDD-specific work, so CDD triage isn't muddied by unrelated pre-existing issues
- [ ] ⬜ **Task 4.5**: CDD violation remediation, sub-phased given there is no pre-existing variant-prop catalogue to redirect fixes to:
  - [ ] ⬜ Triage/categorise every `no-ad-hoc-html` and `no-ad-hoc-classnames` violation across `src/pages/**` and `src/components/**` (expect ~185 raw JSX tags and ~259 `className` literals per the measured baseline) — group by recurring pattern, not file-by-file
  - [ ] ⬜ Build/extend the variant-prop component catalogue for the patterns that recur (this is genuinely new component work, not just rule-fixing — budget for it explicitly rather than treating it as incidental)
  - [ ] ⬜ Migrate violations onto the catalogue
  - [ ] ⬜ Re-run the CDD tier to confirm convergence
- [ ] ⬜ **Task 4.6**: Add lint + format-check + type-check + test gates to `.github/workflows/ci.yml` for the first time (there is nothing to "consolidate" — today's CI only builds and deploys), orchestrated via `ts-qa`
- [ ] ⬜ **Task 4.7**: Confirm CI green end-to-end on a real PR, not just local runs — requires Task 3.6/2.6 (a CI-resolvable install mechanism) to already be in place
- [ ] ⬜ **Task 4.8**: Deploy the Claude Code integration tooling into this repo and confirm it works (skills/hooks show up correctly, no conflicts with this repo's existing hooks-daemon setup — check `hook_registration_checker` policy compliance specifically)

### Phase 5: Rollout Readiness

- [ ] ⬜ **Task 5.1**: Retrospective on dogfooding — what broke, what was surprising, what's still rough
- [ ] ⬜ **Task 5.2**: Final documentation pass incorporating dogfooding lessons
- [ ] ⬜ **Task 5.3**: Decide and document the publish plan (npm publish access, versioning strategy, semver policy) — decision only, execution is a follow-on
- [ ] ⬜ **Task 5.4**: Update this plan's status to Complete and record the outcome

## Dependencies

- **Depends on**: Plan 008 (ESLint Custom Rules Adoption) — provides the existing 11-rule baseline the CDD tier extends, and prior art for how this repo evaluates/adapts external rule sets.
- **Blocks**: Nothing directly; future articles/portfolio content about ts-qa-ci depend on this plan reaching Phase 5.
- **Related**: `LongTermSupport/php-qa-ci` (reference implementation, external repo); `untracked/ec-site` (TS-native reference implementation, private LongTermSupport repo — see Technical Decisions on provenance).

## Technical Decisions

### Decision 1: Package location — new standalone GitHub repo

**Context**: php-qa-ci is a standalone repo/package that projects depend on, not a subdirectory of any one consumer.

**Options Considered**:

1. New standalone GitHub repo (`LongTermSupport/ts-qa-ci`) — matches the proven php-qa-ci model exactly.
2. Develop in `untracked/repos/ts-qa-ci` only, promote later.
3. Subdirectory package (`packages/ts-qa-ci/`) inside lts-commerce-site.

**Decision**: Option 1, with the practical bootstrapping detail from option 2 folded in: scaffold in `./untracked/repos/ts-qa-ci` first (fast iteration, no repo-admin overhead while the shape is still changing), then push to the new `LongTermSupport/ts-qa-ci` GitHub repo once the initial scaffold is solid **and Phase 4 actually needs a CI-installable reference** (see Task 3.6/2.6 — pushing earlier as a pure formality was identified as premature during pre-flight review). Rejected option 3 because it conflates a reusable cross-project tool with a single portfolio-site codebase, and would make dogfooding (a package installed as a dependency) impossible to test honestly.

**Date**: 2026-07-10

### Decision 2: npm scope and package name

**Context**: Needed a real, ownership-confirmed npm scope. Checked three candidates against the npm registry API on 2026-07-10.

**Findings**:

- `@lts` — the scope exists on npm but its member list is hidden via the public API (`{}` returned); ownership by the maintainer could not be confirmed without authenticating. Given how generic "lts" is as a scope name, risky to assume.
- `@longtermsupport` — confirmed **unclaimed** (registry org-lookup returned 404). Exact match to the existing `LongTermSupport` GitHub org, which already hosts `php-qa-ci`.
- `@edmondscommerce` — confirmed **owned** by the maintainer (`registry.npmjs.org/-/org/edmondscommerce/user` → `{"edmondscommerce":"owner"}`). Has genuine prior art: `@edmondscommerce/feqa`, a "Frontend QA Pipeline" package published 2019, now dormant. Note: `ec-site` (the Phase 1 TS-native reference) *is* the edmondscommerce-branded codebase.

**Decision**: `@longtermsupport/ts-qa-ci`, in a new `LongTermSupport/ts-qa-ci` GitHub repo. Chosen for exact consistency with the existing, already-established `php-qa-ci` branding and org, and because ownership is unambiguous (unclaimed scope registered fresh) versus the uncertain `@lts` status. `ec-site`/`@edmondscommerce/feqa` prior art is mined for ideas (Phase 1) but the new package supersedes it under the LTS/php-qa-ci lineage rather than reviving the edmondscommerce scope.

**Date**: 2026-07-10

### Decision 3: CDD rule scope is JSX-only; `articles.ts` is explicitly exempt

**Context**: Pre-flight review found the original "ban all ad hoc HTML" wording ambiguous to the point of being unbuildable: `src/data/articles.ts` is 19,714 lines of HTML content inside JavaScript template-literal strings, not JSX, and is already special-cased in the existing `eslint.config.js` for other rules "because it holds raw article data including HTML content strings."

**Decision**: The CDD `no-ad-hoc-html` rule is an AST/JSX rule scoped to `.tsx` files under `src/pages/**` and `src/components/**`. Article prose HTML inside `articles.ts` template literals is a sanctioned, separately-governed surface — not policed by this rule, following the precedent of ec-site's `no-raw-block-html-in-articles`, which draws exactly this distinction. Success criteria and violation counts are defined against the JSX surface only.

**Date**: 2026-07-10

### Decision 4: Building the variant-prop component catalogue is in scope, not descoped

**Context**: `no-ad-hoc-classnames` and variant-API enforcement presuppose a catalogue of components with typed variant props to redirect violators to. This repo has none (0 `class-variance-authority` usage, 17 components). ec-site can enforce its equivalent rule because it already has that catalogue; this repo does not.

**Options Considered**:

1. Descope variant-API enforcement from v1 entirely; ship only `no-ad-hoc-html` + Tailwind-class hygiene (no catalogue needed).
2. Bring building/extending the variant-prop catalogue into this plan's Phase 4 scope explicitly.

**Decision**: Option 2. The user's stated ambition for this plan centres the CDD variant-driven-styling vision explicitly ("components have variants, variants internally drive custom CSS classes") — descoping it to a future plan would hollow out the plan's central deliverable rather than deliver it. Phase 4 (Task 4.5) is sub-phased accordingly: triage violations by recurring pattern, build the catalogue for those patterns, migrate, then enforce. This is acknowledged as materially more work than a pure rule-authoring task, and is budgeted as its own sub-phase rather than folded silently into "fix violations."

**Date**: 2026-07-10

### Decision 5: ec-site code lift requires the maintainer's explicit sign-off — blocking precondition for Phase 3

**Context**: Phase 1 research (Task 1.1, see `untracked/plan-011-phase1-concept-report.md` §B.5) found that ec-site is a private (`"private": true`) LongTermSupport repo, while `ts-qa-ci` is intended to become a publishable `@longtermsupport`-scoped package. Lifting ec-site's rules, meta-rules, cache library, or orchestrator scripts — even adapted — changes their exposure from "private, internal to one client site" to "public, redistributable." Several rules explicitly marked `drop` in the B.1 catalogue are ec-site-brand-specific (`no-hardcoded-contact-details.js`, `enforce-contact-link-whitelist.js`, `validate-tech-logos.js`, `validate-case-studies-index.js`, among others), underscoring this isn't a hypothetical concern.

**Decision**: Before any Phase 3 code lift begins (Task 3.1 onward), obtain the maintainer's explicit sign-off that (1) ec-site's code may be relicensed/republished under the `@longtermsupport` scope, and (2) rules to be ported are audited first to separate genuinely generic QA infrastructure (the cache library, meta-rule concept, orchestrator shape, and the TRANSFERS-DIRECTLY/lift-as-is rows in the B.1 catalogue) from ec-site-brand-specific rules that must stay private or be rewritten from scratch. This is treated as a blocking precondition, not a footnote — added as an explicit Phase 3 gate task.

**Date**: 2026-07-10

## Success Criteria

- [ ] Concept-extraction report from Phase 1 exists (covering both php-qa-ci and ec-site) and was reviewed by an Opus pass
- [ ] `ts-qa-ci` package scaffolded, pushed to `LongTermSupport/ts-qa-ci`, installable via a CI-reproducible mechanism (not `npm link`)
- [ ] All four pipeline phases implemented with working default configs, including the read-only/CI-write duality
- [ ] CDD ESLint tier implemented, documented, and enforced with zero violations in `src/pages/**` and `src/components/**` `.tsx` files (articles.ts explicitly exempted per Decision 3)
- [ ] A variant-prop component catalogue exists in this repo sufficient to have migrated every triaged CDD violation onto it
- [ ] Pre-existing baseline (5 ESLint errors, Prettier drift, zero tests) resolved independent of CDD work
- [ ] Full documentation set written in progressive-enhancement style
- [ ] Claude Code integration deploy tooling implemented and verified working in this repo, confirmed compatible with the existing hooks-daemon setup
- [ ] `ts-qa` pipeline wired into this repo's GitHub Actions CI (lint + format + type-check + test, added for the first time) and green on a real PR
- [ ] Rollout-readiness retrospective and publish plan documented

## Risks & Mitigations

| Risk                                                                                                        | Impact | Probability | Mitigation                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------- | ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Building the variant-prop catalogue (Decision 4) turns out much larger than a QA-tooling plan should absorb | High   | Medium      | Sub-phased and explicitly budgeted in Task 4.5; if it balloons, the fallback is to split catalogue-building into its own plan and re-scope Decision 4 to option 1 rather than stall Phase 4 indefinitely |
| No CI-reproducible install mechanism is settled before Phase 4 needs one                                    | Medium | Low         | Task 2.6 makes this an explicit Phase 2 decision, not a Phase 4 surprise (was a hard blocker found only at plan-review time in the first draft)                                                          |
| Adding lint/format/type/test gates to CI for the first time surfaces more than the measured baseline        | Medium | Medium      | Baseline already measured directly (5 ESLint errors, 53 Prettier-drift files, 0 tests) rather than assumed; Task 4.4 handles it before CDD-specific work begins                                          |
| Scope creep into full multi-framework support before dogfooding proves the core                             | High   | Medium      | Non-Goals explicitly exclude this; architecture leaves room but generic + Vite/React is the only fully-implemented target                                                                                |
| Lifting ec-site's rules into a publishable package without the maintainer's sign-off                        | Low    | Low         | Flagged explicitly in Phase 1 (Task 1.1) as a provenance question to raise, not resolve unilaterally                                                                                                     |
| `@longtermsupport` npm scope registration turns out to have friction (e.g. requires paid org)               | Low    | Low         | Confirmed unclaimed via registry API; verify actual registration mechanics early in Phase 3 rather than assuming                                                                                         |

## Notes & Updates

### 2026-07-10 - Plan Creation

- Cloned `LongTermSupport/php-qa-ci` to `./untracked/repos/php-qa-ci` for reference research
- Resolved package location (new standalone repo, bootstrapped via `untracked/repos/` first) and npm scope (`@longtermsupport/ts-qa-ci`) via direct npm registry API checks — see Technical Decisions

### 2026-07-10 - Pre-flight Opus Review

- Dispatched an Opus review of the first draft against both references and this repo's real state before committing to Phase 1 research spend
- Discovered `./untracked/ec-site/` as a first-class, previously-unreferenced TS-native implementation of most of this plan's ambitions (57 ESLint rules, working CDD rules, solved articles-HTML collision, TS orchestrator) — folded in as a parallel Phase 1 research target alongside php-qa-ci
- Corrected the CI premise: measured directly, `.github/workflows/ci.yml` runs build+deploy only, no lint/format/test gate exists today, despite CLAUDE.md describing one — Phase 4 adds gates, doesn't consolidate them
- Measured real baseline: 5 pre-existing ESLint errors, 53 files of Prettier drift under `src/`, zero test files despite Vitest being configured, ~10,000+ raw HTML tags in `articles.ts` (string content, invisible to JSX rules), 0 `class-variance-authority` usage / 17 components (no variant catalogue exists)
- Scoped the CDD "no ad hoc HTML" rule to `.tsx` JSX only, explicitly exempting `articles.ts` (Decision 3)
- Decided to bring variant-prop catalogue construction into Phase 4 scope rather than descope it (Decision 4), matching the user's explicit CDD ambition
- Added an explicit non-publish CI-install-mechanism decision point (Task 2.6) ahead of the point where it would otherwise block Task 4.7
- Full raw critique retained at `untracked/plan-011-review.md` (gitignored)

### 2026-07-10 - Phase 1 Research Complete

- 12-agent research workflow completed cleanly (14/14 agents succeeded, 0 errors); concept-extraction report and Opus review both written to `untracked/` (gitignored, not part of the plan itself)
- **Headline findings**: the read-only/CI-write duality (`qaReadOnly`/`detectReadOnly`) is confirmed as php-qa-ci's single most load-bearing mechanism and maps cleanly to Prettier `--check`/`--write` + ESLint `--fix`/not; npm's nested dependency model means the PHIVE/PHAR encapsulation problem mostly doesn't exist (DOESNT-APPLY) — real Phase 2 work is narrower (peerDeps for `typescript`/`eslint`/`vite`, ESLint plugin delivery via exported flat-config objects, already proven by ec-site)
- **ec-site rule catalogue**: all 54 real rules (of 57 files — 3 are a POC/helper/test) classified: 8 lift-as-is, 25 adapt, 21 drop. Strong always-on core-tier candidates identified: `no-eslint-disable` (3 independent cross-project precedents), `no-duplicate-section-ids`, `no-placeholder`, `require-explicit-type-annotations`, `require-exported-component-types`, `ssr-safe-hooks`, `validate-lazy-imports`, the meta-rules
- **CDD findings sharpen Decision 3/4**: `no-html-in-pages.js` is the confirmed ancestor of `no-ad-hoc-html`, needs widening to cover `src/components/**` not just pages; `no-raw-block-html-in-articles.js`'s mechanism is DOESNT-APPLY here (ec-site's articles are JSX, ours are template-literal strings) but its *governing principle* substantiates Decision 3 as-is; ec-site's own CVA/variant infrastructure is a **single-component pilot** (only `button.tsx`), not a mature catalogue — sharpens and validates Decision 4's choice to budget catalogue-building as real Phase 4 work rather than assume one exists to copy
- **`validate-routes-have-pages.js` flagged unsafe**: uses `eval()` on extracted source text — must be rebuilt with AST-based extraction before any adaptation, not a straight port
- **Genuinely open gaps for Phase 2** (not resolved by Phase 1 research): knip vs depcheck, markdown-link-checker tool choice (Task 2.1 remainder), and the non-publish CI install mechanism (Task 2.6) — flagged explicitly rather than guessed at
- **Blocking precondition surfaced**: ec-site is a private repo; lifting its rules/cache-library/orchestrator into a publishable `@longtermsupport` package requires the maintainer's explicit sign-off before Phase 3 code lift begins (not resolved by this research, flagged for Technical Decisions)
- Next: Phase 2 design work — targeted research to close the two genuine gaps, then formalize Part C's recommendations into concrete specs, then Opus review (Task 2.7)

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-07-10

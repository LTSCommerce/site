# Plan 011 (ts-qa-ci) — Pre-Kickoff Review

Reviewer: Opus pre-flight pass. Scope: find gaps, unstated assumptions, and scope
problems in `CLAUDE/Plan/011-ts-qa-ci-package/PLAN.md` **before** multi-agent
research/build time is spent. I have write access only to this file; the plan is
untouched. The orchestrator decides what to change.

**Headline:** the plan is well-structured and the philosophy is sound, but it has
one load-bearing blind spot that reshapes Phases 1–4: **a first-party, TS-native
reference implementation of almost exactly this package already exists in the same
workspace at `untracked/ec-site/`** (LongTermSupport org, 55 custom ESLint rules
with per-rule docs, a `bin/qa`-equivalent orchestrator, `eslint-plugin-tailwindcss`,
meta-rules, an ESLint auto-fixer skill, and — critically — the exact CDD rules and
the exact articles-HTML collision solution the plan proposes to invent from
scratch). Phase 1 currently points research **only** at `php-qa-ci` (PHP). Second:
several concrete assumptions about this repo (CI already gates lint/format/type;
articles are JSX; a variant-prop component catalogue exists to migrate to; the
package can be `npm link`-ed for a green CI PR without publishing) are **false or
unresolved**, and each one silently inflates or blocks a phase.

---

## MUST FIX before starting Phase 1 research

### 1. Phase 1 research scope omits the TS-native reference sitting in this workspace (`untracked/ec-site/`)

- **What's wrong:** Phase 1 (Tasks 1.1/1.2) extracts concepts only from `php-qa-ci`,
  a PHP/bash harness. But `untracked/ec-site/` is a React+TS+Vite+Tailwind site by
  the **same maintainer / same GitHub org** (`git@github.com:LongTermSupport/ec-site`)
  that has already built, in TypeScript, most of what this plan wants:
  - **55 custom ESLint rules** in `eslint-rules/*.js`, each with a paired `*.md`
    doc (agent assignment + fix prompts) — the exact "granularity of Plan 008's
    rule docs" the plan asks for in Task 3.3.
  - The **CDD rules already exist**: `no-html-in-pages.js` (bans raw HTML in page
    files, with a full component-replacement fix prompt), `enforce-width-standards.js`,
    `no-orphaned-grid-items.js`, `no-hard-coded-component-data.js`,
    `no-duplicate-section-ids.js`, plus `eslint-plugin-tailwindcss` for class control.
  - **`no-raw-block-html-in-articles.js`** is a working solution to the exact
    articles-HTML collision this plan raises (see Finding 4): it distinguishes
    prose HTML allowed inside an article-content component from block HTML
    (`<pre>`, `<table>`, `<div>`) that must become components.
  - A **TS-native `bin/qa` equivalent**: `scripts/llm-qa.ts`, `llm-lint.ts`,
    `llm-fix.ts`, `llm-type-check.ts`, `llm-format-check.ts`, `smoke-test-ssg.ts`,
    orchestrated by `npm run llm:qa`, with caching under `var/qa/` (same convention
    php-qa-ci uses). This is a concrete answer to Goal 3 (orchestrator design) and
    to most of Phase 2's tool-selection questions.
  - **meta-rules** (`no-async-handlers`, `require-documentation`, `validate-message-ids`)
    — rules that lint the rules; directly relevant to shipping a maintainable rule
    suite. `eslint-rules/CLAUDE.md` documents the "ESLint handlers MUST be
    synchronous / use execSync" gotcha that will otherwise be rediscovered painfully.
  - Full TS tool landscape already chosen: `cspell`, `size-limit`, `markdownlint`,
    Playwright smoke tests, an ESLint auto-fix skill.
- **Why it matters:** This is the single biggest efficiency and quality lever in the
  plan. Phase 1/2 as written will spend expensive agent time re-deriving, from a
  PHP reference, answers that already exist in idiomatic TypeScript next door — and
  will likely derive them *worse* (php-qa-ci cannot show you how to lint JSX or
  Tailwind). It also risks divergence from an existing LTS house style the
  maintainer clearly already uses.
- **Suggested fix:** Add `untracked/ec-site/` as a **first-class Phase 1 research
  target, researched in parallel with (arguably ahead of) php-qa-ci**, with an
  explicit split of responsibilities: mine **php-qa-ci** for the *orchestration &
  delivery philosophy* (phasing, fail-fast, read-only/CI-write duality, config
  cascade, encapsulation, rule-tiering SSoT) and mine **ec-site** for the
  *TS-native realisations* (which ESLint rules to lift, the CDD rules, the articles
  solution, the orchestrator script shape, the tool set, the meta-rules, the
  sync-handler gotcha). Add a Task 1.x: "Catalogue ec-site's 55 rules; classify
  each as lift-as-is / adapt / drop for ts-qa-ci." Update Goal 1 and Context &
  Background accordingly. Note the licensing/provenance question (ec-site is a
  private LTS repo; confirm the maintainer is happy for its rules to be relicensed
  into a package that may later be published — see Finding 12).

### 2. The plan's CI premise is false: this repo does NOT gate lint/format/type/test today

- **What's wrong:** Task 4.5 says ts-qa should "replace/consolidate the existing
  separate format/lint/typecheck/build steps," and Context cites `tsc` "as a build
  gate" plus CLAUDE.md's claim that Prettier auto-formats and "quality gates block
  deployment." The actual `.github/workflows/ci.yml` runs **only** `npm run build`
  (which does invoke `tsc`) followed by deploy. There is **no ESLint step, no
  Prettier step, no separate type-check, and no test run** anywhere in `.github/`
  (grep confirms). ESLint (with the 11 custom rules) and Vitest currently run
  **only locally/manually**; CLAUDE.md's description of CI is aspirational, not real.
- **Why it matters:** Two consequences. (a) There is nothing to "consolidate" —
  the real Phase 4 work is *adding* lint + format + test gates to CI for the first
  time, alongside build. (b) Dogfooding will surface far more than CDD violations:
  every currently-unenforced ESLint error, every Prettier drift, and every failing
  or absent test becomes a gate for the first time. The plan budgets for CDD volume
  (Risk row 2) but not for this baseline surface, so Phase 4 is under-scoped.
- **Suggested fix:** Correct the premise in Context and Task 4.5 ("add lint/format/
  test gates for the first time; keep the existing build+deploy"). Add a **Phase 0 /
  pre-Phase-4 baseline-sizing step** (can be done now, cheaply): run `npm run lint`,
  `npm run format:check`, and `npm run test:run` against this repo and record the
  raw failure counts in the plan. That number is the true dogfooding budget and
  should inform whether CDD rules start at `warn`. Also flag that CLAUDE.md's CI
  section needs correcting (out of scope to fix here, but note the drift).

### 3. "CI green on a real PR" (4.6) contradicts "not publishing" (Non-Goal) + `npm link` (4.1) — no install mechanism for CI is defined

- **What's wrong:** Task 4.1 installs ts-qa-ci via `npm link` / `file:` (local
  only). Task 4.6 requires CI green on a real PR. The Non-Goals forbid npm publish.
  GitHub Actions runs `npm ci` from the committed lockfile — a `npm link` or a
  `file:../untracked/repos/ts-qa-ci` path (the dir is gitignored) is **not
  reproducible in CI**. There is no defined way for CI to obtain the package.
- **Why it matters:** Task 4.6 is unachievable as specified; this is a hard blocker
  discovered only at the end of Phase 4 if not resolved now.
- **Suggested fix:** Decide the non-npm install mechanism up front and record it as
  a Technical Decision: a **git dependency** (`npm i -D github:LongTermSupport/ts-qa-ci#<ref>`
  or a git+ssh URL), **GitHub Packages** (npm registry scoped to the org, no public
  publish), or a **committed tarball**. This also means Task 3.6 (push to GitHub)
  becomes a real dependency of Task 4.6, not just housekeeping — sequence it before
  the CI PR. Note that a git dependency ships the repo's source, not a build
  artefact, so the package must run from source or commit its build output.

### 4. The CDD "ban raw HTML" rule collides with articles, AND the collision is worse than the plan states: article HTML lives in template-literal *strings*, invisible to AST/JSX rules

- **What's wrong:** The plan flags (correctly) that a blanket "ban raw HTML" rule
  may collide with `src/data/articles.ts`. Reality is sharper than "may": that file
  is **19,714 lines** containing **~7,180 raw block-level HTML tags** — and the HTML
  is **content inside a JavaScript template literal in a `.ts` data file**, not JSX.
  The existing `eslint.config.js` already special-cases `articles.ts` to switch off
  `use-types-not-strings` and `no-useless-escape` "because it holds raw article data
  including HTML content strings." An AST-based ESLint rule (which is what
  ec-site's `no-html-in-pages` / `no-raw-block-html-in-articles` are — they walk JSX
  nodes in `.tsx` files) **cannot even see** HTML inside a string literal. So the
  proposed CDD rule, as an ordinary ESLint JSX rule, will silently do nothing to the
  largest HTML surface in the repo.
- **Why it matters:** The success criterion "CDD ESLint tier … enforced with **zero
  violations** in this repo" is then either (a) trivially/dishonestly satisfied by
  exempting `articles.ts` (the biggest offender is simply invisible), or (b)
  impossibly expensive if you insist on policing string HTML (needs a bespoke
  string/template-literal linter, or migrating all articles to JSX/MDX — a different
  project entirely). The criterion is currently unbounded and ambiguous.
- **Suggested fix:** Resolve **before Phase 3** and preferably state as a Non-Goal:
  the CDD "no ad hoc HTML" rule targets **JSX in `.tsx` component/page files only**;
  HTML content inside `articles.ts` template literals is **explicitly out of scope**
  (the article-content system is a sanctioned string-HTML surface, exactly as
  ec-site treats article prose). Redefine the success criterion to "zero CDD
  violations in `src/pages/**` and `src/components/**` `.tsx` files, articles.ts
  content exempted." If policing article HTML is genuinely wanted, that is a
  separate, later, string-linter or MDX-migration plan — name it and defer it.

### 5. `no-ad-hoc-classnames` presupposes a variant-prop component catalogue that this repo does not have

- **What's wrong:** Goal 4 / Task 3.3 mandate banning arbitrary className strings
  "in favour of a component variant-prop API that internally maps variants to a
  fixed set of classes," and enforcing that variant API. But this repo has **no
  variant infrastructure**: `class-variance-authority` is not a dependency (0
  usages), there are only **17 component files**, and there are **~259 `className="…"`
  literals** and **~185 raw HTML JSX tags in `src/pages`**. ec-site can enforce
  `no-html-in-pages` because it has a large, catalogued, CVA/shadcn component library
  (`components.json`, `src/components/CLAUDE.md`) to redirect violators to. This repo
  does not. ec-site's own fix prompt says "if no suitable component exists, flag for
  manual review — DO NOT create ad-hoc components," which presupposes the catalogue
  already exists.
- **Why it matters:** A rule that bans className strings but offers no sanctioned
  variant-prop surface to move them to is **un-fixable** — every violation is a
  dead-end, and Phase 4 stalls exactly as Risk row 2 fears, but for a structural
  reason the mitigation ("fix incrementally / warn level") does not address. Building
  a variant-prop component system for this repo is a large body of work the plan
  neither scopes nor lists as a dependency.
- **Suggested fix:** Decide and state scope explicitly. Either (a) **descope**
  `no-ad-hoc-classnames`/variant-API enforcement from v1\*\* — ship the CDD tier as
  `no-ad-hoc-html` (JSX only) + Tailwind-class hygiene via `eslint-plugin-tailwindcss`
  (ordering/validation, which needs no catalogue), and defer variant-prop
  enforcement to a follow-on plan that first builds the component/variant library;
  or (b) **explicitly bring building the variant-prop component catalogue into this
  plan's Phase 4 scope** (much larger, and arguably its own plan). Whichever: add
  the corresponding Non-Goal or dependency. Do not leave "enforce the variant API"
  as a success criterion with no variant API in existence.

---

## CAN be resolved during Phase 1 / Phase 2 research

### 6. Re-frame the "no npm equivalent to PHIVE/PHAR" risk — the problem it solves largely doesn't exist in npm

- **What's wrong / why it matters:** The plan carries this as Medium/High risk and
  an open unknown. But PHIVE/PHAR/the `replace` trick / PhpStanGuardPlugin exist to
  solve **PHP-specific** problems: Composer's **flat** dependency graph (one version
  of a package globally, so a QA tool's deps conflict with the consumer's) and
  **autoloader pollution**. npm's model is **nested**: a devDependency's transitive
  tools resolve under the package's own subtree and do not fight the consumer's
  versions. So "one line in package.json, not forty" is *mostly solved by npm itself*
  — ship `@longtermsupport/ts-qa-ci` with eslint/prettier/vitest/tsc/plugins as its
  own `dependencies` and the consumer gets them transitively. The genuine, and
  smaller, npm questions are: which tools must be **peerDependencies** to match the
  consumer's version (`typescript`, the `eslint` the flat config loads, `vite`);
  ESLint **plugin resolution** from the consumer's config (flat config's explicit
  plugin *objects* already sidestep the old resolution problem — ec-site imports
  rule objects directly); and whether `bin` shims resolve the locally-installed tool
  binaries.
- **Suggested fix:** Downgrade the risk and rewrite it as a *concrete* Phase 2
  design question ("peerDeps vs bundled deps for tsc/eslint/vite; plugin delivery
  via exported flat-config objects"), not an existential unknown. This de-risks the
  framing and points research at the real, tractable decisions. ec-site already
  demonstrates the plugin-objects approach — use it as the reference.

### 7. Pre-commit the tool choices this repo + the CDD requirement already force; shrink Phase 2's open questions

- **What's wrong / why it matters:** Task 2.1 defers "Prettier vs Biome" and other
  choices to research. But two are effectively pre-decided: (a) **ESLint is
  mandatory**, not optional — the CDD tier is *custom JS-authored rules*, and Biome
  cannot run those (its plugin story is nascent GritQL, not JS rule modules). So
  "Prettier vs Biome" collapses to "keep ESLint (forced) + Prettier (existing), or
  add Biome purely as a formatter" — a minor, deferrable optimisation, not an
  architecture fork. (b) This repo already runs Prettier + ESLint flat + Vitest +
  Playwright + `tsc`; ec-site confirms the same stack is the LTS house choice.
- **Suggested fix:** In Phase 2, **pre-commit to ESLint (flat) + Prettier + tsc +
  Vitest + Playwright** as the baseline, matching both this repo and ec-site, and
  reduce the open research to genuinely open items (dependency-cruiser vs a custom
  ESLint import-boundary tier for the "arkitect analogue"; Stryker as the optional
  mutation tier; knip vs depcheck for dead-code/deps). This keeps Phase 2 focused
  and prevents a re-litigation of settled tooling.

### 8. Capture php-qa-ci's read-only/CI-write duality as a first-class concept, not a buried "autofix-then-gate" bullet

- **What's wrong / why it matters:** The single most load-bearing behaviour of
  php-qa-ci's Phase 1 is `qaReadOnly`/`detectReadOnly`: code-**mutating** tools
  (Rector, CS Fixer) run `--dry-run` in CI and **fail with remediation** instead of
  silently rewriting, but auto-apply locally. This governs the entire code-mod phase
  and maps cleanly to TS (Prettier `--check` vs `--write`; ESLint `--fix` vs not;
  ec-site's `llm:fix` "requires clean git status" is the same idea). Phase 1's task
  list only names "the autofix-then-gate pattern" under CI templates, understating it.
- **Suggested fix:** Add an explicit Phase 1 research bullet and a Phase 2/3 design
  requirement for a **read-only mode** that makes every mutating tool a verify-only
  gate in CI. Also capture the **interactive retry loop** (`tryAgainOrAbort`) as a
  local-DX concept to decide keep/drop.

### 9. Decide the auto-deploy-on-install story for Claude Code integration (npm has no clean composer-plugin equivalent)

- **What's wrong / why it matters:** php-qa-ci's `SkillsDeployPlugin` pushes
  `.claude/` config into the consumer on **every** `composer install/update`, with
  `PHP_QA_CI_DISABLE_CONFIG_PUSH` to opt out and an acknowledged "leaves the working
  tree dirty" problem. Task 3.4 / Goal 6 mention only a manual `deploy-skills`
  script and omit the auto-deploy dimension. npm's only analogue is a `postinstall`
  script, which is increasingly blocked (`--ignore-scripts`, corporate/CI policy),
  runs on every install, and would also dirty the tree. This repo already runs a
  hooks-daemon with its own `.claude/settings.json` policy (Task 4.7 must avoid
  conflicts).
- **Suggested fix:** In Phase 2, explicitly decide **manual-deploy only vs
  postinstall auto-deploy**, document the npm `postinstall` caveats, and design the
  opt-out flag + dirty-tree handling. Confirm the deploy script's `.claude/settings.json`
  edits are compatible with this repo's hooks-daemon `hook_registration_checker`
  policy (all hooks in `settings.json`, daemon-wrapper commands only).

### 10. Carry over php-qa-ci's "estate-wide checks can't be opt-in rules" lesson to the CDD delivery mechanism

- **What's wrong / why it matters:** php-qa-ci deliberately ships the
  SensitiveParameter *coverage* check as an **always-on pipeline tool**, not a
  PHPStan rule, precisely because "PHPStan rules are opt-in (a consumer must include
  them), so they can't be relied on estate-wide." The identical trap exists for
  ts-qa-ci: if the CDD rules are shipped as ESLint rules the consumer must add to
  *their* flat config, they are opt-in and can be silently dropped. If CDD must be
  guaranteed estate-wide, ts-qa must run its **own** ESLint config over the consumer
  (the orchestrator owns the config), not merely publish rules for the consumer to
  include. Phase 1's rule-tiering bullet captures the *authoring* half but not this
  *enforcement-delivery* half.
- **Suggested fix:** Add to Phase 2 design: decide whether ts-qa **owns and runs**
  the ESLint config (cascade with project overrides, php-qa-ci-style) so always-on
  tiers are truly always-on, vs shipping includable rule sets. This is the direct
  TS analogue of the arkitect/phpstan tier + "always-on pipeline tool" split.

### 11. Phases 3 and 4 are falsely sequential for the CDD rules — rule design is dogfood-driven

- **What's wrong / why it matters:** Phase 3 (build CDD rules) precedes Phase 4
  (run against this repo, fix violations), but Task 4.3 already admits "iterate with
  Phase 3 as needed." You cannot finalise `no-ad-hoc-html`/className semantics
  (scope, escape hatches, prose exemptions) without running them over this repo's
  real 185 JSX tags / 259 className literals and cribbing ec-site's already-tuned
  versions. Presenting them as ordered phases invites a "build it fully, then
  discover it's wrong" loop.
- **Suggested fix:** Reframe CDD rule authoring as an explicitly **iterative loop**
  spanning Phase 3↔4 from the start (prototype against this repo + adapt ec-site's
  rules early), rather than "implement in 3, apply in 4." Keep the phase headings
  but note the interleave, so agents don't treat 3.3 as a frozen deliverable before
  any real-code feedback.

---

## MINOR / optional polish

### 12. Provenance/licensing of lifted ec-site rules

ec-site is a private `LongTermSupport` repo; ts-qa-ci is intended to be publishable
(`@longtermsupport`). Lifting its rules into a package that may go public needs the
maintainer's explicit OK and a license note. One line in Technical Decisions.

### 13. Cross-platform posture

php-qa-ci is Linux/bash-only. A Node package is naturally cross-platform, but if the
`deploy-skills` script is authored in **bash** (as php-qa-ci's is), that reintroduces
a Linux dependency. State whether ts-qa-ci targets Linux CI only or must run on
Windows/macOS dev machines; prefer a Node-authored CLI over bash for portability.

### 14. `@edmondscommerce/feqa` prior art

Decision 2 rightly notes it. Given ec-site *is* the edmondscommerce codebase and the
richest reference here, the Phase 1 "look at feqa for reusable ideas" note should be
folded into the broader ec-site research task (Finding 1) rather than tracked
separately.

### 15. Task 3.6 (push to GitHub) ordering

Decision 1's own rationale is "iterate in `untracked/` first, push once solid."
Pushing before dogfooding stabilises the shape mildly contradicts that — but Finding
3 (CI needs an installable ref) pulls the other way. Reconcile: push when Phase 4
needs a CI-installable ref, not before, and not as a Phase 3 formality.

### 16. Missing Non-Goals to add explicitly

- Not migrating `articles.ts` HTML content to JSX/MDX/components (Finding 4).
- Not building a full variant-prop component library for this repo in v1, unless
  Finding 5(b) is chosen (then it's a Goal, not a Non-Goal).
- Not adopting Biome to replace ESLint (custom rules require ESLint; Finding 7).
- Not Windows-first (if Linux-CI-only is chosen; Finding 13).

---

## Refined kickoff brief (hand to the Phase 1 research lead)

> **Goal:** Produce a concept-extraction report to design `ts-qa-ci`, a single-
> devDependency TypeScript/React QA-CI harness (the TS analogue of `php-qa-ci`),
> dogfooded into this repo (`lts-commerce-site`) before any external rollout.
>
> **Research TWO references in parallel, not one:**
>
> 1. `untracked/repos/php-qa-ci` — mine for *orchestration & delivery philosophy*:
>    the 4-phase fail-fast pipeline, the read-only/CI-write duality (mutating tools
>    dry-run and fail in CI, auto-fix locally), the config cascade + per-tool
>    overrides, dependency encapsulation, the arkitect-vs-phpstan rule-tiering SSoT
>    ("never enforce one convention in two engines"), and the "estate-wide checks
>    must be pipeline-owned, not opt-in rules" lesson.
> 2. `untracked/ec-site` (LongTermSupport, React+TS+Vite+Tailwind) — mine for the
>    *TS-native realisations*: catalogue its **55 custom ESLint rules** (each with a
>    `.md` doc) and classify each as lift/adapt/drop; specifically capture its CDD
>    rules (`no-html-in-pages`, `no-raw-block-html-in-articles`, width/grid/class
>    rules, `eslint-plugin-tailwindcss`), its `bin/qa`-equivalent orchestrator
>    (`scripts/llm-*.ts`, `npm run llm:qa`, `var/qa/` caching), its meta-rules, and
>    the sync-ESLint-handler gotcha in `eslint-rules/CLAUDE.md`.
>
> **Hold these corrected facts about the dogfood target (this repo):**
>
> - CI today runs **only `npm run build` + deploy** — there is **no** ESLint,
>   Prettier, type-check, or test gate. Phase 4 *adds* gates; it does not consolidate
>   existing ones. Size the baseline first (`npm run lint`, `format:check`,
>   `test:run`) and record failure counts.
> - Article HTML lives as **~7,180 raw tags inside template-literal strings in the
>   19.7k-line `src/data/articles.ts`** — invisible to AST/JSX ESLint rules. The CDD
>   "no ad hoc HTML" rule targets **`.tsx` JSX only**; articles.ts content is out of
>   scope. Define the CDD success criterion against `src/pages/**` + `src/components/**`
>   `.tsx` only.
> - This repo has **no variant-prop / CVA component catalogue** (0 CVA usages, 17
>   components, ~259 className literals, ~185 raw JSX tags in pages). Decide up front
>   whether v1 ships variant-API enforcement (requires building that catalogue —
>   large) or descopes it to `no-ad-hoc-html` + Tailwind-class hygiene. Do not ship a
>   className ban with no sanctioned target to migrate to.
> - The package cannot be `npm publish`-ed in this plan, yet CI must go green on a
>   real PR. Pick a non-publish install mechanism (git dependency / GitHub Packages /
>   tarball) **before** wiring CI.
>
> **De-risk framing:** npm's nested dependency model means the PHIVE/PHAR
> encapsulation problem is *mostly a non-issue*; treat it as a concrete peerDeps-vs-
> bundled-deps + ESLint-plugin-delivery decision, not an existential unknown.
> ESLint is mandatory (custom rules); do not re-open ESLint-vs-Biome.
>
> **Deliverable:** a concept report that, for every extracted concept, states
> transfers-directly / needs-TS-adaptation / doesn't-apply, cites whether ec-site
> already implements it, and flags the five must-fix scope decisions above for the
> Opus review (Task 1.2) to confirm before design begins.

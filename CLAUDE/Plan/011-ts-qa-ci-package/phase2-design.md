# Plan 011 — Phase 2 Design: `ts-qa-ci` Architecture

**Task**: Plan 011 (`ts-qa-ci`), Tasks 2.1–2.6 concrete design spec, input to Task 2.7 (Opus review).
**Inputs**: [`phase1-concept-report.md`](phase1-concept-report.md) Part C (tool-selection reasoning already done there, not repeated); new Task 2.1-remainder and Task 2.6 research folded in below.
**Purpose**: turn Part C's prose recommendations into a spec a Phase 3 build agent can implement directly, without re-deriving decisions.

**Revision note (2026-07-10)**: this is the revised version after [`phase2-opus-review.md`](phase2-opus-review.md) (Task 2.7) returned NEEDS REVISION. The blocking finding (§2.4/§4 contradiction on how the always-on CDD tier is guaranteed) is fixed via a dedicated `resolveEslintConfig()` merge-not-replace resolver, distinct from the ordinary wholesale-replace config cascade every other tool uses. Four of five non-blocking findings are also resolved inline (testing-tool encapsulation, markdown external-link v1 scope, repo-visibility decision, table wording); the fifth (deploy payload vs Task 3.4) is correctly left for Phase 3.

---

## 1. Task 2.1 — Final tool stack

| Phase / Concern                                                        | Tool                                                                                         | Reasoning (one line)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Phase 1 — Code Modification: formatting                                | Prettier (`--write` / `--check`)                                                             | Pre-committed baseline; already used by this repo and ec-site.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Phase 1 — Code Modification: auto-fixable lint                         | ESLint (`--fix`)                                                                             | Pre-committed baseline; runs twice under the read-only duality (see §2).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Phase 2 — Lint/Validation: type-aware + structural lint                | ESLint flat config (report-only rules)                                                       | Pre-committed baseline; carries the CDD tier (§4) and core-tier rules.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Phase 2 — Lint/Validation: markdown link integrity                     | **remark-validate-links**                                                                    | Matches `LinksChecker.php`'s relative-file + anchor-resolution spec directly; maintained unifiedjs family; small programmatic entry point (`remark().use(remarkValidateLinks, opts).process(file)`). Pass `repository: false` explicitly — do not rely on `package.json` `repository`-field autodetection, which throws on SSH-form URLs. Does **not** check external `http(s)` links — explicitly out of v1 scope (resolved decision, see Open Risks item 2), not a gap.                                                                                                                                                                                                      |
| Phase 2 — Lint/Validation: dead code / unused deps / unused exports    | **knip**                                                                                     | depcheck is archived and its own README defers to knip; knip models unused files/exports via a real module graph, not just `package.json` deps; ships an official Vite plugin and exposes `typescript`/`@types/node` as peerDependencies, matching this project's own peerDep pattern (§3). Ship a default config with explicit multi-entry points (`vite.config.ts`, SSR entry, `scripts/*.mjs`) — see §7 risk.                                                                                                                                                                                                                                                               |
| Phase 3 — Static Analysis: type checking                               | `tsc --noEmit`                                                                               | Pre-committed baseline; non-mutating, runs unconditionally outside the read-only branch (per Part A.2).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Phase 3 — Static Analysis: structural/architecture (arkitect analogue) | **dependency-cruiser**, run as its own standalone phase-3 step (own CLI/Node API invocation) | Its rule model (forbidden/allowed edges, direction, cycles between path/folder patterns) matches PHPArkitect's "identity" register exactly (README A.6 framing); actively maintained; has a real programmatic API for orchestrator embedding. **Do not** integrate via `eslint-plugin-dependency-cruiser`: it re-cruises per linted file inside ESLint's single-file AST pass (slow at scale) and recreates the exact structural-check-inside-behavioural-engine anti-pattern the SSoT principle (A.6) exists to prevent. Also skip `eslint-plugin-boundaries` as a "native ESLint" alternative — solves the same wrong problem and lacks cycle detection/graph visualization. |
| Phase 4 — Testing: unit/component                                      | Vitest                                                                                       | Pre-committed baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Phase 4 — Testing: E2E                                                 | Playwright                                                                                   | Pre-committed baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Phase 4 — Testing: mutation (optional tier)                            | Stryker Mutator                                                                              | Mirrors Infection's optional-tier treatment (A.6 tiering pattern) — opt-in, not part of core always-on phases.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| CDD tier (cross-cutting, Phase 2)                                      | Custom ESLint rules (see §4)                                                                 | Custom JS-authored rules are why Biome is off the table (Non-Goal).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

Explicitly rejected/confirmed-out: depcheck (superseded by knip), markdown-link-check (weaker local-file/anchor coverage than remark-validate-links, HTTP-alive-check-first design mismatch), `eslint-plugin-dependency-cruiser` and `eslint-plugin-boundaries` (wrong integration point for the arkitect analogue), Biome-as-linter-replacement (Non-Goal, CDD needs custom rules).

---

## 2. Task 2.2 — Orchestrator CLI spec

### 2.1 Command-line interface

```
ts-qa                          # run full pipeline, all 4 phases, CI/read-only mode auto-detected
ts-qa -t <tool>                # single-tool bypass; skips phase grouping entirely
ts-qa -p <path>                # scope to a path; rejected for tools not in PATH_SUPPORTING_TOOLS
ts-qa --phase <1|2|3|4>        # run one phase only (all its tools, in tool order within the phase)
ts-qa --write                  # force writable mode regardless of CI detection (explicit override)
ts-qa --read-only              # force read-only mode regardless of CI detection (explicit override)
ts-qa --aggregate              # collect every failing tool instead of stopping at first (read-only runs only)
ts-qa --json                   # agent-facing: summary-to-stdout + full results to var/qa/<tool>/<hash>.<ts>.json
ts-qa deploy-skills            # Claude Code integration deploy (manual, see §5)
ts-qa init                     # scaffold tsQaConfig/ in the consumer project (hookPre.ts/hookPost.ts stubs, overrides dir)
```

Flags compose: `ts-qa -t eslint -p src/components --write` is valid; `ts-qa -t dependency-cruiser -p src/components` is rejected at parse time (dependency-cruiser's paths live in its own config, same as PHPArkitect — not in `PATH_SUPPORTING_TOOLS`).

### 2.2 Phase list and tool membership

| Phase | Name              | Tools (in run order)                                                                                           | Mutates? |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| 1     | Code Modification | Prettier (`--write`/`--check`), ESLint (`--fix`/`--fix-dry-run` pass — fixes what it can)                      | Yes      |
| 2     | Lint & Validation | ESLint (report-only pass over whatever `--fix` could not resolve, incl. CDD tier), remark-validate-links, knip | No       |
| 3     | Static Analysis   | `tsc --noEmit`, dependency-cruiser                                                                             | No       |
| 4     | Testing           | Vitest, Playwright, (opt-in: Stryker)                                                                          | No       |

Rationale for ESLint appearing in both Phase 1 and Phase 2 (not a single invocation): mirrors A.2's finding that ESLint mixes auto-fixable and report-only rules within one config, unlike PHP CS Fixer/PHPStan's strict tool separation. `ts-qa` resolves this explicitly by running ESLint **twice**: once in Phase 1 under the write/read-only gate (`--fix` locally, `--fix-dry-run` + diff-check in CI), once in Phase 2 as a pure report pass over whatever `--fix` could not resolve. This is a deliberate, named design choice — not an accident of phase reuse.

### 2.3 Module boundaries (Phase 3 build target)

```
bin/ts-qa.js                    # CLI entry, arg parsing, delegates to orchestrator
src/orchestrator/
  runPipeline.ts                 # top-level phase-ladder driver (mutate → lint → analyse → test)
  runPhase.ts                    # runs one phase's tool list in order, fail-fast unless --aggregate
  runTool.ts                     # single-tool dispatch: resolveToolModule() -> invoke -> classify exit code
  resolveToolModule.ts           # tool-resolution cascade (§2.4, tier 1/2/3), dynamic import()
  resolveConfigPath.ts           # config-file cascade (§2.4), fs.existsSync probes — first-match-wins, wholesale replace
  resolveEslintConfig.ts         # DEDICATED merge-not-replace resolver (§2.4 exception, §4) — Tier A core always spread first, project file can only add
  detectReadOnly.ts               # the CI/qaReadOnly duality (§2.5)
  detectPlatform.ts               # generic | vite | (future) nextjs, via package.json deps + config-file presence
  retryGate.ts                    # CI-vs-interactive retry loop (§2.6) + crash-vs-failure exit classification
  hooks.ts                        # dynamic import of tsQaConfig/hookPre.ts / hookPost.ts, invoked with typed context
  cache.ts                        # var/qa/ caching (lifted near-verbatim from ec-site's scripts/lib/cache.ts per B.3)
src/tools/
  prettier.ts, eslintFix.ts, eslintReport.ts, tsc.ts, dependencyCruiser.ts,
  knip.ts, remarkValidateLinks.ts, vitest.ts, playwright.ts, stryker.ts
  # each exports: { name, phase, mutates: boolean, pathSupporting: boolean, run(ctx): ToolResult }
configDefaults/
  generic/{eslint.config.js, prettier.config.js, dependency-cruiser.config.cjs, knip.json, ...}
  vite/{...}                      # currently empty except overrides that differ from generic (mirrors php-qa-ci's actually-thin platform tier — don't pre-populate speculatively)
```

`ToolResult` is the common shape every `src/tools/*.ts` module returns: `{ exitClass: 'clean' | 'failure' | 'crash', stdout, stderr, diffPending?: boolean }`. `runTool.ts` is the only place that interprets exit codes into this shape — no tool module talks to the retry gate or CI detection directly.

### 2.4 Config cascade resolution algorithm

Two independent resolvers, both first-match-wins, no merging (per A.4's finding that php-qa-ci deliberately does not merge cascade tiers) — **with one deliberate, named exception for `eslint.config.js` specifically**, because ESLint carries the CDD/core always-on tier and file-cascade semantics would silently defeat that guarantee (see the callout immediately below and §4's resolved contradiction):

```
resolveConfigPath(fileName):
  1. if exists({project}/tsQaConfig/{fileName})              -> return it   # project override
  2. if exists(configDefaults/{detectedPlatform}/{fileName})  -> return it   # platform default (vite/, currently thin)
  3. return configDefaults/generic/{fileName}                                # generic fallback (must always exist)

resolveToolModule(toolName):
  1. if exists({project}/tsQaConfig/tools/{toolName}.ts)      -> dynamic import() it   # full tool replacement
  2. if exists(src/tools/{detectedPlatform}/{toolName}.ts)     -> dynamic import() it   # platform-specific tool impl
  3. return dynamic import(src/tools/{toolName}.ts)                                     # generic tool impl
```

**Exception — `eslint.config.js` does NOT go through `resolveConfigPath`'s wholesale first-match-wins semantics.** Every other config file (Prettier, dependency-cruiser, knip, etc.) is a legitimate full-replacement candidate — a project genuinely may want its own complete Prettier config. ESLint is different because it is the delivery mechanism for the Tier A always-on core/CDD rules (§4): if `tsQaConfig/eslint.config.js` were resolved and returned wholesale like any other file, a consumer could silently drop the entire core tier by supplying their own config, which is exactly the "opt-in rules can't be relied on estate-wide" failure Task 2.4 exists to prevent. So ESLint config resolution uses a **third, dedicated function**, not `resolveConfigPath`:

```
resolveEslintConfig(): FlatConfigArray
  base = import(configDefaults/{generic|vite}/eslint.config.js)   # Tier A core, always spread first
  if exists({project}/tsQaConfig/eslint.config.js):
    projectAdditions = import({project}/tsQaConfig/eslint.config.js)
    return [...base, ...projectAdditions]        # MERGE — project file can only ADD, never replace
  return base
```

A project's `tsQaConfig/eslint.config.js` may add rules, add overrides for its own paths, or apply the documented narrow opt-out (`tsQaConfig/cdd-exclusions.json` globs or `TSQA_DISABLE_CDD=1`, per §4) — it is never given the chance to replace `base` outright. This is the one place in the whole cascade where merge-not-replace is the deliberate, load-bearing rule, and it exists specifically because ESLint (unlike every other tool in this table) carries an estate-wide guarantee, not just a formatting preference.

`detectPlatform()`: checks `vite.config.{ts,js,mjs}` presence + `vite` in `package.json` dependencies → `'vite'`; else `'generic'`. (Next.js detection is architecturally reserved — `next.config.*` presence — but not implemented in v1, per Non-Goals.)

Scalar/array config values (e.g. banned-classname lists, path globs) use an explicit merge, not the bash `${var:-default}` pattern php-qa-ci uses (A.4 flags that pattern as a footgun where project config unconditionally clobbers a pre-exported env var):

```
finalConfig = { ...builtinDefaults, ...projectConfigFile, ...envOverrides }
```

Precedence, highest wins: env var override > `tsQaConfig/*.json`/`.ts` project file > built-in default. This is a **deliberately different precedence rule** from the file-cascade above (which is first-match-wins over three *file locations*, not a value merge) — the two resolvers solve different problems (which file object to use vs. which scalar value to use) and should not be collapsed into one function.

### 2.5 Read-only / CI-write duality — concrete env vars

Two independent booleans, set by different signals, kept orthogonal (directly ported from A.2's `CI`/`qaReadOnly` split):

| Variable                            | Question                                                   | Resolution order (first match wins)                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TSQA_CI` (internal, derived)       | May I prompt interactively / retry in a loop?              | 1. `process.env.CI === 'true'` (explicit) → true. 2. `process.env.CLAUDECODE === '1'` → true (log "Claude Code environment detected — enabling CI mode"). 3. `!process.stdin.isTTY \|\| !process.stdout.isTTY` → true. 4. else → false.                                                                                                             |
| `TSQA_READONLY` (internal, derived) | May mutating tools (Prettier, ESLint `--fix`) write files? | 1. `process.env.TSQA_READONLY` explicit override (`'1'`/`'0'`) → use it verbatim. 2. `process.env.GITHUB_ACTIONS === 'true'` → true. 3. else → false. **`CLAUDECODE`/non-TTY is deliberately NOT in this list** — matches php-qa-ci's finding that a Claude Code session should stay writable even though it also forces CI-mode retry suppression. |

CLI flags `--write`/`--read-only` set `TSQA_READONLY` directly, overriding the env-derived value (equivalent to `QA_READONLY=0`/`1` in php-qa-ci). Resulting regimes (identical table shape to A.2, ported 1:1):

| Context                   | `TSQA_CI` | `TSQA_READONLY` | Behaviour                                                                                                         |
| ------------------------- | --------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| GitHub Actions            | true      | true            | Single dry-run pass (`--check`/`--fix-dry-run`); pending diff **fails the gate** with remediation text; no retry. |
| Claude Code session       | true      | false           | Writable — applies changes directly; `TSQA_CI` only suppresses the interactive retry prompt.                      |
| Real interactive terminal | false     | false           | Writable **and** interactive — prompts `(y/n)` to retry on failure.                                               |

This gate is applied **uniformly to every mutating tool from the start** (Prettier, ESLint `--fix` pass) via one shared `runTool.ts` code path — not retrofitted tool-by-tool, correcting the specific gap A.2 found in php-qa-ci's own `phpStrictTypes.inc.bash`.

Per-tool exit-code contract (`runTool.ts`'s `exitClass` classification, empirically verified per tool before shipping — do not assume, per A.2's "(verified)" comment discipline):

- Prettier: `--check` exit 0 = clean, exit 1 = pending diff (no separate crash code — a parse error also exits 1; disambiguate via stdout pattern-match, same fallback shape as PHP CS Fixer's `"Files that were not fixed due to errors"` grep in A.2).
- ESLint: exit 0 = clean, exit 1 = problems found (failure, retryable), exit 2 = fatal config/crash (never retry).
- `tsc --noEmit`: exit 0 = clean, exit 1 (or any nonzero) = failure; non-mutating, always runs outside the `TSQA_READONLY` branch.
- dependency-cruiser / knip / remark-validate-links: exit 0 = clean, nonzero = failure; all non-mutating, always run outside the `TSQA_READONLY` branch.

### 2.6 CI-vs-interactive retry gate

```
retryGate(tool, ctx):
  result = runTool(tool, ctx)
  if result.exitClass == 'clean': return result
  if result.exitClass == 'crash': abort(result)          # never retry a crash
  # result.exitClass == 'failure'
  if ctx.TSQA_CI:
    abort(result)                                          # CI: fail-fast unless --aggregate, no prompt
  else:
    if prompt(`${tool.name} failed. Try again? (y/n)`) == 'y':
      ctx.hasBeenRestarted = true
      return retryGate(tool, ctx)                           # loop
    else:
      abort(result)
```

`--aggregate` (read-only runs only, rejected at parse time if combined with `--write`): collects every phase's failing tools into one report instead of aborting at the first, matching A.1's fail-fast/aggregate axis. `hasBeenRestarted` drives an end-of-run warning ported verbatim from A.1: *"RAN WITH RETRIES — re-run the whole pipeline to be sure everything is fine,"* because a retried tool doesn't re-validate phases that already passed before the fix.

### 2.7 Locking and hooks

One global lock per invocation (not per-phase), same as A.1. `tsQaConfig/hookPre.ts`/`hookPost.ts` (if present) are dynamically imported and invoked with a typed `HookContext` (phase list, detected platform, TSQA_CI/TSQA_READONLY, tool results so far); pre-hook runs after config resolution but before any tool executes, post-hook runs only after every phase succeeds (unreached on any upstream failure — pipeline is fail-fast by default).

---

## 3. Task 2.3 — Dependency encapsulation table

| Package                                                      | Type                                                          | Reasoning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript`                                                 | **peerDependency**                                            | Must be the exact same instance the consumer's own code compiles against — a nested TS instance produces version-mismatched diagnostics (A.3).                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `eslint`                                                     | **peerDependency**                                            | Custom rule/plugin APIs are version-specific; a nested ESLint would fight the consumer's own binary/config resolution (A.3).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `vite`                                                       | **peerDependency**                                            | Only if `ts-qa-ci` ships Vite plugins (e.g. wiring knip's Vite plugin) — must match the consumer's own Vite instance (A.3).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `@types/node`                                                | **peerDependency**                                            | Same reasoning as `typescript` — knip itself requires this pattern (Task 2.1 research); avoids a second, possibly conflicting Node type instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `knip`                                                       | **bundled dependency**                                        | Runs as an independent subprocess/CLI invocation; no runtime coupling to consumer's module graph beyond the peerDep'd `typescript`/`@types/node` it itself declares.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `remark-validate-links` (+ `remark`, `unified` transitively) | **bundled dependency**                                        | Self-contained programmatic call (`remark().use(...).process(file)`); no consumer-version coupling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `dependency-cruiser`                                         | **bundled dependency**                                        | Own CLI/Node API, invoked as an independent phase-3 step; no shared-instance requirement with consumer code.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `prettier`                                                   | **bundled dependency**                                        | Runs as an independent formatter subprocess; version pinned by `ts-qa-ci` for reproducibility (no consumer coupling — Prettier output doesn't need to match a "consumer's own Prettier instance" the way ESLint rule APIs do). Consider peerDep only if consumers commonly want to override; default to bundled per the simpler-guarantee-first principle.                                                                                                                                                                                                                                                     |
| `vitest`, `@playwright/test`, `@stryker-mutator/core`        | **peerDependency**                                            | Resolved (was left open pending Phase 3 in an earlier draft): `ts-qa-ci` **orchestrates** the consumer's own configured test setup rather than shipping a default one — this repo already has `vitest.config.ts`, and forcing a bundled/shadow Vitest instance to coexist with it would risk exactly the dual-instance version-mismatch problem `typescript`/`eslint` are peerDep'd to avoid (§ above). `ts-qa`'s Phase 4 test runners (`src/tools/vitest.ts`, `playwright.ts`) invoke the consumer's own installed binary/config, the same relationship `tsc --noEmit` has to the consumer's `tsconfig.json`. |
| `eslint-config-prettier` (or flat-config equivalent)         | **bundled dependency**                                        | Needed to resolve the Prettier/ESLint rule-jurisdiction overlap A.2 flags as having no PHP-side precedent; ships as part of `ts-qa-ci`'s own default ESLint config.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ts-qa-ci's own CDD rule modules                              | **not a package at all — plain exported flat-config objects** | ESLint flat config already solves plugin delivery natively (a "plugin" is just an object with a `rules` map); no `eslint-plugin-ts-qa-ci`-named package or legacy plugin-name resolution needed (A.3, proven by ec-site's `eslint.config.js` pattern).                                                                                                                                                                                                                                                                                                                                                         |

General rule for Phase 3: **peerDependency whenever the tool participates in the consumer's own module/type graph or must be a single shared instance; bundled dependency whenever the tool runs as an independent, self-contained subprocess check with no runtime coupling.** No PHIVE/PHAR-style vendoring layer is needed — npm's nested dependency model + lockfile integrity hashes already solve the "reproducible tool version" goal natively (A.3, DOESNT-APPLY as "needs a PHIVE-equivalent").

---

## 4. Task 2.4 — CDD tier delivery mechanism

**Decision**: `ts-qa` **owns and runs its own ESLint config over the consumer**, not merely publishes includable rule objects the consumer must remember to spread in. Mechanism: `ts-qa`'s ESLint invocation (both the Phase 1 `--fix` pass and the Phase 2 report pass) runs against `resolveEslintConfig()`'s output (§2.4's dedicated merge-not-replace resolver, not the generic `resolveConfigPath` wholesale cascade every other tool uses) — the Tier A core is spread first and unconditionally; a consumer's `tsQaConfig/eslint.config.js` can only *add* to it, never replace it. This is the direct analogue of php-qa-ci moving SensitiveParameter coverage out of an opt-in PHPStan rule into an always-on pipeline tool ("opt-in rules… cannot be relied on estate-wide," A.6) — and, critically, it is a *stronger* guarantee than a naive port of php-qa-ci's own file-cascade pattern would give: php-qa-ci doesn't have this problem because Composer config files aren't also the delivery mechanism for an always-on rule tier, so its ordinary first-match-wins cascade never has to be broken here.

**Escape hatch is opt-out, not opt-in** — a scoped path-glob exclusion (`tsQaConfig/cdd-exclusions.json`: array of globs) or a rare blanket `TSQA_DISABLE_CDD=1`, mirroring `useSensitiveParameterCheck=0`/`useArkitect=0`'s asymmetry. Every `ts-qa` run **logs the opt-out instructions**, even when not used, mirroring `PHP_QA_CI_DISABLE_CONFIG_PUSH`'s proactive-discovery UX (A.5).

### 4.1 Rule-to-tier assignment

**Tier A — Core, always-on, pipeline-owned (cannot be opted into or out of file-by-file, only via the scoped exclusion mechanism above):**

| Rule                                                                                            | Source / verdict                                                                                  | Scope                                                                                                                 |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `no-eslint-disable`                                                                             | ec-site `no-eslint-disable.js`, lift-as-is (B.1 #11) — three independent cross-project precedents | repo-wide                                                                                                             |
| `no-duplicate-section-ids`                                                                      | ec-site lift-as-is (B.1 #9)                                                                       | `.tsx` JSX                                                                                                            |
| `no-placeholder`                                                                                | ec-site lift-as-is (B.1 #22)                                                                      | string/template literals, repo-wide incl. `articles.ts`                                                               |
| `require-explicit-type-annotations`                                                             | ec-site lift-as-is (B.1 #35)                                                                      | `const` data literals                                                                                                 |
| `require-exported-component-types`                                                              | ec-site lift-as-is (B.1 #36)                                                                      | `src/components/**`                                                                                                   |
| `ssr-safe-hooks` (union of `ssr-safe-hooks.js` + `no-browser-globals-in-render.js`, B.1 #7/#43) | ec-site lift/adapt — this repo is also SSG (Vite SSR + prerender)                                 | `.tsx` render code                                                                                                    |
| `validate-lazy-imports`                                                                         | ec-site lift-as-is (B.1 #49)                                                                      | `React.lazy()` call sites                                                                                             |
| meta-rules (`no-async-handlers`, `require-documentation`, `validate-message-ids`)               | ec-site lift-as-is (B.4)                                                                          | `ts-qa-ci`'s own `eslint-rules/*.js` only, not consumer code — these lint the rule authoring surface itself           |
| **`no-ad-hoc-html`** (CDD flagship)                                                             | Adapted from `no-html-in-pages.js` (B.1 #17, B.2)                                                 | `.tsx` under `src/pages/**` **and** `src/components/**` (widened scope per B.2 — ec-site's version only covers pages) |

**Tier B — Opt-in CDD (variant-shape / styling-surface rules, presuppose a variant-prop catalogue a consumer may not have adopted yet — direct analogue of `rules-optional-symfony.neon`):**

| Rule                                                          | Source / verdict                                                                                                                                 | Notes                                                                                                                                                                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-ad-hoc-classnames`                                        | New rule; pattern-referenced from `enforce-width-standards.js` (B.1 #5, B.2) + broadened `eslint-plugin-tailwindcss` `no-custom-classname` scope | Presupposes the CVA + `tailwind-merge` + `clsx` catalogue (Decision 4/Task 4.5) exists; enabling before that catalogue exists would just fail everywhere with no fix path — must ship opt-in until a consumer confirms the catalogue is in place. |
| Variant-API enforcement (typed variant props, exhaustiveness) | Authored from scratch, informed by `no-hard-coded-component-data.js`'s heuristic-classifier technique (B.1 #14, B.2)                             | Ships `recommended: false` even once built — ec-site keeps its closest analogue opt-in/warn-tier because the heuristics are inherently fuzzy; carry that caution over.                                                                            |

**Tier C — Opt-in framework/project-specific (not React/Vite-universal, or presuppose a convention not every consumer has):**

| Rule                                                                                     | Source / verdict                                    | Notes                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enforce-tel-links`                                                                      | ec-site adapt (B.1 #4)                              | UK-specific defaults; opt-in "marketing site" tier                                                                                                                                                         |
| `no-router-link-hash`                                                                    | ec-site adapt (B.1 #25)                             | react-router-dom specific                                                                                                                                                                                  |
| `no-window-location` (b): `rel="noopener noreferrer"` half                               | ec-site adapt/split (B.1 #30)                       | Framework-agnostic security best practice — candidate to **promote to Tier A** once split from concern (a); flagged for Phase 3 to confirm.                                                                |
| `no-window-location` (a): navigation-via-`window.location` half                          | ec-site adapt/split (B.1 #30)                       | react-router-specific, stays Tier C                                                                                                                                                                        |
| `no-hardcoded-routes`                                                                    | ec-site adapt (B.1 #16)                             | Presupposes a typed `ROUTES` object (this repo has one — `src/routes.ts` — but not every consumer will); dynamic-load pattern (`execSync` loading the real `ROUTES` export) required, not a static fix map |
| `no-string-link-props` + `no-string-route-properties` (merge into one configurable rule) | ec-site adapt (B.1 #27/#28)                         | Presupposes typed route/link types                                                                                                                                                                         |
| `no-unescaped-quotes-in-meta`                                                            | ec-site adapt (B.1 #29)                             | Presupposes an SEO `seo` export convention (configurable name/property list)                                                                                                                               |
| `require-page-seo-export` + `validate-seo-metadata` (paired opt-in "SEO metadata" tier)  | ec-site adapt (B.1 #40/#52)                         | File-suffix/type-name/pages-root must be configurable; derive length limits from one real source, not a hardcoded duplicate (B.1 #52's flagged anti-pattern)                                               |
| `require-tests-in-page-folders`                                                          | ec-site adapt (B.1 #42)                             | `pagesDir`/`testsDir` roots configurable                                                                                                                                                                   |
| `validate-hash-links`, `validate-internal-links`                                         | ec-site adapt (B.1 #46/#48)                         | Presuppose a routes table to cross-check against                                                                                                                                                           |
| `prefer-satisfies-over-as-const`                                                         | ec-site adapt (B.1 #31)                             | Needs config-driven property→type mapping — never ship as a blind global auto-fix                                                                                                                          |
| `no-children-on-prop-only-components`                                                    | ec-site adapt, rebuilt (B.1 #8)                     | Build the real type-aware version via `@typescript-eslint` parser services — the shipped ec-site `.js` uses a hardcoded fallback list despite its doc's claim; don't port that                             |
| `use-types-not-strings` (rename to `no-stringly-typed-props`)                            | ec-site adapt, mechanism only (B.1 #44)             | Strip the 176-entry ec-site business-vocabulary whitelist; ship the type-aware mechanism as config-driven                                                                                                  |
| `no-expandable-details-in-p` (generalise to "no known block component inside `<p>`")     | ec-site adapt (B.1 #12)                             | Target component names become config-supplied list                                                                                                                                                         |
| `validate-routes-have-pages`                                                             | ec-site adapt, **must be hardened first** (B.1 #51) | Currently uses `eval()` on extracted source — replace with AST-based extraction before shipping in any tier; do not ship the `eval()` version even opt-in                                                  |

**Explicitly dropped, no port** (B.1 verdict = drop / DOESNT-APPLY, all business/brand-specific with no reusable core): `enforce-contact-link-whitelist`, `enforce-dynamic-data-sources`, `enforce-external-link-whitelist`, `no-aside-after-expandable-details`, `no-empty-highlight-text`, `no-json-content-type-for-apps-script`, `no-orphaned-grid-items` (keep only its suppression-comment governance phrasing, reused verbatim in the CDD docs), `no-external-links-in-pages`, `no-route-comments`, `no-stacked-expandables`, `require-component-in-design-guidelines`, `require-documented-component-exists`, `require-layout-variant-for-carousels`, `require-llm-npm-commands` (superseded by `ts-qa`'s own structured/agent-parseable output, §2), `require-page-layout-wrapper`, `require-sitemap-page-sync`, `validate-case-studies-index`, `validate-hover-text`, `validate-research-index-completeness`, `validate-simple-icons` (keep the load-and-validate-real-exports mechanism as a template, not the instance), `validate-tech-logos`. `no-raw-block-html-in-articles` mechanism is DOESNT-APPLY (this repo's articles are template-literal strings, not JSX) — its governing principle is already encoded structurally by Decision 3's exemption, not by a ported rule.

**Blocking precondition** (Decision 5 / B.5): none of the above ec-site-sourced rules may be lifted into `ts-qa-ci` until the maintainer's explicit sign-off is obtained (Task 3.0 gate) — this design assigns tiers in advance so Phase 3 can move immediately once sign-off lands, but the assignment itself is not authorization to copy code.

---

## 5. Task 2.5 — Claude Code deploy mechanism

**Decision**: manual deploy script only for v1 — `npx ts-qa-ci deploy-skills` (or `ts-qa deploy-skills` once installed), **Node-authored** (per Non-Goals' cross-platform requirement). No `postinstall` auto-deploy. Rationale (A.5): npm's nearest auto-deploy primitive, `postinstall`, is materially weaker than Composer's plugin model — `--ignore-scripts` silently skips it with no logged feedback, and `pnpm` blocks all lifecycle scripts by default since v7. A growing corporate/CI trend toward blanket `--ignore-scripts` policies makes this an unreliable default-on mechanism; manual invocation with clear docs is the safer v1 default. If auto-deploy is ever added later, it needs the identical opt-out-env-var-plus-logged-instructions UX as `PHP_QA_CI_DISABLE_CONFIG_PUSH`, understood as best-effort given `--ignore-scripts`/pnpm defaults can bypass it regardless.

### 5.1 What the script does

1. Copies `skills/*`, `agents/*.md` from `ts-qa-ci`'s own package into the consumer's `.claude/skills/`, `.claude/agents/` (full-directory replace with clobber protection, matching `deploy-skills.bash`'s approach).
2. **Does NOT write classic `.claude/hooks/*.py` files.** This repo (and any hooks-daemon consumer) runs the daemon exclusively — writing classic hook files would either be invisible to the daemon or double-fire. Instead:
3. **Registers as project-handlers**, not classic hooks: writes/updates files under `.claude/project-handlers/` following the daemon's project-handler class contract (per the `project_handler_load_checker` policy already active in this repo — each handler class must implement whatever methods the running daemon version requires, e.g. `get_claude_md`). This is the direct migration precedent A.5 documents: `deploy-skills.bash` itself actively **removes** classic hook files and their `settings.json` entries when a hooks-daemon is detected, on the theory the daemon now provides that functionality.
4. Detects hooks-daemon presence by checking for `.claude/hooks-daemon.yaml` and/or `.claude/skills/hooks-daemon/` — if absent, falls back to writing classic `.claude/hooks/*.py` files + merging `settings.json` entries (idempotent byte-diff-before-write merge, matching `deploy-skills.bash`'s approach) for non-daemon consumers.
5. **Must not write anything to `settings.local.json`** — per this repo's own `hook_registration_checker` policy, all hooks live in `settings.json` only; the deploy script writes exclusively to `settings.json` and `.claude/project-handlers/`.
6. Every registered hook command must end with `/.claude/hooks/{event}` (the daemon wrapper), never inline logic — the deploy script emits wrapper-invoking entries only, consistent with the daemon's "legacy-style commands bypass the daemon" policy.
7. `TSQA_DISABLE_DEPLOY` opt-out env var (checked first, accepts truthy strings `true`/`1`/`yes`/`on`), logged on every run whether or not it's set — mirrors `PHP_QA_CI_DISABLE_CONFIG_PUSH`'s proactive-discovery UX.
8. Idempotent: re-running produces no diff if nothing changed (byte-compare before write, matching `deploy-skills.bash`).

### 5.2 Verification (Task 4.8)

After deploying into this repo: confirm `.claude/settings.local.json` has zero `hooks` entries (policy compliance), confirm any deployed hook commands route through `/.claude/hooks/{event}`, and run `$PYTHON -m claude_code_hooks_daemon.daemon.cli validate-project-handlers` to confirm the new project-handler(s) load cleanly under the running daemon version before considering Task 4.8 complete.

---

## 6. Task 2.6 — CI install mechanism

**Decision**: git dependency pinned to a commit SHA, with `ts-qa-ci` committing its built `dist/` into its own repo (not gitignored — an explicit, documented exception to this repo's own dist/-is-generated convention, scoped to `ts-qa-ci`'s repo only). Do not rely on npm's `prepare` lifecycle script firing during git-dependency install (documented flakiness across multiple npm/cli issues going back to npm@5).

**Precondition, resolved**: `LongTermSupport/ts-qa-ci` will be a **public** GitHub repo (recorded as the plan's own Decision 6, `PLAN.md`). Nothing in the plan's Non-Goals objects to the source being public (only *npm-registry publication* is deferred); a private repo would reintroduce the same cross-repo-`GITHUB_TOKEN` friction documented for GitHub Packages, for zero confidentiality benefit (ec-site-derived code is already gated separately by the Task 3.0 sign-off).

### 6.1 Exact mechanism

`lts-commerce-site`'s `package.json`:

```json
"devDependencies": {
  "@longtermsupport/ts-qa-ci": "github:LongTermSupport/ts-qa-ci#<commit-sha>"
}
```

(equivalently `"git+https://github.com/LongTermSupport/ts-qa-ci.git#<commit-sha>"` — either syntax is npm-native; prefer the shorter `github:` form). Always pin to a **commit SHA**, never a branch ref — mutable branch refs are unpinned and unreviewable, and are also the specific case with the documented npm prepare-resolution bug (moot here since prepare isn't relied on, but reinforces SHA-pinning regardless).

`ts-qa-ci`'s own `package.json`: `main`/`exports`/`bin` point into `dist/`; `dist/` is committed (not gitignored) so a git-dependency install is "clone repo at SHA, no build required" — the flaky lifecycle-script trigger is removed from the critical path entirely.

`npm ci` support: confirmed for git dependencies (this repo's npm 11.16 is well past the v7 baseline). `package-lock.json` records `resolved` (git URL + resolved commit) and `integrity`; `npm ci` verifies against it like a registry dependency — no special CI configuration needed beyond the repo being publicly clonable.

**Update workflow** (for the eventual runbook): bumping the pinned SHA requires `npm install` (not `npm ci`) locally in `lts-commerce-site` to regenerate the lockfile's `resolved`/`integrity` fields for the new commit, then commit that lockfile change — same shape as any ordinary dependency bump.

**Trap to flag for whoever scaffolds `ts-qa-ci`** (Task 3.1): peerDependencies (`typescript`, `eslint`, `@types/node` — §3) are **not** installed into the isolated `node_modules` npm builds while running a git dependency's own install. If anyone falls back to a prepare-script build despite this recommendation, `tsc` would not be on the path. This is a second, independent reason (beyond flakiness) to avoid the prepare-script route — it's another reinforcement to commit `dist/` directly.

**Fallback if repo visibility can't be resolved before Task 4.6's deadline**: committed tarball via `file:` (`npm pack` output committed into `lts-commerce-site`'s own repo, referenced as `"file:vendor/longtermsupport-ts-qa-ci-<version>.tgz"`). Zero network/auth/registry setup, build-step question moot by construction (`npm pack` always packs built output). Treat as a **temporary stopgap only** — it doesn't exercise `ts-qa-ci` as a real installable external dependency (weaker validation of "is this package actually consumable," cutting against the plan's own dogfooding intent) and requires manual re-`npm pack`-and-recommit on every `ts-qa-ci` change with nothing enforcing sync.

**Not GitHub Packages for v1**: cross-repo `GITHUB_TOKEN` package-read access does not work out of the box (scoped to packages published from the *same* repo the workflow runs in) — would require internal-visibility, explicit consumer-repo access grant, or a PAT secret, all extra one-time setup beyond the git-dependency route for no reproducibility gain while `lts-commerce-site` is the only consumer. Revisit once `ts-qa-ci` has multiple real consumers.

---

## 7. Open risks / uncertainties

Flagged honestly, not papered over:

1. ~~`LongTermSupport/ts-qa-ci` public-vs-private is still an open decision, not yet made.~~ **Resolved**: public (Decision 6, `PLAN.md`) — §6's git-dependency mechanism is unblocked on this basis.
2. ~~External-HTTP markdown-link checking has no chosen tool.~~ **Resolved**: external `http(s)` link checking is explicitly **out of v1 scope**. `remark-validate-links` covers the relative-file + anchor-resolution half of `mdlinks`' spec, which is the higher-value, lower-flakiness check (no network calls, no rate-limiting, no GitHub-token dependency in CI). Full parity with `mdlinks`' external-link validation would need a second tool (`remark-lint-no-dead-urls` is the concrete candidate if this is ever wanted) — named here explicitly as a deferred v2 addition, not left as an unowned TODO. Task 2.1 is closed on this basis: relative/anchor-only markdown-link checking for v1.
3. **knip's multi-entry config for this repo's actual graph shape (Vite client + SSR + free-standing `scripts/*.mjs`) is real setup work, not a default.** If Phase 3 ships knip with only its default single-entry assumption, the first dogfood run (Task 4.2) will surface a wall of false-positive "unused export" noise. This design flags the need but does not pre-author the entry-point config — that's Phase 3/4 work against this repo's real file layout.
4. **`vitest`/`@playwright/test` peerDependency-vs-bundled is explicitly left as a Phase 3 build decision** (§3) — this design states both options and the deciding question (does `ts-qa-ci` orchestrate the consumer's own configured test setup, or ship its own default config) but does not resolve it, because it depends on Phase 3 scaffolding choices not yet made.
5. **Prettier and ESLint's exact exit-code contracts are asserted from Part A's research, not independently re-verified against the specific Prettier/ESLint versions this repo/`ts-qa-ci` will pin.** §2.5 states the classification `ts-qa` should implement, but Task 3.2 must empirically verify it against the actual shipped versions before shipping — per A.2's own "(verified)" comment discipline. Treat the table in §2.5 as the target contract to test against, not a confirmed fact.
6. **The `no-window-location` split's "promote `rel=noopener` half to Tier A core" note (§4, Tier C) is a suggestion flagged for Phase 3 confirmation, not a decision this document makes.** Listed under Tier C pending that confirmation to avoid silently overclaiming a tier assignment Task 2.7's review hasn't seen.
7. **Variant-API enforcement rule mechanics are entirely unspecified beyond "informed by `no-hard-coded-component-data.js`'s technique."** No ec-site rule exists to adapt (B.2 confirms ec-site's own CVA usage is a single-component pilot, not a mature catalogue) — this is genuinely new rule authorship for Phase 3/4, and this design does not (and cannot yet) specify its exact AST logic.
8. **Task 3.0's maintainer sign-off on ec-site code lift is a hard blocking precondition this design assumes will be granted.** If it is refused or scoped narrower than expected, most of §4's Tier A/B/C rule list needs re-authoring from scratch rather than adapting, which would materially change Phase 3's effort estimate. Not this design's call to resolve.

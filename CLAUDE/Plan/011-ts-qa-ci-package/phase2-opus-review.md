# Plan 011 — Phase 2 Design Review (Task 2.7, Opus)

**Reviewed**: `untracked/plan-011-phase2-design.md` for BUILDABILITY, against the plan (`CLAUDE/Plan/011-ts-qa-ci-package/PLAN.md`), the Phase 1 concept report, and real source in `untracked/repos/php-qa-ci` + `untracked/ec-site`.
**Date**: 2026-07-10
**Provenance note**: this file cites the design doc's original `untracked/` path — the document itself was later moved into this plan folder as [`phase2-design.md`](phase2-design.md); there is no second, divergent copy left in `untracked/`. Its blocking finding was subsequently found incomplete by a pass-2 Fable audit — see [`plan-audit-fable-1.md`](plan-audit-fable-1.md) finding B1 and `phase2-design.md`'s current §2.4 for the corrected mechanism.

## Verdict: NEEDS REVISION

The design is, with one exception, genuinely buildable: §2.2 (orchestrator), §2.5 (deploy), and §2.6 (CI install) are concrete enough that a Phase 3 agent could implement them from the pseudocode/tables without inventing decisions, and the honesty in §7 (Open Risks) is a feature, not a gap. **One blocking internal contradiction** (Finding 1) would force a build agent into an undocumented judgment call that silently breaks Decision 4's central guarantee. It is narrow and one paragraph away from fixed — this is "revise then go," not "rethink."

### Spot-checks performed (all passed)

Verified against real source, not taken on faith:

- `php-qa-ci` env vars/functions cited in §2.5/§4 all exist with the exact names: `detectReadOnly()` (`includes/functions.inc.bash:273`), `GITHUB_ACTIONS=true → read-only` (`:284`), `QA_READONLY` override (`:274`), `CLAUDECODE=1 → CI` with the log string "Claude Code environment detected - enabling CI mode" (`bin/qa:87`), `PHP_QA_CI_DISABLE_CONFIG_PUSH` (`SkillsDeployPlugin.php:58`), `useArkitect=0` / `useSensitiveParameterCheck=0` (their `.inc.bash` files). The §2.5/§4 port is faithful.
- §1's `LinksChecker.php` citation is real (`src/Markdown/LinksChecker.php`, 328 lines).
- Every ec-site rule file named in §4's tier tables exists under `ec-site/eslint-rules/`; the cache library is at `scripts/lib/cache.ts` as §2.3/§7 claim.
- This repo's `src/routes.ts`, the `llm:*` npm scripts, and the hardcoded `node-version: '18'` in `ci.yml` all match the design's premises.

## Blocking findings

### 1. §4 and §2.4 contradict each other on how the always-on tier is guaranteed

§4 decides ts-qa "owns and runs its own ESLint config… a consumer's own `eslint.config.js` can _add_ project-specific rules but cannot silently omit the core tier," and locates that config as **"project override via `tsQaConfig/eslint.config.js` tier 1, per §2.4's cascade."** But §2.4's `resolveConfigPath` is explicitly **first-match-wins, no merging**: if `tsQaConfig/eslint.config.js` exists, it is returned _wholesale_ and the generic base is never loaded. Those two statements cannot both be true — under §2.4's semantics a consumer who drops a `tsQaConfig/eslint.config.js` **can** silently omit the entire core + CDD tier, which is exactly the "opt-in rules can't be relied on estate-wide" failure mode Decision 4 / Task 2.4 exists to prevent (the SensitiveParameter precedent is unconditional-run, opt-**out**-only via a narrow flag — never wholesale-replaceable).

The design even ships _two conflicting opt-out surfaces_: the intended narrow one (§4: `tsQaConfig/cdd-exclusions.json` globs or `TSQA_DISABLE_CDD=1`) and the accidental wholesale one (§2.4 tier-1 config replacement). A build agent implementing §2.4 literally for the ESLint config file will produce a harness whose flagship guarantee is trivially bypassable, and nothing in the doc tells them not to.

**Fix**: State that the always-on core tier (and CDD-core rules) are spread **programmatically** by ts-qa's ESLint runner and are _not_ subject to the first-match-wins file cascade — `tsQaConfig/eslint.config.js` may only **add** rules (force-merged _after_ the base) or apply the documented narrow opt-out, never replace the base. Equivalently: exclude `eslint.config.js` from `resolveConfigPath`'s wholesale semantics and give it merge-with-base semantics instead. One paragraph in §2.4 + §4 reconciles it.

## Non-blocking findings

### 2. Task 2.3 leaves the testing-tool encapsulation genuinely undecided

`vitest` / `@playwright/test` / `@stryker-mutator/core` are listed as "bundled **or** peerDependency," resolved to "a Phase 3 build decision" (also §7 risk 4). The deciding question is stated (does ts-qa orchestrate the consumer's own test config, or ship its own?), so it is a _documented_ deferral rather than an undocumented judgment call — hence non-blocking. But that same unresolved question also shapes §2.2's `src/tools/{vitest,playwright}.ts` runners and the config cascade for test config, so it is upstream of more than the dependency table. **Fix**: resolve the "orchestrate vs ship-config" question now (this repo already has `vitest.config.ts`; the natural answer is orchestrate → peerDependency), rather than carrying it into Phase 3 where it touches three sections at once.

### 3. Task 2.1's markdown-link choice is only half of `mdlinks` parity

§1 says remark-validate-links "matches `LinksChecker.php`'s relative-file + anchor-resolution spec directly." Verified true — **but incomplete**: `LinksChecker.php` also validates **external HTTP links** (`validateHttpLink`, `:165`), with GitHub-token-aware "cannot verify anonymously → skip, don't fail" logic (`:187`). remark-validate-links explicitly does _not_ check `http(s)`. So the chosen tool is a partial parity downgrade from the very `mdlinks` analogue Task 2.1 names, and the external half is left as an unowned "Phase 3/4 decision" (§7 risk 2). **Fix**: explicitly decide whether external-URL checking is in v1 scope; if yes, name the second tool (design already surfaces `remark-lint-no-dead-urls`) so Task 2.1 closes rather than leaving a TODO that reads as resolved.

### 4. Task 2.6's mechanism is contingent on an unmade, unrecorded decision

The git-dependency mechanism is fully specified and correct (npm 11.16 supports `github:…#<sha>` under `npm ci`; committing `dist/` removes the flaky `prepare` trigger — both sound). But its "zero friction" rests entirely on `LongTermSupport/ts-qa-ci` being a **public** repo, which §7 risk 1 admits "is still an open decision, not yet made," and §6 itself asks for it "to be recorded as its own Technical Decision in the plan" — which has **not** been added to the plan's Technical Decisions. Non-blocking for Phase 3 _scaffolding_ (Tasks 3.1–3.5 don't need the repo pushed), and the committed-tarball fallback covers the private case, so it can't hard-block. **Fix**: add the repo-visibility Technical Decision to the plan now (the design already recommends public), so Task 3.6/4.6/4.7 don't inherit an implicit precondition.

### 5. §2.5's deploy _mechanism_ is fully specified; its _payload_ is not

The 8-step deploy contract is concrete and correctly aligned with this repo's `hook_registration_checker` policy (settings.json-only, wrapper-routed, project-handlers not classic hooks). But it never states **what ts-qa-ci actually ships to deploy**. If ts-qa-ci ships only skills/agents and no hook logic, then steps 2–4/6 (the daemon project-handler-registration branch, including the daemon-version-specific handler class contract like `get_claude_md`) are dead code for the daemon path. Non-blocking — Task 3.4 defines the payload — but the build agent should confirm the payload exists before implementing the most complex branch of the script against a contract owned by an external dependency (the daemon).

### 6. (Trivial) §2.2's "ESLint twice" table wording

The Phase table labels the passes "auto-fixable rules" (Phase 1) vs "remaining rules" (Phase 2), but ESLint does not partition a single config by fixability — `--fix` fixes what it can and reports the rest. The §2.2 rationale prose gets this right ("a pure report pass over whatever `--fix` could not resolve"); only the table could mislead. Reword the table cells to match the prose.

## Consistency with the plan's Decisions and Non-Goals

No contradictions found beyond Finding 1:

- **Decision 3 (CDD JSX-only, `articles.ts` exempt)** — honored: `no-ad-hoc-html` is scoped `.tsx` under `src/pages/**` + `src/components/**` (§4 Tier A). `no-placeholder` running repo-wide incl. `articles.ts` is _not_ a violation — it's a string-content rule, not the HTML-structure rule Decision 3 governs.
- **Decision 4 (variant catalogue in scope)** — honored: `no-ad-hoc-classnames` and variant-API enforcement are correctly placed in the opt-in Tier B, gated on the Phase-4 catalogue; §7 risk 7 honestly flags the variant-API rule mechanics as unspecified new authorship, consistent with Task 3.3's "iterative, cross-checked" framing. (Finding 1 is about _delivery of the guarantee_, not catalogue scope.)
- **Decision 5 (ec-site licensing gate)** — honored twice (§4 "Blocking precondition," §7 risk 8): tiers are pre-assigned but explicitly _not_ authorization to copy code before Task 3.0 sign-off.
- **Non-Goals** — consistent: `detectPlatform()` reserves but does not build Next.js; Biome stays off the table; nothing pre-publishes.

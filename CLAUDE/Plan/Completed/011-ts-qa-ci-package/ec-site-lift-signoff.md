# Plan 011 — Task 3.0 Sign-Off: ec-site Code Lift

**Date**: 2026-07-10
**Required by**: Task 3.0 (gate), Decision 5, `PLAN.md`

## The ask (recap)

Before any ec-site-derived code (rules, meta-rules, `cache.ts`, orchestrator patterns) is scaffolded into the publishable `ts-qa-ci` package, the maintainer's explicit sign-off was required covering: (1) permission to relicense/republish ec-site code under `@longtermsupport`, (2) the lift/adapt/drop audit boundary, and (3) explicit consent to the code sitting in a public GitHub repo (Decision 6).

## Maintainer's sign-off (verbatim)

> the ts-qa-ci pakcage should carry globally useful, opt in specific scneario (eg compomnent driven) rules that are clean and free of proprietary stuff
>
> these can and should be enhanced with project specific rules that can carry more private and focussed rules. It should be easy to handle this.
>
> so yes - defintely lift what we can use out of the ec-site repo
>
> BUT also leave private stuff in ec-site - but refactor it accordingly
>
> lets get these site repos fully sorted with this new ts-qa-ci package being used for QA and CI propelry

## Agreed boundary (derived from the above + Phase 1/2 research)

1. **Lift into public `ts-qa-ci`**: only genuinely generic, business/brand-free code — the 8 lift-as-is rules, the portable core of the 25 adapt-tier rules (after stripping ec-site's hardcoded vocabulary/paths/component names per the B.1 catalogue's per-row reasoning), the cache library mechanism, the orchestrator shape, the meta-rule concept. This matches the tier assignment already designed in `phase2-design.md` §4 (Tier A/B/C).
2. **Leave in ec-site, refactored**: the 21 drop-tier rules (business/content/brand policy — contact/link whitelists, case-study/tech-logo/hover-text content rules, the proprietary sitemap-doc sync, etc.) stay in ec-site as **private, project-specific rules**, layered on top of `ts-qa-ci` via the project-override mechanism (`tsQaConfig/eslint.config.js` additions + `tsQaConfig/tier-a-exemptions.json`) that `phase2-design.md` §2.4/§4 already designed — this is exactly the "easy to layer project-specific/private rules on top of global ones" mechanism the maintainer asked for, confirmed already fit for purpose by the Fable-audit-driven fix.
3. **Public repo visibility confirmed**: the maintainer's sign-off does not distinguish "OK to publish a package" from "OK for this code to sit in a public GitHub repo" — read together with the unprompted, affirmative "yes — definitely lift" framing, this is read as covering both. Decision 6 (public `LongTermSupport/ts-qa-ci` repo) stands as designed.
4. **New scope**: ec-site itself becomes a second consumer of `ts-qa-ci`, refactored to depend on the published package for its generic QA/CI needs while retaining its private/brand-specific rules locally. Tracked as a new, separate plan (see `PLAN.md` Notes & Updates) rather than folded into Plan 011, per the Fable audit's S5 finding that this plan was already carrying more than one project's worth of scope.

## Status

**Task 3.0 satisfied.** Phase 3 (Build) may proceed.

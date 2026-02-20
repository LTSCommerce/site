# Plan 008: ESLint Custom Rules Adoption

**Status**: 📋 Planned
**Created**: 2026-02-20
**Last Updated**: 2026-02-20
**Owner**: Claude Code
**Priority**: Medium-High
**Type**: Code Quality / Tooling
**Related**: Plan 001 (React Migration), Plan 006 (Testing Infrastructure)

## ⚠️ Execution Workflow: Worktree Required

This plan **must** be executed using the git worktree workflow. Read the full documentation before starting any implementation:

**@CLAUDE/Worktree.md**

```bash
# Setup: create parent worktree before any implementation
git worktree add untracked/worktrees/worktree-plan-008 -b worktree-plan-008
```

- All implementation work happens inside the worktree — never directly in `/workspace`
- Child → Parent merges: automatic (no approval needed)
- Parent → `react-migration` merge: **requires explicit human approval**

## Overview

Adopt relevant custom ESLint rules from the EC site (`untracked/ec-site/eslint-rules/`) into LTS Commerce. The EC site has 55+ custom rules, but many are EC-specific (case studies, research sections, component catalogue enforcement, Tailwind CSS validation, SSR/SSG concerns, Cloudflare Workers). This plan cherry-picks only the rules that provide genuine value for a PHP engineer portfolio site built with React/TypeScript.

LTS Commerce already has 3 custom rules adopted during Plan 001 Phase 2:
- `no-hardcoded-routes` -- enforces ROUTES object usage
- `no-string-link-props` -- prevents `link: string` props (must use RouteEntry)
- `use-types-not-strings` -- enforces typed constants over string literals (CATEGORIES)

This plan expands the custom rule set with rules that improve SEO quality, prevent incomplete content, enforce React SPA patterns, and strengthen type safety.

## Goals

1. **Audit all EC site ESLint rules** and categorise each as: adopt, adapt, or skip
2. **Adopt high-value rules** that enforce SEO metadata, prevent placeholder content, and enforce SPA navigation patterns
3. **Adapt rules** that need LTS-specific modifications (different component names, file paths, patterns)
4. **Integrate rules** into `eslint.config.js` and fix any violations they surface
5. **Document each adopted rule** with rationale and usage examples

## Non-Goals

- **Not copying all EC rules**: Most are EC-specific (case studies, research, design guidelines catalogue, Tailwind enforcement, SSR/SSG, carousel variants, etc.)
- **Not creating meta-lint rules**: LTS has fewer rules; meta-linting adds complexity without proportional benefit at this scale
- **Not adopting EC-specific content quality rules**: LLM text detection, British English enforcement, etc. are not relevant for LTS
- **Not changing existing rule implementations**: The 3 rules already in LTS (`no-hardcoded-routes`, `no-string-link-props`, `use-types-not-strings`) work well and are not being modified

## Context & Background

### Current State

LTS Commerce ESLint configuration (`eslint.config.js`) uses:
- `@eslint/js` recommended rules
- `typescript-eslint` strict type-checked config
- `react-hooks` recommended rules
- `react-refresh` for HMR
- 3 custom rules under the `custom` namespace

The EC site has 55+ custom rules under `local-rules` namespace, developed over months of production usage. Many encode hard-won lessons about React/TypeScript pitfalls.

### EC Site Rule Audit

Full audit of all 55+ EC site ESLint rules, categorised by relevance to LTS Commerce:

#### Category A: Adopt (High Value for LTS)

| Rule | Purpose | LTS Benefit |
|------|---------|-------------|
| `require-page-seo-export` | Ensures every page has SEO metadata in a `-meta.ts` file | Critical for portfolio SEO -- every page needs proper meta tags |
| `validate-seo-metadata` | Validates title length (30-70 chars), description (120-170 chars), keywords (3-10) | Prevents bad SEO from going live |
| `no-window-location` | Prevents `window.location.href` (causes full page reload in SPA) | Enforces React Router SPA navigation |
| `no-placeholder` | Blocks `PLACEHOLDER` text in string literals and template literals | Prevents incomplete content shipping to production |
| `no-eslint-disable` | Bans `eslint-disable`, `@ts-ignore` suppression comments | Enforces "fix the problem, don't hide it" discipline |

#### Category B: Adapt (Valuable with Modifications)

| Rule | Purpose | Adaptation Needed |
|------|---------|-------------------|
| `require-page-layout-wrapper` | Ensures pages use PageLayout wrapper | Adapt import path and component name to match LTS `Page` component |
| `no-unescaped-quotes-in-meta` | Prevents HTML attribute parsing errors from unescaped quotes in meta tags | Works as-is if LTS adopts `-meta.ts` pattern; otherwise adapt to inline SEO |
| `no-children-on-prop-only-components` | Prevents children on prop-only components | Adopt with LTS-specific component list (once components exist) |

#### Category C: Possibly Valuable (Evaluate Later)

| Rule | Purpose | Why Deferred |
|------|---------|--------------|
| `no-duplicate-section-ids` | Prevents duplicate `id` attributes in JSX | Useful once LTS has more complex pages with anchor navigation |
| `validate-internal-links` | Validates internal `<Link>` targets resolve to real routes | Already partially covered by `no-hardcoded-routes` + TypeScript |
| `no-non-deterministic-render` | Prevents `Date.now()`, `Math.random()` in render | Relevant if LTS adds SSR/SSG later |
| `no-browser-globals-in-render` | Prevents `window`/`document` in render body | Relevant if LTS adds SSR/SSG later |
| `ssr-safe-hooks` | Ensures hooks work in SSR context | Only relevant if LTS adopts SSR |
| `prefer-satisfies-over-as-const` | Prefers `satisfies` over `as const` for type safety | Nice TypeScript best practice but low priority |
| `require-explicit-type-annotations` | Requires explicit types on exported functions | Good practice but may be noisy; evaluate after core rules |
| `require-exported-component-types` | Ensures components export their prop types | Good for component library; evaluate in Plan 007 context |
| `no-string-route-properties` | Prevents string type for route-like properties in interfaces | Already partially covered by `no-string-link-props` |
| `require-component-default-export` | Enforces default exports for React.lazy() | Only relevant if LTS uses code splitting with React.lazy() |
| `validate-lazy-imports` | Validates React.lazy() import paths | Only relevant if LTS uses code splitting |

#### Category D: Skip (EC-Specific, Not Relevant)

| Rule | Purpose | Why Skip |
|------|---------|----------|
| `validate-case-studies-index` | Validates case study index page | EC-specific business content |
| `validate-research-index-completeness` | Validates research index completeness | EC-specific research section |
| `require-component-in-design-guidelines` | Ensures components appear in design guidelines page | EC has a design guidelines page; LTS does not |
| `require-documented-component-exists` | Cross-references CLAUDE.md component docs with actual files | EC-specific documentation workflow |
| `require-sitemap-page-sync` | Syncs sitemap with page files | EC-specific multi-entry build |
| `validate-routes-have-pages` | Validates each route has a page file | EC-specific folder-routing structure |
| `require-tests-in-page-folders` | Requires test files alongside page files | EC-specific test structure; LTS uses Plan 006 testing approach |
| `require-llm-npm-commands` | Enforces `npm run llm:*` commands in documentation | EC-specific AI workflow |
| `no-html-in-pages` | Bans raw HTML elements in page components | EC enforces component-only pages; LTS allows HTML in pages |
| `no-hard-coded-component-data` | Prevents hardcoded data in components | EC-specific data parameterisation pattern |
| `no-page-component-data-exports` | Prevents data exports from page components | EC-specific page architecture |
| `no-route-comments` | Bans route path comments in code | Minor style preference |
| `no-orphaned-grid-items` | Prevents grid items outside grid containers | EC-specific Tailwind grid patterns |
| `no-stacked-expandables` | Prevents stacked expandable sections | EC-specific component rule |
| `no-expandable-details-in-p` | Prevents ExpandableDetails inside `<p>` | EC-specific component rule |
| `no-aside-after-expandable-details` | Prevents Aside after ExpandableDetails | EC-specific component rule |
| `no-empty-highlight-text` | Prevents empty highlight text props | EC-specific HighlightText component |
| `validate-hover-text` | Validates hover text on components | EC-specific component rule |
| `enforce-width-standards` | Enforces width class standards | EC-specific Tailwind width patterns |
| `require-layout-variant-for-carousels` | Requires layout variant on carousel components | EC-specific carousel component |
| `enforce-dynamic-data-sources` | Enforces data comes from typed sources | EC-specific data architecture |
| `enforce-tel-links` | Enforces tel: link format | EC-specific contact pattern |
| `enforce-contact-link-whitelist` | Restricts ContactLink to specific pages | EC-specific page-type whitelisting |
| `enforce-external-link-whitelist` | Restricts ExternalLink to specific pages | EC-specific page-type whitelisting |
| `no-external-links-in-pages` | Prevents external links in standard pages | Too restrictive for portfolio |
| `no-hardcoded-contact-details` | Prevents hardcoded phone/email in components | EC-specific; LTS uses simple contact page |
| `validate-tech-logos` | Validates tech logo imports from Simple Icons | EC-specific technology showcase |
| `validate-simple-icons` | Validates Simple Icons package imports | EC-specific icon library |
| `no-json-content-type-for-apps-script` | Prevents JSON content-type for Apps Script CORS | EC-specific Google Apps Script integration |
| `no-router-link-hash` | Prevents hash in Router Link `to` prop | Minor; covered by TypeScript types |
| `validate-hash-links` | Validates hash link targets exist | Would need significant adaptation |
| `no-aside-after-expandable-details` | Component-specific ordering rule | EC-specific component |
| `load-routes` | Utility for loading routes in rules (not a rule itself) | Helper module, not needed |

## Tasks

### Phase 1: Audit & Documentation

- [ ] ⬜ **Complete rule audit**: Review each EC rule file (done in this plan -- see audit above)
- [ ] ⬜ **Document decisions**: Record rationale for adopt/skip/adapt for each rule (done in this plan)

### Phase 2: High-Value Rule Adoption (Category A)

- [ ] ⬜ **Adopt `require-page-seo-export`**: Copy and adapt for LTS page structure
  - [ ] ⬜ Determine LTS SEO metadata pattern (inline in Page component vs separate `-meta.ts` files)
  - [ ] ⬜ Adapt file path checks (`src/pages/` structure)
  - [ ] ⬜ Add rule to `eslint-rules/require-page-seo-export.js`
  - [ ] ⬜ Register in `eslint.config.js` under `custom` namespace
  - [ ] ⬜ Fix any violations surfaced
- [ ] ⬜ **Adopt `validate-seo-metadata`**: Copy and adapt for LTS SEO constraints
  - [ ] ⬜ Adjust character limits if needed (title 30-70, description 120-170)
  - [ ] ⬜ Add rule to `eslint-rules/validate-seo-metadata.js`
  - [ ] ⬜ Register in `eslint.config.js`
  - [ ] ⬜ Fix any violations surfaced
- [ ] ⬜ **Adopt `no-window-location`**: Copy for SPA navigation enforcement
  - [ ] ⬜ Add rule to `eslint-rules/no-window-location.js`
  - [ ] ⬜ Register in `eslint.config.js`
  - [ ] ⬜ Fix any violations surfaced
- [ ] ⬜ **Adopt `no-placeholder`**: Copy for preventing incomplete content
  - [ ] ⬜ Add rule to `eslint-rules/no-placeholder.js`
  - [ ] ⬜ Register in `eslint.config.js`
  - [ ] ⬜ Fix any violations surfaced
- [ ] ⬜ **Adopt `no-eslint-disable`**: Copy for enforcing fix-over-suppress discipline
  - [ ] ⬜ Add rule to `eslint-rules/no-eslint-disable.js`
  - [ ] ⬜ Register in `eslint.config.js`
  - [ ] ⬜ Fix any violations surfaced (remove any existing suppression comments)

### Phase 3: Adapted Rule Adoption (Category B)

- [ ] ⬜ **Adapt `require-page-layout-wrapper`**: Modify for LTS `Page` component
  - [ ] ⬜ Change import path to match LTS layout component (e.g., `@/components/layout/Page`)
  - [ ] ⬜ Change component name from `PageLayout` to `Page` (or whatever LTS uses)
  - [ ] ⬜ Add rule to `eslint-rules/require-page-layout-wrapper.js`
  - [ ] ⬜ Register in `eslint.config.js`
  - [ ] ⬜ Fix any violations surfaced
- [ ] ⬜ **Adapt `no-unescaped-quotes-in-meta`**: Apply to LTS SEO metadata files
  - [ ] ⬜ Add rule to `eslint-rules/no-unescaped-quotes-in-meta.js`
  - [ ] ⬜ Register in `eslint.config.js`
  - [ ] ⬜ Fix any violations surfaced
- [ ] ⬜ **Adapt `no-children-on-prop-only-components`**: Configure with LTS component list
  - [ ] ⬜ Identify LTS components that use `children?: never` pattern
  - [ ] ⬜ Add rule to `eslint-rules/no-children-on-prop-only-components.js`
  - [ ] ⬜ Configure with LTS-specific component list in `eslint.config.js`
  - [ ] ⬜ Fix any violations surfaced

### Phase 4: Integration & Verification

- [ ] ⬜ **Run full lint check**: `npm run lint` must pass with 0 violations
- [ ] ⬜ **Run TypeScript check**: `npx tsc --noEmit` must pass with 0 errors
- [ ] ⬜ **Run build**: `npm run build` must succeed
- [ ] ⬜ **Manual violation testing**: Introduce deliberate violations to confirm rules catch them
  - [ ] ⬜ Test `require-page-seo-export` catches missing SEO
  - [ ] ⬜ Test `validate-seo-metadata` catches title too short/long
  - [ ] ⬜ Test `no-window-location` catches `window.location.href`
  - [ ] ⬜ Test `no-placeholder` catches `PLACEHOLDER` text
  - [ ] ⬜ Test `no-eslint-disable` catches suppression comments

### Phase 5: Documentation

- [ ] ⬜ **Create rule documentation**: Add `.md` file for each new rule in `eslint-rules/`
  - [ ] ⬜ `require-page-seo-export.md`
  - [ ] ⬜ `validate-seo-metadata.md`
  - [ ] ⬜ `no-window-location.md`
  - [ ] ⬜ `no-placeholder.md`
  - [ ] ⬜ `no-eslint-disable.md`
  - [ ] ⬜ `require-page-layout-wrapper.md`
  - [ ] ⬜ `no-unescaped-quotes-in-meta.md`
  - [ ] ⬜ `no-children-on-prop-only-components.md`
- [ ] ⬜ **Update CLAUDE.md**: Document custom rule overview in project instructions

## Dependencies

- **Depends on**: Plan 001 Phase 5 complete ✅ (all pages converted to React)
- **Blocks**: Nothing directly; improves code quality for all future development
- **Related**:
  - Plan 001 (React Migration) -- provides the React/TypeScript codebase these rules protect
  - Plan 006 (Testing Infrastructure) -- test suite should pass with new rules active
  - Plan 007 (Component Library) -- `no-children-on-prop-only-components` applies to lifted components

## Technical Decisions

### Decision 1: Rule Namespace
**Context**: EC site uses `local-rules` namespace; LTS already uses `custom` namespace.

**Decision**: Keep `custom` namespace for consistency with existing LTS rules.

**Date**: 2026-02-20

### Decision 2: SEO Metadata Pattern
**Context**: EC site uses separate `-meta.ts` files for SEO. LTS currently passes SEO props inline to the `Page` component.

**Options**:
1. Adopt EC's `-meta.ts` file pattern (separate files, cleaner separation)
2. Keep inline SEO and adapt rule to check page component props
3. Create a hybrid: SEO constants in page file, rule checks for export

**Decision**: TBD during Phase 2 implementation -- evaluate what fits LTS page structure best.

**Date**: 2026-02-20 (pending)

### Decision 3: Strictness Level for no-eslint-disable
**Context**: EC site bans all suppression comments. LTS may need some flexibility during migration.

**Options**:
1. `error` -- strict, no suppression allowed (matches EC)
2. `warn` -- flag but don't block (gentler during migration)

**Decision**: Start with `error` level. If legitimate cases arise, add targeted overrides in `eslint.config.js` rather than allowing suppression comments.

**Date**: 2026-02-20

## Success Criteria

- [ ] All Category A rules (5 rules) installed and active at `error` level
- [ ] All Category B rules (3 rules) installed and active
- [ ] `npm run lint` passes with 0 violations
- [ ] `npm run build` succeeds
- [ ] TypeScript: 0 errors
- [ ] Each rule correctly flags violations when tested with deliberate bad code
- [ ] Rule documentation exists for every adopted rule
- [ ] Total custom rules: 11 (3 existing + 5 Category A + 3 Category B)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| New rules surface many existing violations | Medium | Medium | Fix violations incrementally; use `warn` level temporarily if needed |
| SEO metadata pattern decision delays adoption | Medium | Low | Can adopt `no-placeholder`, `no-window-location`, `no-eslint-disable` independently of SEO pattern decision |
| Rules conflict with existing ESLint config | Low | Low | Test each rule individually before adding to config |
| Category B rules need significant adaptation | Medium | Medium | Budget extra time; can defer to later if adaptation proves complex |
| `no-eslint-disable` too strict during active development | Low | Medium | Use targeted file-level overrides in `eslint.config.js` for legitimate cases |

## Timeline

Per PlanWorkflow guidance, no specific time estimates. Work proceeds in phases, each completed before moving to next.

- **Phase 1**: 📋 Planned (Audit complete in this document)
- **Phase 2**: 📋 Planned (High-value rules -- can begin immediately)
- **Phase 3**: 📋 Planned (Adapted rules -- depends on Phase 2 patterns)
- **Phase 4**: 📋 Planned (Integration verification)
- **Phase 5**: 📋 Planned (Documentation)

**Target Completion**: When all phases complete and success criteria met

## Notes & Updates

### 2026-02-20 - Plan Creation

- Audited all 55+ EC site ESLint rules
- Categorised into 4 tiers: Adopt (5), Adapt (3), Evaluate Later (11), Skip (36+)
- LTS already has 3 custom rules from Plan 001 Phase 2
- Target state: 11 custom rules providing comprehensive code quality enforcement
- Key focus areas: SEO quality, SPA navigation, placeholder prevention, suppression ban
- Deferred SSR/SSG rules (Category C) since LTS is client-side only for now

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-02-20
**Plan Status**: 📋 Planned

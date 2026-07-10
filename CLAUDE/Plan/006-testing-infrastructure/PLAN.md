# Plan 006: Testing Infrastructure (Vitest + Playwright)

**Status**: 📋 Planned
**Created**: 2026-02-20
**Last Updated**: 2026-02-20
**Owner**: Claude Code
**Priority**: Medium
**Type**: Infrastructure / Quality Assurance
**Related**: Plan 001 Phase 8 (QA), Plan 005 (Vite Config Optimisation)

## ⚠️ Execution Workflow: Worktree Required

This plan **must** be executed using the git worktree workflow. Read the full documentation before starting any implementation:

**@CLAUDE/Worktree.md**

```bash
# Setup: create parent worktree before any implementation
git worktree add untracked/worktrees/worktree-plan-006 -b worktree-plan-006
```

- All implementation work happens inside the worktree — never directly in `/workspace`
- Child → Parent merges: automatic (no approval needed)
- Parent → `react-migration` merge: **requires explicit human approval**

## Overview

Set up a complete testing infrastructure for LTS Commerce, based on the EC site's proven testing stack. This covers both unit testing (Vitest + Testing Library) for React components and end-to-end testing (Playwright) for smoke-testing all pages in a real browser.

The EC site has a mature testing setup that we can adapt. LTS Commerce is simpler (5 pages, no complex state management), so we adopt the core patterns without the EC site's heavier fixtures and mock registries. The goal is a lean, effective test suite that catches regressions and validates all pages render correctly.

## Goals

1. **Unit Test Infrastructure**: Vitest configured with happy-dom, Testing Library, and coverage reporting
2. **E2E Test Infrastructure**: Playwright configured for Chrome-only smoke testing
3. **Component Test Patterns**: Establish co-located test patterns with a custom render wrapper
4. **Page Smoke Tests**: All 5 pages (Home, About, Articles, ArticleDetail, Contact) have E2E smoke tests
5. **CI-Ready Scripts**: npm scripts for running tests, coverage, and E2E in automation

## Non-Goals

- **Full test coverage**: We are setting up infrastructure and initial tests, not 100% coverage
- **Visual regression testing**: Screenshot comparison tooling is out of scope
- **Cross-browser E2E**: Chrome-only is sufficient for smoke tests at this stage
- **Performance testing**: Lighthouse CI is a separate concern (Plan 001 Phase 9)
- **EC site mock registries**: LTS Commerce has no complex registries requiring mock fixtures

## Context & Background

### Current State

LTS Commerce has **zero testing infrastructure**. No test runner, no test utilities, no test files exist. The `package.json` has no test-related dependencies or scripts.

### EC Site Reference

The EC site (`untracked/ec-site/`) has a proven testing stack:

- **Vitest** (`^4.0.16`) with happy-dom (`^20.1.0`) for unit tests
- **@testing-library/react** (`^16.3.1`) + **@testing-library/jest-dom** (`^6.9.1`) for component testing
- **@testing-library/user-event** (`^14.6.1`) for interaction simulation
- **Playwright** (`^1.56.1`) for E2E browser tests
- **v8 coverage** with HTML + JSON + LCOV reporters
- Co-located test files (`Component.test.tsx` next to `Component.tsx`)
- Custom `render()` wrapper in `src/test-utils/` that provides BrowserRouter

### LTS Commerce Components Available for Testing

Current components in `src/`:

- **Layout**: Page, Navigation, Footer, Container, Section
- **Content**: Hero, Prose, CategoryBadge
- **Article**: ArticleCard, ArticleContent
- **Pages**: Home, About, Contact, ArticleList, ArticleDetail

### Key Patterns to Adopt from EC Site

1. **happy-dom** over jsdom (faster, sufficient for React testing)
2. **Chrome-only** Playwright projects (sufficient for smoke tests, faster CI)
3. **JSON reporters** in CI for machine-parseable output
4. **Screenshot on failure** for E2E debugging
5. **Custom render wrapper** with BrowserRouter for components using routing
6. **Coverage output to `var/`** directory (gitignored)

## Tasks

### Phase 1: Vitest Setup

- [ ] ⬜ **Install Vitest dependencies**:
  - [ ] ⬜ `vitest` (unit test runner)
  - [ ] ⬜ `happy-dom` (fast DOM environment)
  - [ ] ⬜ `@testing-library/react` (React testing utilities)
  - [ ] ⬜ `@testing-library/jest-dom` (DOM matchers: toBeInTheDocument, etc.)
  - [ ] ⬜ `@testing-library/user-event` (user interaction simulation)
  - [ ] ⬜ `@vitest/coverage-v8` (code coverage with v8 provider)
- [ ] ⬜ **Create `vitest.config.ts`**:
  - [ ] ⬜ Configure happy-dom environment
  - [ ] ⬜ Enable test globals (describe, it, expect without imports)
  - [ ] ⬜ Set up `@/` path alias matching vite.config.ts
  - [ ] ⬜ Configure v8 coverage provider with HTML + JSON reporters
  - [ ] ⬜ Set coverage output to `var/coverage/`
  - [ ] ⬜ Configure JSON test output to `var/qa/vitest.json` in CI
  - [ ] ⬜ Set include pattern: `src/**/*.{test,spec}.{ts,tsx}`
  - [ ] ⬜ Exclude: `node_modules`, `dist`, `untracked`
- [ ] ⬜ **Create `src/test-utils/setup.ts`**:
  - [ ] ⬜ Import `@testing-library/jest-dom/vitest` for DOM matchers
  - [ ] ⬜ Suppress expected React warning noise (ReactDOM.render, useLayoutEffect)
- [ ] ⬜ **Create `src/test-utils/index.tsx`**:
  - [ ] ⬜ Custom `render()` function wrapping components in BrowserRouter
  - [ ] ⬜ Re-export all `@testing-library/react` utilities
  - [ ] ⬜ Override default `render` with custom version
- [ ] ⬜ **Add npm scripts to `package.json`**:
  - [ ] ⬜ `"test": "vitest"` (watch mode for development)
  - [ ] ⬜ `"test:run": "vitest run"` (single run for CI)
  - [ ] ⬜ `"test:coverage": "vitest run --coverage"` (with coverage report)
  - [ ] ⬜ `"llm:test": "vitest run --reporter=json --outputFile=var/qa/vitest.json"` (machine-parseable)
- [ ] ⬜ **Update `.gitignore`**: Ensure `var/coverage/` and `var/qa/` are ignored

### Phase 2: Unit Test Foundation

- [ ] ⬜ **Write CategoryBadge tests** (`src/components/content/CategoryBadge.test.tsx`):
  - [ ] ⬜ Renders correct category label text
  - [ ] ⬜ Applies correct CSS classes for each category type
  - [ ] ⬜ Handles all category variants (PHP, Infrastructure, Database, AI, TypeScript)
- [ ] ⬜ **Write ArticleCard tests** (`src/components/article/ArticleCard.test.tsx`):
  - [ ] ⬜ Renders article title and description
  - [ ] ⬜ Displays category badge
  - [ ] ⬜ Displays formatted date
  - [ ] ⬜ Links to correct article detail route
- [ ] ⬜ **Write Navigation tests** (`src/components/layout/Navigation.test.tsx`):
  - [ ] ⬜ Renders all navigation links
  - [ ] ⬜ Links point to correct routes
- [ ] ⬜ **Verify test runner works**:
  - [ ] ⬜ Run `npm test` and confirm all tests pass
  - [ ] ⬜ Run `npm run test:coverage` and confirm coverage report generates to `var/coverage/`
- [ ] ⬜ **Document testing patterns**: Add brief comments in test-utils explaining usage

### Phase 3: Playwright Setup

- [ ] ⬜ **Install Playwright dependencies**:
  - [ ] ⬜ `@playwright/test` (test runner and assertions)
  - [ ] ⬜ Run `npx playwright install chromium` (browser binary)
- [ ] ⬜ **Create `playwright.config.ts`**:
  - [ ] ⬜ Set test directory to `tests/`
  - [ ] ⬜ Configure Chrome-only project (Desktop Chrome)
  - [ ] ⬜ Enable `fullyParallel: true`
  - [ ] ⬜ Set `screenshot: 'only-on-failure'`
  - [ ] ⬜ Set `trace: 'on-first-retry'`
  - [ ] ⬜ Configure HTML reporter to `var/test-results/html-report/`
  - [ ] ⬜ Set output directory to `var/test-results/`
  - [ ] ⬜ Configure webServer to run `npm run preview` on `localhost:4173`
  - [ ] ⬜ Support `BASE_URL` env var to skip webServer when external server provided
  - [ ] ⬜ Set CI retries to 2, local retries to 0
  - [ ] ⬜ Set CI workers to 1 (sequential for stability)
- [ ] ⬜ **Update `.gitignore`**: Ensure `var/test-results/` is ignored

### Phase 4: E2E Smoke Tests

- [ ] ⬜ **Create `tests/smoke.spec.ts`** with smoke tests for all pages:
  - [ ] ⬜ **Home page** (`/`):
    - [ ] ⬜ Page loads with 200 response
    - [ ] ⬜ Main heading is visible
    - [ ] ⬜ Navigation is present
    - [ ] ⬜ No console errors during load
  - [ ] ⬜ **About page** (`/about`):
    - [ ] ⬜ Page loads with 200 response
    - [ ] ⬜ About heading is visible
    - [ ] ⬜ No console errors during load
  - [ ] ⬜ **Articles page** (`/articles`):
    - [ ] ⬜ Page loads with 200 response
    - [ ] ⬜ Article cards are displayed
    - [ ] ⬜ Category filter buttons are visible
    - [ ] ⬜ No console errors during load
  - [ ] ⬜ **Article Detail page** (`/articles/:slug`):
    - [ ] ⬜ Page loads with 200 response for a known article slug
    - [ ] ⬜ Article title is visible
    - [ ] ⬜ Category badge is displayed
    - [ ] ⬜ No console errors during load
  - [ ] ⬜ **Contact page** (`/contact`):
    - [ ] ⬜ Page loads with 200 response
    - [ ] ⬜ Contact form is visible
    - [ ] ⬜ No console errors during load
- [ ] ⬜ **Create `tests/navigation.spec.ts`** for cross-page navigation:
  - [ ] ⬜ Navigate from Home to About via nav link
  - [ ] ⬜ Navigate from Home to Articles via nav link
  - [ ] ⬜ Navigate from Articles to Article Detail by clicking an article card
  - [ ] ⬜ Navigate from Home to Contact via nav link
  - [ ] ⬜ Verify back navigation works (browser back button)
- [ ] ⬜ **Add npm scripts for E2E**:
  - [ ] ⬜ `"test:e2e": "playwright test"` (full E2E suite)
  - [ ] ⬜ `"test:e2e:headed": "playwright test --headed"` (visible browser for debugging)

### Phase 5: CI Integration & Documentation

- [ ] ⬜ **Add combined test script**:
  - [ ] ⬜ `"test:all": "vitest run && playwright test"` (run both unit and E2E)
- [ ] ⬜ **Verify all scripts work end-to-end**:
  - [ ] ⬜ `npm run test:run` passes all unit tests
  - [ ] ⬜ `npm run test:coverage` generates coverage report
  - [ ] ⬜ `npm run test:e2e` passes all smoke tests (requires built site)
  - [ ] ⬜ `npm run llm:test` generates JSON output
- [ ] ⬜ **Update `var/.gitignore`**: Ensure all test output directories are ignored
  - [ ] ⬜ `coverage/`
  - [ ] ⬜ `qa/`
  - [ ] ⬜ `test-results/`
- [ ] ⬜ **Add testing notes to PLAN.md**: Document the testing patterns and conventions adopted

## Dependencies

- **Depends on**:
  - Plan 001 Phases 1-5 (complete) - React app with components and pages to test
  - Plan 005 (Vite Config) - Vite configuration that vitest.config.ts must align with
- **Blocks**:
  - Plan 001 Phase 8 (Quality Assurance) - this plan implements the testing portion
- **Related**:
  - Plan 001 Phase 8 (QA) - broader QA scope including visual testing, cross-browser
  - Plan 005 (Vite Config Optimisation) - path aliases and build config must align

## Technical Decisions

### Decision 1: Vitest over Jest

**Context**: Which unit test runner for a Vite + React + TypeScript project?

**Options Considered**:

1. **Vitest** - Native Vite integration, fast, ESM-first
2. **Jest** - Industry standard, but requires extra config for ESM/Vite

**Decision**: Vitest

- Native integration with Vite (shared config, transforms, path aliases)
- First-class ESM support (matches project's `"type": "module"`)
- Proven in EC site reference implementation
- Same assertion API as Jest (minimal learning curve)

**Date**: 2026-02-20

### Decision 2: happy-dom over jsdom

**Context**: Which DOM implementation for unit tests?

**Options Considered**:

1. **happy-dom** - Lightweight, fast, sufficient for React testing
2. **jsdom** - More complete DOM implementation, heavier

**Decision**: happy-dom

- Significantly faster test execution
- Sufficient for React component testing with Testing Library
- EC site validates this choice works well in practice

**Date**: 2026-02-20

### Decision 3: Chrome-Only Playwright

**Context**: Which browsers to test in E2E?

**Options Considered**:

1. **Chrome only** - Fastest, sufficient for smoke tests
2. **Chrome + Firefox + WebKit** - Full cross-browser coverage

**Decision**: Chrome only (to start)

- Smoke tests verify page rendering and navigation, not browser-specific quirks
- Keeps CI fast and simple
- Can add Firefox/WebKit later if cross-browser issues arise

**Date**: 2026-02-20

### Decision 4: Co-located Tests

**Context**: Where to put unit test files?

**Options Considered**:

1. **Co-located** - `Component.test.tsx` next to `Component.tsx`
2. **Separate `__tests__/`** - Test files in dedicated directories
3. **Top-level `tests/`** - All tests in project root

**Decision**: Co-located for unit tests, top-level `tests/` for E2E

- Unit tests next to source (easy to find, maintain, and enforce coverage)
- E2E tests in `tests/` directory (they test the built application, not individual modules)
- Matches EC site convention

**Date**: 2026-02-20

## Success Criteria

- [ ] `npm run test:run` executes unit tests and all pass
- [ ] `npm run test:coverage` generates coverage report to `var/coverage/`
- [ ] `npm run test:e2e` executes Playwright smoke tests and all pass
- [ ] `npm run llm:test` produces JSON output to `var/qa/vitest.json`
- [ ] All 5 pages (Home, About, Articles, ArticleDetail, Contact) have E2E smoke tests
- [ ] At least 3 components have unit tests (CategoryBadge, ArticleCard, Navigation)
- [ ] Custom `render()` wrapper with BrowserRouter available in `src/test-utils/`
- [ ] No test output committed to git (all in `var/` which is gitignored)

## Risks & Mitigations

| Risk                                                      | Impact | Probability | Mitigation                                      |
| --------------------------------------------------------- | ------ | ----------- | ----------------------------------------------- |
| Playwright browser install fails in CI                    | High   | Low         | Pin Playwright version, cache browser binaries  |
| happy-dom missing DOM APIs needed by components           | Medium | Low         | Fall back to jsdom if specific APIs missing     |
| Path alias mismatch between vite.config and vitest.config | Medium | Medium      | Share alias config or reference same source     |
| E2E tests flaky due to timing                             | Medium | Medium      | Use Playwright auto-waiting, add retries in CI  |
| Coverage thresholds block development                     | Low    | Low         | No enforced thresholds initially, add gradually |

## Timeline

Per PlanWorkflow guidance, no specific time estimates. Work proceeds in phases:

- **Phase 1**: Vitest Setup (install, configure, test-utils)
- **Phase 2**: Unit Test Foundation (first component tests, verify runner)
- **Phase 3**: Playwright Setup (install, configure)
- **Phase 4**: E2E Smoke Tests (all 5 pages + navigation)
- **Phase 5**: CI Integration & Documentation

**Target Completion**: When all success criteria met

## Notes & Updates

### 2026-02-20 - Plan Creation

- Plan created based on EC site reference implementation
- EC site dependencies reviewed for version pinning:
  - vitest `^4.0.16`, happy-dom `^20.1.0`
  - @testing-library/react `^16.3.1`, @testing-library/jest-dom `^6.9.1`
  - @testing-library/user-event `^14.6.1`
  - @playwright/test `^1.56.1`
- LTS Commerce currently has zero test infrastructure (confirmed via file search)
- 17 source files exist (5 pages, 8 components, App.tsx, main.tsx, routes.ts, data)
- EC site's mock registry pattern not needed (LTS has no registries)
- EC site's import.meta.env mock in setup.ts may be needed if components read env vars

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-02-20
**Plan Status**: 📋 Planned

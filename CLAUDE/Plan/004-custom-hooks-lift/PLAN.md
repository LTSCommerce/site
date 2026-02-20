# Plan 004: Custom React Hooks Lift from EC Site

**Status**: 📋 Planned
**Created**: 2026-02-20
**Owner**: Claude Code
**Priority**: Medium
**Type**: Code Lift / Integration
**Related**: Plan 001 (React Migration), Plan 007 (Component Library - hooks will be used there)

## ⚠️ Execution Workflow: Worktree Required

This plan **must** be executed using the git worktree workflow. Read the full documentation before starting any implementation:

**@CLAUDE/Worktree.md**

```bash
# Setup: create parent worktree before any implementation
git worktree add untracked/worktrees/worktree-plan-004 -b worktree-plan-004
```

- All implementation work happens inside the worktree — never directly in `/workspace`
- Child → Parent merges: automatic (no approval needed)
- Parent → `react-migration` merge: **requires explicit human approval**

## Overview

Lift battle-tested custom React hooks from the EC site (`untracked/ec-site/src/hooks/`) into the LTS Commerce site (`src/hooks/`). These hooks encapsulate common UI patterns -- viewport detection, responsive breakpoints, content rotation, and slideshow state management -- that are directly applicable to the LTS site's React components.

The EC site hooks are production-proven and well-documented. Rather than writing these patterns from scratch, lifting and adapting them saves effort and brings in tested, reliable code. Some hooks can be copied almost verbatim; others need adaptation to remove EC-specific type dependencies.

## Goals

1. **Lift proven hooks**: Copy all four EC site hooks into the LTS codebase with necessary adaptations
2. **SSR safety**: Ensure all hooks handle server-side rendering safely (check `typeof window` before browser API access)
3. **TypeScript strict mode**: All lifted hooks must pass TypeScript strict mode with zero errors
4. **Integration**: Wire hooks into relevant LTS components for immediate value
5. **Zero ESLint violations**: All code passes existing ESLint configuration

## Non-Goals

- **Not lifting the SSR utility module**: The EC site has a comprehensive `SSR` utility class (`src/utils/ssr.ts`). We will use simple `typeof window` guards instead, which is sufficient for the LTS site's needs
- **Not creating new hooks**: This plan only covers lifting existing EC hooks, not writing new ones
- **Not refactoring existing LTS hooks**: The three existing hooks (`useBodyLoaded`, `useMouseResponsiveEffects`, `useScrollAnimations`) are out of scope

## Context & Background

### EC Site Hooks (Source)

The EC site has four custom hooks in `untracked/ec-site/src/hooks/`:

| Hook | Purpose | Lines | Dependencies |
|------|---------|-------|-------------|
| `useInView` | Intersection Observer for scroll-triggered animations | 75 | React only |
| `useMediaQuery` | Responsive breakpoint detection via `matchMedia` | 73 | React, `@/utils/ssr` |
| `useCTARotation` | Auto-rotating CTA text with interval timer | 67 | React, `CTAVariant` type |
| `useSlideshow` | Full slideshow state with nav controls and auto-advance | 148 | React, `HeroVariant` type |

### LTS Site Hooks (Existing)

The LTS site already has three hooks in `src/hooks/`:

| Hook | Purpose | Notes |
|------|---------|-------|
| `useBodyLoaded` | FOUC prevention via body class | LTS-specific, no overlap |
| `useMouseResponsiveEffects` | Dynamic gradient/shadow from mouse position | LTS-specific, no overlap |
| `useScrollAnimations` | Scroll-triggered fade-in via Intersection Observer | Partial overlap with `useInView` |

### Key Observation: `useInView` vs `useScrollAnimations`

The LTS site already has `useScrollAnimations` which uses Intersection Observer, but it works by querying DOM classes (`.scroll-animate`) and directly manipulating styles. The EC site's `useInView` is a more composable, React-idiomatic approach that returns a `ref` and `isInView` boolean, letting components control their own animation logic. Both should coexist -- `useInView` is for per-component use, while `useScrollAnimations` is a page-level batch effect.

## Hook Analysis

### 1. `useInView` -- Intersection Observer Hook

**What it does**: Wraps the Intersection Observer API in a React hook. Returns a `ref` to attach to any element and an `isInView` boolean that becomes `true` when the element enters the viewport. Supports configurable threshold, root margin, and a `triggerOnce` option that disconnects the observer after first intersection.

**Why it's useful for LTS Commerce**:
- Scroll-triggered animations on the Home page (expertise cards, article grid, author section)
- Lazy loading content sections
- More React-idiomatic than the existing `useScrollAnimations` class-based approach
- Per-component granularity instead of page-level batch observation

**Adaptation needed**: None -- this hook is pure React with no external dependencies. Can be copied as-is.

**Components that would use it**:
- `Home.tsx` -- fade-in sections as user scrolls (expertise cards, latest articles, author section)
- `ArticleList.tsx` -- animate article cards on scroll
- `About.tsx` -- section reveal animations
- Any future component needing scroll-triggered visibility

### 2. `useMediaQuery` -- Responsive Breakpoint Detection

**What it does**: Uses `window.matchMedia` with React's `useSyncExternalStore` for proper SSR/hydration support. Subscribes to media query changes and returns a boolean indicating whether the query matches. Handles SSR by returning `false` on the server.

**Why it's useful for LTS Commerce**:
- Responsive behaviour in components (show/hide elements, change layouts)
- Replace any manual `window.innerWidth` checks with reactive media queries
- Proper hydration support via `useSyncExternalStore` (React 18+ best practice)
- Foundation for responsive Navigation component behaviour

**Adaptation needed**: Moderate -- the EC version imports `SSR` utility from `@/utils/ssr`. The LTS version should use inline `typeof window !== 'undefined'` checks instead, keeping the hook self-contained. The `useSyncExternalStore` pattern and overall structure remain the same.

**Components that would use it**:
- `Navigation.tsx` -- responsive menu behaviour (hamburger vs full nav)
- `Home.tsx` -- responsive layout adjustments
- `ArticleList.tsx` -- grid column changes
- Any component needing breakpoint-aware rendering

### 3. `useCTARotation` -- CTA Text Cycling

**What it does**: Manages automatic rotation through an array of CTA (Call-to-Action) variants at a configurable interval. Uses `setInterval` with proper cleanup. Supports autoplay toggle. Returns the current variant object.

**Why it's useful for LTS Commerce**:
- Rotating taglines or CTAs on the Home page hero section
- Cycling through service highlights or testimonial snippets
- Any content that benefits from periodic rotation

**Adaptation needed**: Moderate -- the EC version imports `CTAVariant` type from `@/pages/cta-variants`, which is EC-specific. The LTS version should use a generic type parameter `<T>` so it works with any array of items, making it more reusable.

**Components that would use it**:
- `Home.tsx` -- rotating hero taglines or expertise highlights
- Future footer CTA section
- Any component with cycling content

### 4. `useSlideshow` -- Slideshow State Management

**What it does**: Full slideshow state machine with auto-advance, manual navigation (next/prev/goTo), pause/resume, and circular wrapping. Uses `useCallback` for stable function references and proper interval cleanup. Returns current variant, index, and all control functions.

**Why it's useful for LTS Commerce**:
- Image/content slideshow on any page
- Project showcase carousel
- Article highlights rotation with manual override
- Any UI requiring slideshow-like navigation with auto-advance

**Adaptation needed**: Moderate -- same as `useCTARotation`, it imports an EC-specific `HeroVariant` type. The LTS version should use a generic type parameter `<T>` for reusability. The rest of the logic is framework-agnostic and can be copied directly.

**Components that would use it**:
- Future project showcase component
- Home page content carousel (if added)
- Any component needing slideshow behaviour with full controls

## Tasks

### Phase 1: Audit & Planning

- [ ] ⬜ **Review each EC hook**: Read source code, understand dependencies, identify adaptation points
- [ ] ⬜ **Map hook-to-component usage**: Determine which LTS components will use each hook
- [ ] ⬜ **Identify SSR patterns**: Document how each hook handles (or should handle) SSR safety
- [ ] ⬜ **Check for conflicts**: Ensure no naming or functionality conflicts with existing LTS hooks

### Phase 2: Copy & Adapt

- [ ] ⬜ **Lift `useInView`**: Copy to `src/hooks/useInView.ts` (no changes needed)
- [ ] ⬜ **Lift `useMediaQuery`**: Copy to `src/hooks/useMediaQuery.ts`, replace `SSR` utility with inline `typeof window` checks
- [ ] ⬜ **Lift `useCTARotation`**: Copy to `src/hooks/useCTARotation.ts`, replace `CTAVariant` with generic type parameter `<T>`
- [ ] ⬜ **Lift `useSlideshow`**: Copy to `src/hooks/useSlideshow.ts`, replace `HeroVariant` with generic type parameter `<T>`
- [ ] ⬜ **Update barrel export**: Add all four new hooks to `src/hooks/index.ts`
- [ ] ⬜ **Run QA checks**: TypeScript compilation, ESLint, build -- all must pass with zero errors

### Phase 3: Integration

- [ ] ⬜ **Integrate `useInView`**: Add scroll-triggered animations to Home page sections (expertise cards, articles, author)
- [ ] ⬜ **Integrate `useMediaQuery`**: Add responsive breakpoint detection to Navigation component
- [ ] ⬜ **Integrate `useCTARotation`**: Add rotating taglines to Home hero section (if content is available)
- [ ] ⬜ **Integrate `useSlideshow`**: Wire into a content carousel component (if applicable, may defer to Plan 007)

### Phase 4: Testing & Verification

- [ ] ⬜ **TypeScript strict mode**: Verify all hooks compile with zero errors under strict mode
- [ ] ⬜ **ESLint clean**: Run ESLint, fix any violations, confirm zero remaining
- [ ] ⬜ **Build verification**: Run `npm run build`, confirm successful production build
- [ ] ⬜ **SSR safety audit**: Verify no hooks access `window`, `document`, or other browser APIs outside of `useEffect` or guarded checks
- [ ] ⬜ **Manual testing**: Verify integrated hooks work correctly in the browser (scroll animations trigger, breakpoints respond, rotations cycle)

## Dependencies

- **Depends on**: Plan 001 Phase 5 (Complete) -- React component structure must exist for integration targets
- **Blocks**: Plan 007 (Component Library) -- lifted hooks will be used by components lifted in Plan 007
- **Related**: Plan 001 (React Migration) -- hooks are part of the broader React architecture

## Technical Decisions

### Decision 1: Inline SSR Guards vs SSR Utility Module

**Context**: The EC site's `useMediaQuery` imports a comprehensive `SSR` utility class. Should we lift that too?

**Options Considered**:
1. **Lift the full SSR utility** -- brings in a large, feature-rich module (320+ lines) with many hooks the LTS site doesn't need yet
2. **Inline `typeof window` guards** -- simple, self-contained, sufficient for current needs

**Decision**: Option 2 -- Inline guards. The LTS site currently has only a handful of hooks and doesn't need the full SSR utility infrastructure. Simple `typeof window !== 'undefined'` checks are clear, readable, and adequate. If the LTS site grows to need the full SSR utility, it can be lifted later.

**Date**: 2026-02-20

### Decision 2: Generic Type Parameters vs Concrete Types

**Context**: `useCTARotation` and `useSlideshow` import EC-specific types (`CTAVariant`, `HeroVariant`). How should we handle this?

**Options Considered**:
1. **Create equivalent LTS types** -- define `CTAVariant` and `HeroVariant` for LTS
2. **Use generic type parameter `<T>`** -- make hooks work with any item type
3. **Use `unknown`** -- lose type safety

**Decision**: Option 2 -- Generic type parameters. This makes the hooks truly reusable without coupling them to specific content types. Components can pass their own typed arrays and get full type inference.

**Date**: 2026-02-20

## Success Criteria

- [ ] All four hooks (`useInView`, `useMediaQuery`, `useCTARotation`, `useSlideshow`) present in `src/hooks/`
- [ ] All hooks exported from `src/hooks/index.ts` barrel file
- [ ] TypeScript strict mode: 0 errors
- [ ] ESLint: 0 violations
- [ ] Production build: successful
- [ ] No SSR/browser API issues (all browser API access guarded or inside `useEffect`)
- [ ] At least `useInView` and `useMediaQuery` integrated into LTS components

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| SSR/hydration mismatch with `useMediaQuery` | Medium | Low | Use `useSyncExternalStore` with server snapshot (proven pattern from EC site) |
| Overlap between `useInView` and existing `useScrollAnimations` | Low | Medium | Document that both coexist -- different use cases (per-component vs page-level) |
| Generic type parameter makes hooks less ergonomic | Low | Low | TypeScript inference handles most cases; add explicit examples in JSDoc |
| Lifted hooks may have subtle bugs in new context | Medium | Low | Thorough testing in Phase 4; hooks are well-tested in EC site already |
| Bundle size increase from additional hooks | Low | Low | Hooks are small (75-148 lines each); tree-shaking removes unused hooks |

## Timeline

Per PlanWorkflow guidance, no specific time estimates. Work proceeds in phases:

- **Phase 1**: Audit (quick review, mostly covered in this plan document)
- **Phase 2**: Copy & Adapt (primary implementation work)
- **Phase 3**: Integration (wire hooks into components)
- **Phase 4**: Testing & Verification (QA pass)

**Target Completion**: When all phases complete and success criteria met.

## Notes & Updates

### 2026-02-20 - Plan Creation

Analysed all four EC site hooks and three existing LTS hooks. Key findings:

- `useInView` can be lifted as-is (zero dependencies beyond React)
- `useMediaQuery` needs SSR utility replaced with inline guards
- `useCTARotation` and `useSlideshow` need generic type parameters to replace EC-specific types
- No conflicts with existing LTS hooks (`useBodyLoaded`, `useMouseResponsiveEffects`, `useScrollAnimations`)
- `useInView` and `useScrollAnimations` serve different use cases and should coexist

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-02-20
**Plan Status**: 📋 Planned

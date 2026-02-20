# Plan 007: Component Library Lift from EC Site

**Status**: 📋 Planned
**Created**: 2026-02-20
**Owner**: Claude Code
**Priority**: Medium
**Type**: Component Migration / UI Enhancement
**Related**: Plan 001 (React Migration), Plan 004 (Custom Hooks Lift)

## ⚠️ Execution Workflow: Worktree Required

This plan **must** be executed using the git worktree workflow. Read the full documentation before starting any implementation:

**@CLAUDE/Worktree.md**

```bash
# Setup: create parent worktree before any implementation
git worktree add untracked/worktrees/worktree-plan-007 -b worktree-plan-007
```

- All implementation work happens inside the worktree — never directly in `/workspace`
- Child → Parent merges: automatic (no approval needed)
- Parent → `react-migration` merge: **requires explicit human approval**

## Overview

Identify and adapt high-value reusable UI and section components from the EC site (`untracked/ec-site/src/components/`) for use in the LTS Commerce React site. The EC site has a mature, polished component library with animation effects, mobile-optimised layouts, and accessible patterns that would significantly enhance the LTS site's visual quality and user experience.

This is a selective lift -- not a wholesale copy. LTS Commerce is a personal PHP engineer portfolio, not an e-commerce consultancy site. We only adopt components that are genuinely useful for a portfolio site, and we strip out all EC-specific business logic (CSI categories, citation systems, Zod validation, etc.).

## Goals

1. **Enhance LTS visual quality** with proven animation components (BlurText, Typewriter effects)
2. **Adopt mobile-first patterns** from EC site's carousel/grid system
3. **Build a reusable component library** for LTS-specific use cases
4. **Minimise bundle size impact** -- only adopt what we actually use

## Non-Goals

- **Not copying EC business components**: No CaseStudyGrid, ResearchGrid, ServicePricing, PolicyContent
- **Not copying CSI category system**: LTS uses its own category system (PHP, Infrastructure, Database, AI, TypeScript)
- **Not copying Zod validation**: LTS does not need DEV-mode runtime prop validation at this stage
- **Not copying citation system**: No SourceCitation, CitationData, or research page linking
- **Not duplicating Flowbite React**: LTS already has Flowbite React installed -- don't recreate what it provides
- **Not copying the Cloudflare Worker components**: Separate plan if ever needed

## Context & Background

### Current LTS Component State

LTS Commerce currently has 10 components across 3 categories:

- **Layout** (4): Page, Container, Section, Navigation, Footer
- **Content** (3): Hero, Prose, CategoryBadge
- **Article** (2): ArticleCard, ArticleContent

The Home page uses basic HTML cards for the expertise grid, with no animations, no mobile carousel, and no visual polish beyond basic Tailwind classes.

### EC Site Component Library

The EC site has 61+ components across 5 categories with extensive mobile optimisation, animation effects, accessibility features, and visual polish. Key patterns worth adopting:

- **Text animations**: Typewriter, BlurText, WhiteToRedTypewriter -- proven, GPU-accelerated, accessible
- **Mobile carousel**: MobileCarouselGrid with Embla -- saves ~750px vertical scroll per section
- **Feature grid**: ThreeColumnFeatures -- exactly what LTS needs for the expertise section
- **Status badges**: Terminal-style badges for section headers
- **Universal icons**: Icon component supporting Lucide + SVG

### Dependency Analysis

Components from EC site depend on:
- `useMediaQuery` hook (from EC site -- covered by Plan 004)
- `embla-carousel-react` (new dependency, ~12KB gzipped)
- `lucide-react` (LTS likely needs this anyway)
- EC-specific utilities: `@/utils/csi`, `@/utils/zodValidation`, `@/types/csi` -- must be stripped

## Component Audit

### UI Components -- Detailed Evaluation

#### 1. BlurText -- ADOPT (Low Adaptation)

**What it does**: Animates content with blur-to-clear fade-in effect using CSS transitions. Disables on phones (<768px) and when `prefers-reduced-motion` is set.

**EC Location**: `src/components/ui/BlurText.tsx` (95 lines)

**LTS Use Case**: Hero subtitle reveal, section content entrance animations, article card hover effects.

**Dependencies**: `useMediaQuery` hook (Plan 004)

**Adaptation Needed**: Low
- Remove EC `@/hooks/useMediaQuery` import path, use LTS path
- No other changes needed -- component is already generic

---

#### 2. Typewriter -- ADOPT (Low Adaptation)

**What it does**: Character-by-character typing animation with configurable speed, delay, and type/delete modes. Disables on mobile and reduced-motion.

**EC Location**: `src/components/ui/typewriter.tsx` (132 lines)

**LTS Use Case**: Hero heading animation, section title reveals on scroll.

**Dependencies**: `useMediaQuery` hook (Plan 004)

**Adaptation Needed**: Low
- Update import path for `useMediaQuery`
- No other changes needed

---

#### 3. WhiteToRedTypewriter -- ADOPT (Medium Adaptation)

**What it does**: Typewriter with smooth colour transition on a highlighted portion of text. In EC site, transitions from white to CSI category colours. Requires the base Typewriter component.

**EC Location**: `src/components/ui/WhiteToRedTypewriter.tsx` (143 lines)

**LTS Use Case**: Hero heading with brand colour emphasis (e.g., "Bespoke PHP Development" with "PHP" highlighted in brand blue).

**Dependencies**: Typewriter component, CSICategory type (EC-specific)

**Adaptation Needed**: Medium
- Remove CSI category colour system entirely
- Replace with simple colour prop (string hex value or preset name)
- Rename to `HighlightTypewriter` or `ColourTypewriter` to avoid EC branding
- Remove `highlightColour` CSICategory prop, replace with `highlightColour: string` (hex code)
- Default colour to LTS brand blue (`#0f4c81`) instead of EC red

---

#### 4. StatusBadge -- ADOPT (Medium Adaptation)

**What it does**: Terminal-style status indicator badge with optional pulsing dot and typewriter text animation. Hidden on mobile in EC site.

**EC Location**: `src/components/ui/StatusBadge.tsx` (95 lines)

**LTS Use Case**: Section headers (e.g., "> Core Expertise", "> Latest Articles"), status indicators.

**Dependencies**: Typewriter component, CSICategory type (EC-specific), `getCategoryColour` utility

**Adaptation Needed**: Medium
- Remove CSI category system (`csi` prop, `getCategoryColour`)
- Keep `variant` prop (primary/secondary) with LTS colours
- Remove `children?: never` ESLint enforcement (LTS doesn't have that rule yet)
- Update colour classes to match LTS design tokens
- Consider making it visible on mobile (EC hides it via `hidden md:inline-flex`)

---

#### 5. ThreeColumnFeatures -- ADOPT (High Adaptation)

**What it does**: Three-column feature showcase with rotating brand colours, staggered animations, optional list items, and Embla carousel on mobile. Exactly 3 features enforced by TypeScript tuple.

**EC Location**: `src/components/ui/ThreeColumnFeatures.tsx` (387 lines)

**LTS Use Case**: Home page "Core Expertise" section -- currently using basic HTML cards. This would be a major visual upgrade.

**Dependencies**: CardTitle, SubHeading, Icon, carousel (Embla), CSICategory, RouteEntry, Zod validation, `validateProps`, `getCategoryColour`, `getCategoryPath`

**Adaptation Needed**: High
- Strip CSI category system entirely (colours, paths, getCategoryColour)
- Strip Zod validation (ThreeColumnFeaturesPropsSchema, validateProps)
- Strip CarouselIconIndicators (or simplify to dot indicators)
- Replace EC carousel component with direct Embla integration or simplified version
- Replace CardTitle/SubHeading with LTS equivalents or inline the styling
- Remove `linkToCategories` prop (EC-specific)
- Simplify colour scheme to LTS brand palette
- Keep: mobile carousel pattern, staggered animations, feature card structure

---

#### 6. Icon -- SKIP

**What it does**: Universal icon renderer supporting Lucide, Simple Icons (slug registry), custom SVGs, and TechIcon type.

**EC Location**: `src/components/ui/Icon.tsx` (304 lines)

**LTS Use Case**: Limited. LTS can use Lucide icons directly.

**Why Skip**: Heavily coupled to EC's technology registry (`@/data/technologies`), Simple Icons registry (`@/lib/icon-registry`), and TechIcon type system. The complexity is not justified for a portfolio site that only needs Lucide icons. If LTS needs Simple Icons later, a simpler wrapper can be built.

---

#### 7. MobileCarouselGrid -- ADOPT (Medium Adaptation)

**What it does**: Generic wrapper that renders children as an Embla carousel on mobile (<768px) and a CSS grid on desktop. Includes dot indicators and snap navigation.

**EC Location**: `src/components/ui/MobileCarouselGrid.tsx` (224 lines)

**LTS Use Case**: Article cards on mobile, expertise cards, any multi-card section that would benefit from horizontal scrolling on mobile instead of vertical stacking.

**Dependencies**: Embla carousel components, Zod validation

**Adaptation Needed**: Medium
- Strip Zod validation (MobileCarouselGridPropsSchema, validateProps)
- Copy the carousel base components (Embla wrapper) or install `embla-carousel-react` and create a minimal carousel wrapper
- Keep: mobile/desktop split pattern, dot indicators, Embla configuration

---

### Section Components -- Detailed Evaluation

#### 8. ServicePageHero -- SKIP

**What it does**: Complex hero section with typewriter, metrics grid with hover tooltips, citations, and mobile carousel for stats.

**EC Location**: `src/components/sections/ServicePageHero.tsx` (829 lines)

**Why Skip**: Extremely EC-specific. 829 lines of code tightly coupled to EC's citation system, CSI categories, metric tooltips, and service page patterns. LTS already has a Hero component. The useful patterns (typewriter in hero) can be achieved by composing BlurText + Typewriter directly in the LTS Hero component.

---

#### 9. ServiceGrid -- SKIP

**What it does**: Responsive grid of service cards with CSI colour coding, hover effects, and mobile carousel.

**EC Location**: `src/components/sections/ServiceGrid.tsx` (546 lines)

**Why Skip**: Tightly coupled to EC's service/CSI model. LTS doesn't have "services" in the same way. The generic mobile carousel pattern is better obtained from MobileCarouselGrid (component #7).

---

#### 10. ServiceBenefits -- SKIP

**What it does**: Benefits grid with hover tooltips, citations, and mobile carousel.

**EC Location**: `src/components/sections/ServiceBenefits.tsx` (666 lines)

**Why Skip**: EC-specific service page pattern with citation system, hover intent detection, and benefit cards. Too specialised for a portfolio site.

---

### Summary Table

| Component | Decision | Adaptation | Dependencies Added | Bundle Impact |
|-----------|----------|------------|-------------------|---------------|
| BlurText | ADOPT | Low | useMediaQuery (Plan 004) | ~1KB |
| Typewriter | ADOPT | Low | useMediaQuery (Plan 004) | ~2KB |
| WhiteToRedTypewriter | ADOPT | Medium | Typewriter | ~1KB |
| StatusBadge | ADOPT | Medium | Typewriter | ~1KB |
| ThreeColumnFeatures | ADOPT | High | Embla carousel | ~8KB |
| Icon | SKIP | -- | -- | -- |
| MobileCarouselGrid | ADOPT | Medium | Embla carousel | ~4KB |
| ServicePageHero | SKIP | -- | -- | -- |
| ServiceGrid | SKIP | -- | -- | -- |
| ServiceBenefits | SKIP | -- | -- | -- |

**Estimated total bundle impact**: ~17KB (before tree-shaking), ~12KB gzipped

## Tasks

### Phase 1: Audit & Dependency Resolution

- [ ] ⬜ **Verify Plan 004 status**: Confirm `useMediaQuery` hook is available in LTS (dependency for BlurText, Typewriter)
- [ ] ⬜ **Install Embla Carousel**: `npm install embla-carousel-react` for MobileCarouselGrid and ThreeColumnFeatures
- [ ] ⬜ **Install Lucide React**: `npm install lucide-react` for icon usage in components (if not already available via Flowbite)
- [ ] ⬜ **Record baseline bundle size**: Run `npm run build` and document current bundle size for before/after comparison
- [ ] ⬜ **Create component directories**: `src/components/ui/` for new UI components

### Phase 2: Low-Effort Component Lift (BlurText, Typewriter)

- [ ] ⬜ **Copy and adapt BlurText**:
  - [ ] ⬜ Copy `BlurText.tsx` to `src/components/ui/BlurText.tsx`
  - [ ] ⬜ Update `useMediaQuery` import path to LTS location
  - [ ] ⬜ Verify TypeScript strict mode compliance
  - [ ] ⬜ Test: renders without error, animation triggers on desktop, instant on mobile
- [ ] ⬜ **Copy and adapt Typewriter**:
  - [ ] ⬜ Copy `typewriter.tsx` to `src/components/ui/Typewriter.tsx`
  - [ ] ⬜ Update `useMediaQuery` import path to LTS location
  - [ ] ⬜ Verify TypeScript strict mode compliance
  - [ ] ⬜ Test: character-by-character animation works, mobile shows instant text

### Phase 3: Medium-Effort Component Lift (WhiteToRedTypewriter, StatusBadge)

- [ ] ⬜ **Adapt WhiteToRedTypewriter**:
  - [ ] ⬜ Copy to `src/components/ui/HighlightTypewriter.tsx` (renamed)
  - [ ] ⬜ Remove CSI category colour system entirely
  - [ ] ⬜ Replace `highlightColour: CSICategory` with `highlightColour?: string` (hex code)
  - [ ] ⬜ Default highlight colour to LTS brand blue (`#0f4c81`)
  - [ ] ⬜ Remove EC-specific imports (`@/types/csi`)
  - [ ] ⬜ Verify TypeScript strict mode compliance
  - [ ] ⬜ Test: text types, highlight portion transitions to specified colour
- [ ] ⬜ **Adapt StatusBadge**:
  - [ ] ⬜ Copy to `src/components/ui/StatusBadge.tsx`
  - [ ] ⬜ Remove CSI category system (`csi` prop, `getCategoryColour`)
  - [ ] ⬜ Remove `children?: never` pattern (no ESLint rule for it in LTS)
  - [ ] ⬜ Update colour classes to LTS design tokens
  - [ ] ⬜ Decide: visible on mobile or hidden (EC hides via `hidden md:inline-flex`)
  - [ ] ⬜ Verify TypeScript strict mode compliance

### Phase 4: High-Effort Component Lift (Embla Carousel, ThreeColumnFeatures, MobileCarouselGrid)

- [ ] ⬜ **Create Embla carousel wrapper**:
  - [ ] ⬜ Create minimal `src/components/ui/Carousel.tsx` based on EC's `carousel.tsx`
  - [ ] ⬜ Strip shadcn/ui specific utilities (e.g., `cn()` helper) -- use simple template literals
  - [ ] ⬜ Include: Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext
  - [ ] ⬜ Include: CarouselApi type export for external state tracking
- [ ] ⬜ **Adapt MobileCarouselGrid**:
  - [ ] ⬜ Copy to `src/components/ui/MobileCarouselGrid.tsx`
  - [ ] ⬜ Remove Zod validation (validateProps, schema)
  - [ ] ⬜ Import from LTS Carousel wrapper
  - [ ] ⬜ Keep: dot indicators, mobile/desktop split, Embla options
  - [ ] ⬜ Verify TypeScript strict mode compliance
  - [ ] ⬜ Test: renders grid on desktop, carousel on mobile
- [ ] ⬜ **Adapt ThreeColumnFeatures**:
  - [ ] ⬜ Copy to `src/components/ui/ThreeColumnFeatures.tsx`
  - [ ] ⬜ Remove CSI category system (colours, paths, getCategoryColour, getCategoryPath)
  - [ ] ⬜ Remove Zod validation (schemas, validateProps)
  - [ ] ⬜ Remove `linkToCategories` prop and category linking logic
  - [ ] ⬜ Replace Icon component usage with direct Lucide icon rendering
  - [ ] ⬜ Replace CardTitle/SubHeading with inline or LTS equivalents
  - [ ] ⬜ Simplify colour scheme to 3 fixed accent colours from LTS palette
  - [ ] ⬜ Keep: mobile carousel, staggered animations, feature card structure, hover effects
  - [ ] ⬜ Verify TypeScript strict mode compliance
  - [ ] ⬜ Test: 3-column grid on desktop, carousel on mobile, animations trigger

### Phase 5: Integrate into LTS Pages

- [ ] ⬜ **Enhance Home page Hero**:
  - [ ] ⬜ Replace plain text heading with HighlightTypewriter
  - [ ] ⬜ Add BlurText to subtitle
  - [ ] ⬜ Add StatusBadge above hero content
- [ ] ⬜ **Replace Home page expertise grid**:
  - [ ] ⬜ Replace 6 basic HTML `<article>` cards with ThreeColumnFeatures (2 instances of 3, or refactor to support 6)
  - [ ] ⬜ Or use MobileCarouselGrid wrapping custom expertise cards
  - [ ] ⬜ Add Lucide icons to each expertise card
- [ ] ⬜ **Enhance Article list**:
  - [ ] ⬜ Consider wrapping article cards in MobileCarouselGrid for mobile (if appropriate)
- [ ] ⬜ **Verify all pages still render**: Build and review all routes

### Phase 6: Quality Assurance

- [ ] ⬜ **TypeScript validation**: `npm run type-check` -- 0 errors
- [ ] ⬜ **ESLint validation**: `npm run lint` -- 0 violations
- [ ] ⬜ **Build validation**: `npm run build` -- successful
- [ ] ⬜ **Record final bundle size**: Document size and compare with Phase 1 baseline
- [ ] ⬜ **Visual review**: Check all pages render correctly (build + preview)
- [ ] ⬜ **Mobile review**: Verify carousel behaviour on narrow viewports
- [ ] ⬜ **Accessibility check**: Verify `prefers-reduced-motion` disables animations
- [ ] ⬜ **Commit**: Commit all adopted components with clear commit message

## Dependencies

- **Depends on**:
  - Plan 001 Phase 5 complete ✅ (React site with all pages converted)
  - Plan 004 (Custom Hooks Lift) -- `useMediaQuery` hook needed by BlurText and Typewriter
- **Blocks**: Nothing directly, but enhances visual quality for all future work
- **Related**:
  - Plan 001 (React Migration) -- this builds on the component structure established there
  - Plan 004 (Custom Hooks Lift) -- provides the `useMediaQuery` hook dependency

## Technical Decisions

### Decision 1: Selective Copy vs. Package Extraction
**Context**: How to bring EC components into LTS?

**Options Considered**:
1. Copy individual files and adapt -- simple, direct control
2. Create shared npm package -- reusable but high overhead
3. Git submodule -- complex, fragile

**Decision**: Option 1 -- Copy and adapt individual files
- LTS is a single project, not a multi-project ecosystem
- Adaptation is significant enough that shared code would diverge quickly
- Simplest approach for a portfolio site

**Date**: 2026-02-20

### Decision 2: Embla Carousel vs. Alternatives
**Context**: MobileCarouselGrid and ThreeColumnFeatures need a carousel library.

**Options Considered**:
1. Embla Carousel (~12KB gzipped) -- used by EC site, proven
2. Swiper (~40KB) -- heavier, more features
3. Native CSS scroll-snap -- lighter but no programmatic control
4. Flowbite carousel -- already installed as dependency

**Decision**: Embla Carousel (embla-carousel-react)
- Proven in EC site with no issues
- Lightweight at ~12KB gzipped
- Good TypeScript support
- Programmatic API for dot indicators and navigation

**Date**: 2026-02-20

### Decision 3: Rename WhiteToRedTypewriter
**Context**: EC component name references EC branding (white-to-red = EC brand colour).

**Decision**: Rename to `HighlightTypewriter`
- Generic name reflects actual functionality (typewriter with colour highlight)
- No reference to EC brand colours
- `highlightColour` prop accepts any hex code
- Default colour is LTS brand blue (`#0f4c81`)

**Date**: 2026-02-20

## Success Criteria

- [ ] All adopted components pass TypeScript strict mode (0 errors)
- [ ] ESLint: 0 violations
- [ ] At least BlurText + HighlightTypewriter integrated into Home page Hero
- [ ] ThreeColumnFeatures or MobileCarouselGrid integrated into Home page expertise section
- [ ] Bundle size increase documented and under 20KB gzipped
- [ ] Animations disabled when `prefers-reduced-motion` is set
- [ ] Mobile carousel works correctly on narrow viewports

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Bundle size bloat from Embla | Medium | Medium | Tree-shake aggressively, measure before/after, consider native scroll-snap as fallback |
| useMediaQuery not ready (Plan 004 dependency) | High | Low | Can implement a minimal version inline if Plan 004 is delayed |
| Component styling conflicts with Flowbite/Tailwind | Medium | Medium | Test thoroughly, use scoped class names, avoid global style overrides |
| Carousel breaks on specific mobile viewports | Medium | Low | Test on multiple viewport widths, Embla has good mobile track record |
| TypeScript strict mode violations in adapted code | Low | Medium | EC components already use TypeScript, main risk is removing EC types without replacing |

## Timeline

Per PlanWorkflow guidance, no specific time estimates. Work proceeds in phases:

- **Phase 1**: Audit & Dependency Resolution (blocked by Plan 004 for useMediaQuery)
- **Phase 2**: Low-Effort Components (BlurText, Typewriter)
- **Phase 3**: Medium-Effort Components (HighlightTypewriter, StatusBadge)
- **Phase 4**: High-Effort Components (Carousel, ThreeColumnFeatures, MobileCarouselGrid)
- **Phase 5**: Integration into LTS Pages
- **Phase 6**: Quality Assurance

**Target Completion**: When all phases complete and success criteria met

## Notes & Updates

### 2026-02-20 - Plan Creation

Component audit completed. Reviewed all 43 UI components and 23 section components from EC site. Selected 6 components for adoption (BlurText, Typewriter, WhiteToRedTypewriter, StatusBadge, ThreeColumnFeatures, MobileCarouselGrid) and rejected 4 (Icon, ServicePageHero, ServiceGrid, ServiceBenefits).

Key insight: The EC site's components are heavily coupled to EC-specific systems (CSI categories, Zod validation, citation system, technology registry). Adaptation requires stripping these systems rather than just changing import paths. The adopted components are the ones where the generic functionality (animations, carousel, feature grid) is clearly separable from EC business logic.

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-02-20

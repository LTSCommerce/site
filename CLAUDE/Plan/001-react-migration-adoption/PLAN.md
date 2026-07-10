# Plan 001: React Migration & Claude Code Infrastructure Adoption

**Status**: 🔄 In Progress
**Created**: 2025-12-11
**Last Updated**: 2026-01-22
**Owner**: Claude Code
**Priority**: High
**Type**: Major Migration / Infrastructure Overhaul
**Related**: Plan 002 (React Site Skeleton - Completed)

## Status Update (2026-01-22)

### Completed Phases:

✅ **Phase 1: Foundation & Documentation** - All infrastructure set up, legacy system archived
✅ **Phase 2: Build System Migration** - React Site Skeleton successfully applied
✅ **Phase 3: Type-Safe Routing System** - Complete type-safe routing with React Router
✅ **Phase 4: Component Structure Setup** - Full component library with article system
✅ **Phase 5: Convert Core Templates to React** - All pages converted, filtering & search implemented

### Phase 1 Summary:

- Created react-migration branch
- Copied essential Claude Code documentation (PlanWorkflow, Worktree)
- Created Plan 001 and Plan 002 (concurrent skeleton development)
- Archived legacy EJS/Vite system to ARCHIVE/
- All legacy content preserved for migration

### Phase 2 Summary:

- Applied react-site-skeleton foundation (from Plan 002)
- Installed React 18, TypeScript 5.6, Vite 6
- Configured TypeScript strict mode
- Set up ESLint with 3 custom type-safety rules
- Created src/ structure with components, pages, types
- Created LTS-specific categories data object (PHP, Infrastructure, Database, AI, TypeScript)
- Built CategoryBadge component demonstrating type-safe patterns
- Configured use-types-not-strings ESLint rule for CATEGORIES
- All QA checks passing (type-check, build, lint)

### Phase 3 Summary:

- Fixed ESLint configuration (regex pattern as string, ignore directories)
- Verified type-safe routing system from skeleton
- Routes configured: Home (/), About (/about), Articles (/articles), Contact (/contact)
- Dynamic route generators: getArticleRoute(), getCategoryRoute()
- React Router configured with BrowserRouter
- Type definitions: RouteEntry, LinkDestination, HashLink, ExternalLink, ContactLink
- Helper functions: getLinkPath(), isHashLink(), isExternalLink(), isRouteEntry()
- All QA checks passing (TypeScript: 0 errors, ESLint: 0 violations, Build: successful)

### Phase 4 Summary:

- Created missing directories: src/articles/, src/assets/, src/components/article/
- Built Footer component with type-safe social links and navigation
- Created Article type system: Article, ArticlePreview interfaces with type guards
- Built ArticleCard component with category badges, date formatting, hover effects
- Created sample article data (5 articles across all categories)
- Built ArticleList page with responsive grid layout
- Built ArticleDetail page with full article display and metadata
- Updated App.tsx with article routing (/articles, /articles/:slug)
- Integrated Footer into Page component layout
- All QA checks passing (TypeScript: 0 errors, ESLint: 0 violations, Build: successful)

### Phase 5 Summary - ✅ COMPLETE:

- ✅ Base Layout: Page, Navigation, Footer all complete with SEO meta
- ✅ Home Page: Hero, expertise cards, latest articles, author section complete
- ✅ About Page: Full content migrated from legacy EJS
- ✅ Contact Page: Full form with validation, social links
- ✅ ArticleList: Grid, cards, **category filter buttons**, and **search input** complete
- ✅ ArticleDetail: Header complete (content rendering is Phase 6 scope)
- ✅ All QA checks passing (TypeScript: 0 errors, Build: successful, Bundle: 218KB)

### Next Phase:

**Phase 6: Article System Migration** - Migrate 25+ articles from legacy with content and syntax highlighting

## Overview

Migrate the LTS Commerce static site from EJS/Vite architecture to React/TypeScript, adopting the PlanWorkflow system and development practices that enable efficient AI-assisted development.

This is not just a technology migration—it's adopting a structured approach to development:

- **PlanWorkflow system** for trackable, multi-phase development
- **Worktree workflows** for parallel development when needed
- **Type-safe React/TypeScript** for better code quality and AI assistance

The current LTS site is a PHP engineer's portfolio using EJS templates. We're migrating to React/TypeScript for better type safety, component reusability, and more effective AI collaboration.

## Goals

1. **Adopt PlanWorkflow System**: All future work follows documented plans with phase tracking
2. **Migrate to React/TypeScript**: Convert EJS templates to type-safe React components
3. **Maintain Content Quality**: Preserve all existing PHP-focused articles and content
4. **Type-Safe Architecture**: Leverage TypeScript for better DX and fewer runtime errors
5. **Component-Driven Design**: Adopt reusable, tested component library approach

## Non-Goals

- **Not changing brand focus**: Still PHP engineer portfolio
- **Not discarding existing content**: All current articles and pages preserved
- **Not rushing to production**: Thorough testing before deployment
- **Not copying business strategy**: Tech migration only

## Context & Background

### Current State (LTS Commerce Site)

**Technology Stack:**

- Build: Vite 5.x with custom EJS preprocessing
- Templating: EJS (server-side templates)
- Frontend: Vanilla JavaScript, CSS3
- Content: Article system with syntax highlighting
- Deployment: GitHub Actions → GitHub Pages

**Limitations:**

- No type safety (vanilla JS)
- Template duplication across articles
- Limited component reusability
- Manual workflow management

### Target State

**Technology Stack:**

- Build: Vite with React/TypeScript
- Frontend: React 18 + TypeScript 5
- Routing: Type-safe route system
- Components: Reusable component library
- Quality: ESLint + Prettier
- Testing: Playwright smoke tests

**Development Infrastructure:**

- **PlanWorkflow system** for structured development
- **Worktree support** for parallel development
- **Type-safe architecture** throughout

### Skeleton Approach (Plan 002)

**Strategy**: Use `react-site-skeleton` repository as foundation

- **Plan 002** builds the generic skeleton concurrently
- Skeleton provides: Type-safe routing, ESLint rules, minimal components, Claude infrastructure
- **This plan** applies skeleton and builds LTS-specific components/content
- **Archive legacy**: Current build system moved to ARCHIVE/ for reference

**Benefits**:

- Proven patterns from skeleton
- Avoid copying ec-site design
- LTS site gets bespoke components
- Skeleton reusable for future projects

## Tasks

### Phase 1: Foundation & Documentation - 🔄 IN PROGRESS

- [x] ✅ **Clone EC-Site Repository**: Clone into `./untracked/` for reference
- [x] ✅ **Create Migration Branch**: `react-migration` branch for all migration work
- [x] ✅ **Set Up Gitignore**: Belt-and-braces approach with self-excluding `untracked/.gitignore`
- [x] ✅ **Copy Essential Documentation**:
  - [x] ✅ PlanWorkflow.md (planning system)
  - [x] ✅ Worktree.md (parallel development)
  - [x] ✅ HooksFrontController.md (hooks documentation)
  - [x] ✅ Plan/CLAUDE.md (plan numbering instructions)
- [x] ✅ **Create Plan 001**: Document migration approach
- [x] ✅ **Create Plan 002**: Document skeleton repo approach (concurrent plan)
- [x] ✅ **Create Plan README**: Index of all plans
- [x] ✅ **Commit Foundation**: Commit selective infrastructure
- [ ] ⬜ **Archive Legacy Build System**:
  - [ ] ⬜ Create ARCHIVE/ directory
  - [ ] ⬜ Move private_html/ to ARCHIVE/
  - [ ] ⬜ Move scripts/ to ARCHIVE/
  - [ ] ⬜ Move current vite.config.js to ARCHIVE/
  - [ ] ⬜ Move current package.json to ARCHIVE/
  - [ ] ⬜ Document what was archived
- [ ] ⬜ **Wait for Skeleton Phase 4**: Type-safe routing and ESLint from Plan 002

### Phase 2: Build System Migration

- [ ] ⬜ **Review Current Build System**: Understand existing Vite + EJS setup
- [ ] ⬜ **Install React Dependencies**:
  - [ ] ⬜ react, react-dom
  - [ ] ⬜ @types/react, @types/react-dom
- [ ] ⬜ **Install TypeScript**:
  - [ ] ⬜ typescript
  - [ ] ⬜ @types/node
  - [ ] ⬜ tsconfig.json configuration
- [ ] ⬜ **Adapt Vite Config**:
  - [ ] ⬜ Multi-entry setup for pages
  - [ ] ⬜ TypeScript support
  - [ ] ⬜ React plugin
  - [ ] ⬜ Asset optimization
  - [ ] ⬜ Remove EJS preprocessing
- [ ] ⬜ **Configure TypeScript**:
  - [ ] ⬜ Strict mode enabled
  - [ ] ⬜ Path aliases configured
- [ ] ⬜ **Update npm Scripts**:
  - [ ] ⬜ build, dev, preview
  - [ ] ⬜ lint, type-check

### Phase 3: Type-Safe Routing System - ✅ COMPLETED

- [x] ✅ **Design Route Structure**:
  - [x] ✅ Home (/)
  - [x] ✅ About (/about)
  - [x] ✅ Articles (/articles)
  - [x] ✅ Article Detail (/articles/:slug) - via getArticleRoute()
  - [x] ✅ Contact (/contact)
- [x] ✅ **Create Route System**:
  - [x] ✅ src/routes.ts (route definitions)
  - [x] ✅ src/types/routing.ts (type definitions)
  - [x] ✅ Helper functions (getLinkPath, type guards)
- [x] ✅ **Configure Route Types**:
  - [x] ✅ RouteEntry interface (simpler than originally planned)
  - [x] ✅ LinkDestination union (covers all link types)
  - [x] ✅ Type guards for runtime checking

### Phase 4: Component Structure Setup - ✅ COMPLETED

- [x] ✅ **Create src/ Directory Structure**:
  ```
  src/
  ├── components/       # Reusable UI components
  │   ├── layout/       # Page, Container, Section, Navigation, Footer
  │   ├── content/      # Hero, Prose, CategoryBadge
  │   └── article/      # ArticleCard
  ├── pages/           # Page components (Home, About, Contact, ArticleList, ArticleDetail)
  ├── articles/        # Article content (created, ready for Phase 6)
  ├── types/           # TypeScript types (routing.ts, article.ts)
  ├── data/            # Data files (categories.ts, articles.ts)
  ├── styles/          # Global styles
  ├── assets/          # Static assets
  └── routes.ts        # Route definitions
  ```
- [x] ✅ **Set Up Component Categories**:
  - [x] ✅ Layout components (Page, Container, Section, Navigation, Footer)
  - [x] ✅ Article components (ArticleCard, sample data)
  - [x] ✅ Content components (Hero, Prose, CategoryBadge)

### Phase 5: Convert Core Templates to React - ✅ COMPLETE

- [x] ✅ **Convert Base Layout**:
  - [x] ✅ Layout component (Page.tsx with SEO meta)
  - [x] ✅ Navigation component (type-safe routing)
  - [x] ✅ Footer component (social links, navigation)
  - [x] ✅ SEO meta component (integrated in Page.tsx)
- [x] ✅ **Convert Home Page**:
  - [x] ✅ Hero section (Hero component with CTA)
  - [x] ✅ Featured articles (latest 3 articles)
  - [x] ✅ Skills section (6 expertise cards)
  - [x] ✅ Published Author section (book highlight)
- [x] ✅ **Convert Articles List Page**:
  - [x] ✅ Article grid (responsive layout)
  - [x] ✅ Category filter (6 filter buttons with active state)
  - [x] ✅ Search functionality (search by title/description)
  - [x] ✅ Article card (ArticleCard component complete)
- [x] ✅ **Convert Article Detail**:
  - [x] ✅ Article header (category badge, meta info)
  - [x] ✅ Content renderer (placeholder for Phase 6 migration)
  - [x] ✅ Syntax highlighting (deferred to Phase 6 with real content)
- [x] ✅ **Convert About Page** (full content match with legacy)
- [x] ✅ **Convert Contact Page** (full form with validation)

### Phase 6: Article System Migration

- [ ] ⬜ **Design Article Data Structure**:
  - [ ] ⬜ TypeScript interfaces
  - [ ] ⬜ Article metadata
  - [ ] ⬜ Content format (MDX vs HTML vs React)
- [ ] ⬜ **Migrate Existing Articles**:
  - [ ] ⬜ Convert metadata
  - [ ] ⬜ Convert content
  - [ ] ⬜ Preserve syntax highlighting
- [ ] ⬜ **Article Registration**:
  - [ ] ⬜ Auto-discover system
  - [ ] ⬜ Type-safe references

### Phase 7: Styling Migration

- [ ] ⬜ **Evaluate Current Styles**
- [ ] ⬜ **Set Up Styling System** (Tailwind or CSS Modules TBD)
- [ ] ⬜ **Migrate Core Styles**:
  - [ ] ⬜ Layout
  - [ ] ⬜ Typography
  - [ ] ⬜ Components
  - [ ] ⬜ Articles
- [ ] ⬜ **Preserve Custom Features**:
  - [ ] ⬜ Syntax highlighting styles
  - [ ] ⬜ Category colors
  - [ ] ⬜ Responsive design

### Phase 8: Quality Assurance

- [ ] ⬜ **Set Up Testing**:
  - [ ] ⬜ Playwright configuration
  - [ ] ⬜ Smoke tests
- [ ] ⬜ **ESLint Configuration**:
  - [ ] ⬜ React rules
  - [ ] ⬜ TypeScript rules
  - [ ] ⬜ Run and fix violations
- [ ] ⬜ **TypeScript Validation**:
  - [ ] ⬜ Strict mode compliance
  - [ ] ⬜ Zero type errors
- [ ] ⬜ **Visual Testing**:
  - [ ] ⬜ Screenshots of current site
  - [ ] ⬜ Screenshots of new site
  - [ ] ⬜ Compare
- [ ] ⬜ **Cross-Browser Testing**
- [ ] ⬜ **Mobile Responsiveness**

### Phase 9: Deployment & Launch

- [ ] ⬜ **Update GitHub Actions**
- [ ] ⬜ **Production Build Testing**
- [ ] ⬜ **Pre-Launch Checklist**:
  - [ ] ⬜ All pages accessible
  - [ ] ⬜ All articles rendering
  - [ ] ⬜ All links working
  - [ ] ⬜ SEO meta tags correct
  - [ ] ⬜ Performance acceptable
- [ ] ⬜ **Deploy to Production**

### Phase 10: Documentation & Cleanup

- [ ] ⬜ **Update Project Documentation**
- [ ] ⬜ **Clean Up Legacy Code**
- [ ] ⬜ **Create Developer Guide**:
  - [ ] ⬜ How to add articles
  - [ ] ⬜ How to add pages
  - [ ] ⬜ How to work with components
  - [ ] ⬜ How to use PlanWorkflow

## Dependencies

- **Depends on**:
  - EC-site repository (cloned for reference)
  - Plan 002 (react-site-skeleton) - Phase 2+ blocked until skeleton Phase 4 complete
- **Blocks**: Future content updates
- **Related**:
  - Plan 002 (react-site-skeleton) - concurrent development
  - All future LTS Commerce development

## Technical Decisions

### Decision 1: React vs Other Frameworks

**Context**: Which modern framework to adopt?

**Options Considered**:

1. React - Industry standard, extensive ecosystem
2. Vue - Simpler learning curve
3. Svelte - Smaller bundles
4. Stay vanilla - No framework overhead

**Decision**: React + TypeScript

- Industry standard
- Strong TypeScript integration
- Rich ecosystem
- Better AI assistant collaboration

**Date**: 2025-12-11

### Decision 2: Article Content Format

**Context**: How to store and render article content?

**Options Considered**:

1. **MDX** - Markdown with React components
2. **HTML rendering** - Keep EJS, use dangerouslySetInnerHTML
3. **Pure React** - Full type safety, verbose for content

**Decision**: TBD - Will evaluate during Phase 6

**Date**: 2025-12-11 (pending)

### Decision 3: Styling Approach

**Context**: CSS Modules, Tailwind, or CSS-in-JS?

**Options Considered**:

1. **Tailwind CSS** - Utility-first, rapid development
2. **CSS Modules** - Scoped styles, standard CSS
3. **Styled Components** - CSS-in-JS, full JS power

**Decision**: TBD - Will evaluate during Phase 7

**Date**: 2025-12-11 (pending)

## Success Criteria

- [ ] All current pages accessible in React version
- [ ] All existing articles migrated and rendering correctly
- [ ] TypeScript compilation with zero errors
- [ ] ESLint passing with zero violations
- [ ] Playwright smoke tests passing
- [ ] Lighthouse scores equal or better than current
- [ ] PlanWorkflow system operational for future work
- [ ] Mobile responsiveness maintained or improved

## Risks & Mitigations

| Risk                     | Impact | Probability | Mitigation                                  |
| ------------------------ | ------ | ----------- | ------------------------------------------- |
| Article rendering breaks | High   | Medium      | Test each article, have HTML fallback       |
| Bundle size too large    | Medium | Medium      | Code splitting, monitor sizes               |
| TypeScript complexity    | Medium | Low         | Gradual adoption, allow 'any' in transition |
| Styling inconsistencies  | Medium | Medium      | Visual regression testing                   |
| SEO regression           | High   | Low         | Preserve meta tags, test with Lighthouse    |

## Timeline

Per PlanWorkflow guidance, no specific time estimates. Work proceeds in phases, each completed before moving to next.

- **Phase 1**: ✅ Complete (Foundation & Documentation)
- **Phase 2**: ✅ Complete (Build System Migration)
- **Phase 3**: ✅ Complete (Type-Safe Routing System)
- **Phase 4**: ✅ Complete (Component Structure Setup)
- **Phase 5**: ✅ Complete (Convert Core Templates - all pages with filtering/search)
- **Phase 6**: 🔜 Next (Article System Migration with content & syntax highlighting)
- **Phases 7-10**: Pending

**Target Completion**: When all phases complete and success criteria met

## Notes & Updates

### 2025-12-11 - Plan Creation (Take 2)

- Started fresh after realizing we copied too much from ec-site (all 70+ plans)
- Taking surgical approach: copy only essential documentation
- Created empty Plan/ directory structure
- Copied: PlanWorkflow.md, Worktree.md, HooksFrontController.md
- This is Plan 001 (clean start for LTS Commerce)
- Phase 1 in progress: Foundation & Documentation

### 2025-12-11 - Infrastructure Approach

**What we copied:**

- Essential documentation only (PlanWorkflow, Worktree, Hooks docs)
- Empty Plan/ directory structure
- Plan numbering instructions

**What we did NOT copy:**

- All 70+ plans from ec-site (not relevant)
- Hooks implementation (can add incrementally if needed)
- All agents/skills (can add as needed)
- EC-site specific content

**Philosophy**: Start minimal, add infrastructure as needed rather than copying everything upfront.

### 2026-01-22 - Phase 5 Audit & Status Update

**Context**: Session became unworkable, used Explore agent to audit status

**Audit Findings**:

- Phase 5 is 95% complete - far more progress than plan indicated
- All 6 major page conversions implemented (Home, About, Contact, ArticleList, ArticleDetail, Layout)
- 25 sample articles with full metadata created in `src/data/articles.ts`
- Type-safe routing, components, and data layer fully operational
- TypeScript: 0 errors, ESLint: 0 violations, Build: successful

**Gaps Identified**:

1. ArticleList missing category filter buttons (legacy has this)
2. ArticleList missing search functionality (legacy has this)
3. ArticleDetail has placeholder for content (Phase 6 work)
4. No syntax highlighting integration yet (Phase 6 work)

**Plan Updated**:

- Marked Phase 5 tasks as complete/in-progress based on reality
- Updated status summary to reflect 95% completion
- Identified clear path forward: finish filters/search, then Phase 6

**Decision**: Focus on completing Phase 5 filtering/search before moving to Phase 6

### 2026-01-22 - Phase 5 Complete

**Implementation**: Added filtering and search to ArticleList page

**Features Added**:

- Category filter buttons (All Categories + 5 category buttons)
- Active state styling for selected filter
- Search input field (filters by title/description, case-insensitive)
- Combined filtering logic (category AND search)
- Dynamic article count with "found" indicator when filtering
- Empty state with helpful message when no results
- useMemo optimization for filtered article computation

**Testing**:

- TypeScript: ✅ 0 errors
- Build: ✅ Successful (1.77s, 218KB bundle)
- Bundle size increase: +1.75KB (filtering logic overhead - acceptable)

**Phase 5 Status**: ✅ COMPLETE - All core templates converted to React with full functionality

### 2026-01-23 - Typography & Branding Improvements

**Implementation**: Professional font pairing and logo fixes

**Changes**:

- **Self-Hosted Inter Font**: Downloaded and integrated Inter font files (Regular, Medium, SemiBold, Bold)
- **Self-Hosted Source Sans 3**: Added Source Sans 3 for body text (~48KB Latin subset)
- **Professional Font Pairing**:
  - Headings + Logo: Inter (sharp, modern, geometric)
  - Body Text: Source Sans 3 (highly readable, designed for UI)
- **Logo Fixes**:
  - Fixed logo placement - moved from right to proper top-left position
  - Removed duplicate "LTS Commerce" text from header
  - Expanded SVG viewBox from 200px to 240px to show full "Commerce" text
  - Updated logo font to use Inter for brand consistency
  - Increased logo height from h-10 to h-12 for better visibility
- **Navigation Cleanup**: Removed unused imports, improved component consistency

**Typography Benefits**:

- ✅ Consistent branding across all platforms and browsers
- ✅ No external font dependencies (except JetBrains Mono for code)
- ✅ Faster initial load (no external CSS requests for Inter/Source Sans 3)
- ✅ Professional visual hierarchy with distinct heading/body fonts
- ✅ Total font payload: ~500KB (Inter + Source Sans 3 woff2 files)

**Pending Work**:

- Contact form currently uses mailto: approach (opens email client)
- **TODO (Phase 6.5)**: Implement Google Apps Script backend for contact form
  - Reference: EC-Site `google-apps-script/Code.gs` and `README.md`
  - Server-side validation and email sending
  - Honeypot spam protection
  - Proper form handling without exposing email credentials

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-01-23
**Plan Status**: 🔄 In Progress (Phase 5 Complete ✅ - Typography Enhanced ✅ - Contact Form Pending)

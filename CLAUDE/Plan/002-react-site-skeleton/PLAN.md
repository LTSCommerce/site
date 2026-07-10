# Plan 002: React Site Skeleton - Reusable Foundation

**Status**: ✅ Completed
**Created**: 2025-12-11
**Completed**: 2025-12-11
**Owner**: Claude Code
**Priority**: High
**Type**: Infrastructure / New Repository
**Related**: Plan 001 (LTS Commerce Migration)
**Repository**: https://github.com/LongTermSupport/react-site-skeleton

## Status Update (2025-12-11)

### Completed Phases:

✅ **Phase 1: Repository Initialization** - Skeleton repository created and initialized
✅ **Phase 2: TypeScript & Build System** - React 18, TypeScript 5.6, Vite 6 configured
✅ **Phase 3: Type-Safe Routing System** - RouteEntry, LinkDestination types created
✅ **Phase 4: ESLint & Static Analysis** - 3 custom ESLint rules implemented
✅ **Phase 5: Minimal Component Set** - Page, Container, Section, Hero, Prose components
✅ **Phase 6: Example Pages** - Home, About, Contact pages created
✅ **Phase 7: Generic Claude Infrastructure** - Docs, agents, skills, hooks infrastructure
✅ **Phase 8: Documentation & README** - Comprehensive README.md and GettingStarted.md
✅ **Phase 9: Testing & Quality** - All QA checks passing (type-check, build, lint)
✅ **Phase 10: Publish & Document Usage** - Repository published to GitHub, LTS site updated

### Deliverables:

- **GitHub Repository**: react-site-skeleton published and accessible
- **Custom ESLint Rules**: no-hardcoded-routes, no-string-link-props, use-types-not-strings
- **Type System**: Complete routing types with compile-time safety
- **Documentation**: README.md, GettingStarted.md, TypeSafety.md (927 lines)
- **Claude Code Integration**: Agents, skills, minimal hooks
- **Applied to LTS**: Skeleton successfully applied to LTS Commerce site (see Plan 001 Phase 2)

### Next Steps:

This plan is complete. The skeleton is ready for use by any React/TypeScript project. For LTS Commerce site implementation, continue with Plan 001.

## Overview

Create a **reusable React/TypeScript skeleton repository** that captures the infrastructure approach, type-safety patterns, and Claude Code integration without specific design/components. This skeleton serves as a foundation for future React projects with best-in-class developer experience and AI-assisted development.

**Key Principle**: Clone the **approach**, not the **design**. Each site gets its own bespoke components, but shares the robust infrastructure.

## Goals

1. **Type-Safe Architecture**: Total type safety throughout - routes, components, data
2. **Robust Static Analysis**: ESLint + TypeScript configured for maximum safety
3. **Component-Driven Design**: Clear patterns for building reusable components
4. **Generic Claude Infrastructure**: Docs, hooks, agents that work for any React site
5. **Minimal Component Set**: Just the essentials (Page container, Hero, Prose)
6. **Production-Ready Build**: Vite with optimal configuration
7. **Reusable Foundation**: Easy to clone and customize for new projects

## Non-Goals

- **Not copying ec-site components**: No specific design/styling
- **Not a component library**: Not exhaustive components, just patterns
- **Not opinionated on styling**: Sites choose Tailwind/CSS Modules/etc
- **Not a boilerplate dump**: Every piece has clear purpose and documentation

## Context & Background

### Why Create a Skeleton?

**Problem**: EC-site has great infrastructure but copying it means copying specific business/design decisions.

**Solution**: Extract the **approach** into a generic skeleton:

- Type-safe routing patterns
- ESLint rules for safety
- Component organization patterns
- Claude Code integration (generic)
- Minimal reference components

**Benefits**:

1. Reusable across projects (LTS site, future clients)
2. Captures lessons learned from ec-site
3. Each site maintains design independence
4. Easier to maintain/improve centrally

### Target Repository Structure

```
react-site-skeleton/
├── src/
│   ├── components/
│   │   ├── layout/         # Page, Section, Container
│   │   ├── content/        # Hero, Prose
│   │   └── ui/             # (minimal - sites add their own)
│   ├── pages/              # Example pages (Home, About)
│   ├── types/              # Type-safe routing, component patterns
│   ├── routes.ts           # Type-safe route system
│   └── main.tsx            # App entry point
├── .claude/
│   ├── agents/             # Generic agents (no site-specific logic)
│   ├── hooks/              # Generic hooks (British English, etc)
│   └── skills/             # Generic skills (qa, planning)
├── CLAUDE/
│   ├── PlanWorkflow.md
│   ├── ComponentPatterns.md
│   └── Plan/               # Empty (sites create their own plans)
├── eslint-rules/           # Custom ESLint rules
├── eslint.config.js        # ESLint configuration
├── vite.config.ts          # Vite build config
├── tsconfig.json           # TypeScript config
└── README.md               # How to use this skeleton
```

## Tasks

### Phase 1: Repository Initialization

- [ ] ⬜ **Create GitHub Repository**: `react-site-skeleton` under LongTermSupport org
- [ ] ⬜ **Initialize Project**:
  - [ ] ⬜ Git init
  - [ ] ⬜ npm init
  - [ ] ⬜ LICENSE (MIT)
  - [ ] ⬜ .gitignore (node_modules, dist, etc)
- [ ] ⬜ **Create Directory Structure**:
  - [ ] ⬜ src/ (components, pages, types)
  - [ ] ⬜ .claude/ (agents, hooks, skills)
  - [ ] ⬜ CLAUDE/ (documentation)
  - [ ] ⬜ eslint-rules/ (custom rules)

### Phase 2: TypeScript & Build System

- [ ] ⬜ **Install Dependencies**:
  - [ ] ⬜ react, react-dom
  - [ ] ⬜ typescript
  - [ ] ⬜ vite, @vitejs/plugin-react
  - [ ] ⬜ @types/react, @types/react-dom, @types/node
- [ ] ⬜ **Configure TypeScript**:
  - [ ] ⬜ tsconfig.json with strict mode
  - [ ] ⬜ Path aliases (@/ for src/)
  - [ ] ⬜ React JSX configuration
- [ ] ⬜ **Configure Vite**:
  - [ ] ⬜ React plugin
  - [ ] ⬜ TypeScript support
  - [ ] ⬜ Asset optimization
  - [ ] ⬜ Dev server configuration
- [ ] ⬜ **npm Scripts**:
  - [ ] ⬜ dev, build, preview
  - [ ] ⬜ lint, type-check
  - [ ] ⬜ test (Playwright setup)

### Phase 3: Type-Safe Routing System

- [ ] ⬜ **Create Route Type System**:
  - [ ] ⬜ src/types/routing.ts
    - [ ] ⬜ RouteEntry interface
    - [ ] ⬜ HashLink type
    - [ ] ⬜ ExternalLink type
    - [ ] ⬜ LinkDestination union
  - [ ] ⬜ Helper functions (getLinkPath, isHashLink, etc)
- [ ] ⬜ **Create src/routes.ts**:
  - [ ] ⬜ ROUTES object with example routes
  - [ ] ⬜ Home, About, Contact examples
- [ ] ⬜ **Document Route Patterns**:
  - [ ] ⬜ How to add new routes
  - [ ] ⬜ How to use ROUTES object
  - [ ] ⬜ Type-safe link components

### Phase 4: ESLint & Static Analysis

- [ ] ⬜ **Install ESLint**:
  - [ ] ⬜ eslint
  - [ ] ⬜ @typescript-eslint/parser
  - [ ] ⬜ @typescript-eslint/eslint-plugin
  - [ ] ⬜ eslint-plugin-react
  - [ ] ⬜ eslint-plugin-react-hooks
- [ ] ⬜ **Create Custom ESLint Rules**:
  - [ ] ⬜ eslint-rules/no-hardcoded-routes.js
    - [ ] ⬜ Prevent string literals for routes
    - [ ] ⬜ Enforce ROUTES object usage
  - [ ] ⬜ eslint-rules/no-string-link-props.js
    - [ ] ⬜ Prevent link: string in component props
    - [ ] ⬜ Enforce link: RouteEntry
  - [ ] ⬜ eslint-rules/use-types-not-strings.js
    - [ ] ⬜ Prevent scalar strings where types exist
    - [ ] ⬜ Enforce type-safe patterns
- [ ] ⬜ **Configure eslint.config.js**:
  - [ ] ⬜ TypeScript parser settings
  - [ ] ⬜ React plugin configuration
  - [ ] ⬜ Custom rules registration
  - [ ] ⬜ Strict ruleset
- [ ] ⬜ **Document ESLint Setup**:
  - [ ] ⬜ CLAUDE/ESLintRules.md
  - [ ] ⬜ How to add custom rules
  - [ ] ⬜ Philosophy: Type safety over convenience

### Phase 5: Minimal Component Set

- [ ] ⬜ **Layout Components**:
  - [ ] ⬜ src/components/layout/Page.tsx
    - [ ] ⬜ Generic page wrapper
    - [ ] ⬜ SEO meta props
    - [ ] ⬜ Type-safe props interface
  - [ ] ⬜ src/components/layout/Section.tsx
    - [ ] ⬜ Generic section wrapper
    - [ ] ⬜ Spacing/padding props
  - [ ] ⬜ src/components/layout/Container.tsx
    - [ ] ⬜ Max-width container
    - [ ] ⬜ Responsive padding
- [ ] ⬜ **Content Components**:
  - [ ] ⬜ src/components/content/Hero.tsx
    - [ ] ⬜ Generic hero pattern
    - [ ] ⬜ Title, subtitle, CTA props
    - [ ] ⬜ Type-safe CTA with RouteEntry
  - [ ] ⬜ src/components/content/Prose.tsx
    - [ ] ⬜ Styled content wrapper
    - [ ] ⬜ Markdown-friendly styles
- [ ] ⬜ **Document Components**:
  - [ ] ⬜ CLAUDE/ComponentPatterns.md
  - [ ] ⬜ Component organization philosophy
  - [ ] ⬜ Props interface patterns
  - [ ] ⬜ Type-safe component examples

### Phase 6: Example Pages

- [ ] ⬜ **Create Example Pages**:
  - [ ] ⬜ src/pages/Home.tsx
    - [ ] ⬜ Using Hero component
    - [ ] ⬜ Type-safe routing
  - [ ] ⬜ src/pages/About.tsx
    - [ ] ⬜ Using Prose component
  - [ ] ⬜ src/pages/Contact.tsx
    - [ ] ⬜ Form example (optional)
- [ ] ⬜ **Document Page Patterns**:
  - [ ] ⬜ How to create new pages
  - [ ] ⬜ Component composition patterns
  - [ ] ⬜ Data fetching patterns (if applicable)

### Phase 7: Generic Claude Infrastructure

- [ ] ⬜ **Copy & Genericize Documentation**:
  - [ ] ⬜ CLAUDE/PlanWorkflow.md (already generic)
  - [ ] ⬜ CLAUDE/Worktree.md (already generic)
  - [ ] ⬜ CLAUDE/ComponentPatterns.md (new - component design guide)
  - [ ] ⬜ CLAUDE/TypeSafety.md (new - type safety philosophy)
- [ ] ⬜ **Create Generic Hooks**:
  - [ ] ⬜ .claude/hooks/pre-tool-use (minimal)
    - [ ] ⬜ British English handler (generic)
    - [ ] ⬜ No hardcoded routes handler
    - [ ] ⬜ Destructive git prevention
  - [ ] ⬜ Document hook system in .claude/hooks/README.md
- [ ] ⬜ **Create Generic Agents**:
  - [ ] ⬜ .claude/agents/typescript-specialist.md (generic React/TS)
  - [ ] ⬜ .claude/agents/component-builder.md (generic component patterns)
  - [ ] ⬜ .claude/agents/qa-runner.md (generic QA)
  - [ ] ⬜ Keep site-agnostic (no business logic)
- [ ] ⬜ **Create Generic Skills**:
  - [ ] ⬜ .claude/skills/planning/SKILL.md (generic planning)
  - [ ] ⬜ .claude/skills/qa/SKILL.md (generic QA workflow)
  - [ ] ⬜ .claude/skills/typescript/SKILL.md (generic TS help)

### Phase 8: Documentation & README

- [ ] ⬜ **Create Comprehensive README.md**:
  - [ ] ⬜ What is this skeleton?
  - [ ] ⬜ Quick start guide
  - [ ] ⬜ How to customize for your project
  - [ ] ⬜ Architecture overview
  - [ ] ⬜ Type safety philosophy
  - [ ] ⬜ Component patterns
  - [ ] ⬜ Claude Code integration
- [ ] ⬜ **Create CLAUDE/GettingStarted.md**:
  - [ ] ⬜ Step-by-step project setup
  - [ ] ⬜ First component creation
  - [ ] ⬜ First page creation
  - [ ] ⬜ Using PlanWorkflow
- [ ] ⬜ **Create CLAUDE/Architecture.md**:
  - [ ] ⬜ Directory structure explanation
  - [ ] ⬜ Type system overview
  - [ ] ⬜ Build system overview
  - [ ] ⬜ Claude Code integration points

### Phase 9: Testing & Quality

- [ ] ⬜ **Set Up Playwright**:
  - [ ] ⬜ Install Playwright
  - [ ] ⬜ Create basic smoke tests
  - [ ] ⬜ Test example pages
- [ ] ⬜ **Run Full QA**:
  - [ ] ⬜ TypeScript: Zero errors
  - [ ] ⬜ ESLint: Zero violations
  - [ ] ⬜ Build: Successful
  - [ ] ⬜ Tests: All passing
- [ ] ⬜ **Create npm Scripts**:
  - [ ] ⬜ npm run qa (run all checks)
  - [ ] ⬜ npm run llm:lint (machine-readable)
  - [ ] ⬜ npm run llm:type-check (machine-readable)

### Phase 10: Publish & Document Usage

- [ ] ⬜ **Publish Repository**:
  - [ ] ⬜ Push to GitHub
  - [ ] ⬜ Add repository description
  - [ ] ⬜ Add topics/tags
  - [ ] ⬜ Create initial release (v1.0.0)
- [ ] ⬜ **Create Usage Guide**:
  - [ ] ⬜ USAGE.md - How to use this skeleton
  - [ ] ⬜ Document cloning process
  - [ ] ⬜ Document customization checklist
  - [ ] ⬜ Example: Applying to LTS Commerce site
- [ ] ⬜ **Update Plan 001**:
  - [ ] ⬜ Reference skeleton repo
  - [ ] ⬜ Update Phase 2 to use skeleton

## Dependencies

- **Depends on**: EC-site (for reference patterns)
- **Blocks**: Plan 001 Phase 2 (can start after Phase 4 complete)
- **Related**: Plan 001 (LTS Commerce Migration)

## Technical Decisions

### Decision 1: Repository Structure

**Context**: How to organize the skeleton for maximum reusability?

**Decision**: Flat structure with clear separation

- src/ - application code
- .claude/ - AI infrastructure
- CLAUDE/ - documentation
- eslint-rules/ - custom rules
- Root config files

**Rationale**: Easy to understand, easy to clone, easy to customize

**Date**: 2025-12-11

### Decision 2: Minimal vs Comprehensive Components

**Context**: How many components should the skeleton include?

**Options Considered**:

1. Minimal (5-10 components) - Layout, Hero, Prose
2. Comprehensive (30+ components) - Full component library
3. Medium (15-20 components) - Common patterns

**Decision**: Minimal (5-10 essential components)

- Layout: Page, Section, Container
- Content: Hero, Prose
- UI: (sites add their own)

**Rationale**:

- Each site needs unique design
- Too many components = design cloning
- Better to document patterns than provide components
- Examples show how to build, not what to build

**Date**: 2025-12-11

### Decision 3: Styling Approach

**Context**: CSS Modules, Tailwind, styled-components?

**Decision**: No opinion - document all approaches

- Skeleton uses minimal inline styles for examples
- README documents how to add Tailwind/CSS Modules/etc
- Sites choose their own styling system

**Rationale**:

- Different projects have different needs
- Skeleton focuses on structure/types, not styling
- Flexibility more valuable than opinionated choice

**Date**: 2025-12-11

### Decision 4: Claude Infrastructure Level

**Context**: How much Claude Code infrastructure to include?

**Decision**: Essential generic infrastructure only

- **Include**:
  - PlanWorkflow.md (planning system)
  - Worktree.md (parallel development)
  - Generic hooks (British English, route safety)
  - Generic agents (TypeScript, component builder, QA)
  - Generic skills (planning, qa, typescript)
- **Exclude**:
  - Site-specific hooks (page orchestration, etc)
  - Site-specific agents (SEO, content, etc)
  - Sitemap system
  - Citation system
  - Other ec-site specifics

**Rationale**: Skeleton provides foundation, sites add specialized infrastructure as needed

**Date**: 2025-12-11

## Success Criteria

- [ ] Repository created and published on GitHub
- [ ] TypeScript configured with strict mode, zero errors
- [ ] ESLint configured with custom rules, zero violations
- [ ] 5-10 minimal components with type-safe props
- [ ] Type-safe routing system documented and working
- [ ] Generic Claude infrastructure (docs, hooks, agents)
- [ ] Comprehensive README and documentation
- [ ] Example pages demonstrating patterns
- [ ] Successful build and tests
- [ ] Successfully applied to LTS Commerce site (Plan 001)

## Risks & Mitigations

| Risk                                 | Impact | Probability | Mitigation                                |
| ------------------------------------ | ------ | ----------- | ----------------------------------------- |
| Too opinionated, limits flexibility  | High   | Medium      | Keep minimal, document alternatives       |
| Too minimal, not useful              | Medium | Low         | Include essential patterns and clear docs |
| Difficult to genericize hooks/agents | Medium | Medium      | Start simple, iterate based on usage      |
| Maintenance burden across projects   | Medium | Medium      | Semantic versioning, clear changelog      |
| Type system too complex              | Medium | Low         | Clear documentation, gradual adoption     |

## Timeline

No specific time estimates per PlanWorkflow. Work proceeds in phases.

- **Phase 1**: Pending (Repository initialization)
- **Phase 2**: Pending (TypeScript & build)
- **Phase 3**: Pending (Routing system)
- **Phase 4**: Pending (ESLint)
- **Phase 5**: Pending (Components)
- **Phase 6**: Pending (Example pages)
- **Phase 7**: Pending (Claude infrastructure)
- **Phase 8**: Pending (Documentation)
- **Phase 9**: Pending (Testing)
- **Phase 10**: Pending (Publish)

**Target Completion**: When skeleton is published and successfully applied to Plan 001

## Notes & Updates

### 2025-12-11 - Plan Creation

- Created Plan 002 for react-site-skeleton repository
- Key insight: Clone the **approach**, not the **design**
- Minimal component set (5-10) to avoid design cloning
- Generic Claude infrastructure (hooks, agents, skills)
- Will work concurrently with Plan 001
- Plan 001 Phase 2+ will use this skeleton

### 2025-12-11 - Concurrent Development Strategy

**Plan 002** (Skeleton):

- Build generic, reusable foundation
- Type-safe patterns
- Minimal components
- Generic Claude infrastructure

**Plan 001** (LTS Site):

- Archive legacy build system
- Apply skeleton
- Build LTS-specific components
- Add LTS content/articles

**Synergy**: Lessons learned in Plan 001 inform Plan 002 improvements.

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2025-12-11
**Plan Status**: 🔄 In Progress

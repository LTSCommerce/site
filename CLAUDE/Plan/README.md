# Plans Index

This directory contains all project plans following the Planning Workflow (see `CLAUDE/PlanWorkflow.md`).

## Active Plans

- [001: React Migration & Claude Code Infrastructure Adoption](001-react-migration-adoption/PLAN.md) - 🔄 In Progress - **High Priority** - Migrate LTS Commerce site from EJS/Vite to React/TypeScript, apply skeleton from Plan 002
- [002: React Site Skeleton - Reusable Foundation](002-react-site-skeleton/PLAN.md) - 🔄 In Progress - **High Priority** - Create generic React/TypeScript skeleton repo with type-safe patterns, ESLint rules, minimal components, and Claude Code infrastructure
- [003: Contact Form with Google Apps Script Backend](003-contact-form-google-apps-script/PLAN.md) - 📋 Planned - **High Priority** - Replace mailto: contact form with React Hook Form + Zod + Google Apps Script backend (honeypot, rate limiting, email)
- [004: Custom Hooks Lift from EC Site](004-custom-hooks-lift/PLAN.md) - 📋 Planned - **Medium Priority** - Lift 4 battle-tested hooks (useInView, useMediaQuery, useCTARotation, useSlideshow) from EC site
- [005: Vite Config Optimisation](005-vite-config-optimisation/PLAN.md) - 📋 Planned - **Low-Medium Priority** - Adopt code splitting, terser minification, and rollup visualiser from EC site Vite config
- [006: Testing Infrastructure](006-testing-infrastructure/PLAN.md) - 📋 Planned - **Medium Priority** - Set up Vitest + Playwright (smoke tests for all pages); required before Plan 001 Phase 8
- [007: Component Library Lift from EC Site](007-component-library-lift/PLAN.md) - 📋 Planned - **Medium Priority** - Adopt 6 UI components (BlurText, Typewriter, StatusBadge, ThreeColumnFeatures, MobileCarouselGrid, HighlightTypewriter)
- [008: ESLint Custom Rules Adoption](008-eslint-custom-rules/PLAN.md) - 📋 Planned - **Medium-High Priority** - Cherry-pick 8 ESLint rules from EC site's 80+ (SEO enforcement, navigation, placeholder prevention)
- [011: ts-qa-ci — TypeScript QA/CI Harness Package](011-ts-qa-ci-package/PLAN.md) - 🔄 In Progress - **High Priority** - New `@longtermsupport/ts-qa-ci` package (TS analogue of `lts/php-qa-ci`): orchestrated QA pipeline, CDD ESLint rule tier, Claude Code integration, dogfooded on this repo first
- [012: Migrate ec-site onto ts-qa-ci](012-ecsite-ts-qa-ci-migration/PLAN.md) - 📋 Planned - **Medium Priority** - Refactor ec-site to consume `ts-qa-ci` for generic QA/CI, keep private/brand rules local via the project-override layer; depends on Plan 011

## Completed Plans

- [00013: Host-Action Bridge Article](Completed/00013-host-action-bridge-article/PLAN.md) - ✅ Complete - **Medium Priority** - Article on the Host-Action Bridge pattern (sandboxed agent container safely orchestrating containers on its host via a file spool + host watcher + closed verb allowlist); published to `src/data/articles.ts` as `host-action-bridge`

## Blocked Plans

None currently.

## Cancelled Plans

None currently.

---

**Note**: Plan statuses should be updated as work progresses. See `CLAUDE/PlanWorkflow.md` for status definitions and workflow.

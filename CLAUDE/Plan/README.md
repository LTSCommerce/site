# Plans Index

This directory contains all project plans following the Planning Workflow (see `CLAUDE/PlanWorkflow.md`).

## Active Plans

- [001: React Migration & Claude Code Infrastructure Adoption](001-react-migration-adoption/PLAN.md) - In Progress - **High Priority** - Migrate LTS Commerce site from EJS/Vite to React/TypeScript, apply skeleton from Plan 002
- [003: Contact Form with Google Apps Script Backend](003-contact-form-google-apps-script/PLAN.md) - Not Started - **High Priority** - Replace mailto: contact form with React Hook Form + Zod + Google Apps Script backend (honeypot, rate limiting, email)
- [006: Testing Infrastructure](006-testing-infrastructure/PLAN.md) - Not Started - **Medium Priority** - Set up Vitest + Playwright (smoke tests for all pages); required before Plan 001 Phase 8
- [010: Go Live - React Migration](010-go-live-react-migration/PLAN.md) - In Progress - **High Priority** - Take the React/TypeScript site live
- [012: Migrate ec-site onto ts-qa-ci](012-ecsite-ts-qa-ci-migration/PLAN.md) - Not Started - **Medium Priority** - Refactor ec-site to consume `ts-qa-ci` for generic QA/CI, keep private/brand rules local via the project-override layer; depends on Plan 011

## Completed Plans

- [00014: ltscommerce.dev Change-Requests Brief](Completed/00014-ltscommerce-change-requests-brief/PLAN.md) - Complete - **High Priority** - Action the site audit: agentic governance positioning, open-source portfolio, privacy policy, RSS feed, trust and legal fixes

- [002: React Site Skeleton - Reusable Foundation](Completed/002-react-site-skeleton/PLAN.md) - Complete - **High Priority** - Generic React/TypeScript skeleton with type-safe patterns, ESLint rules, minimal components, and Claude Code infrastructure

- [004: Custom Hooks Lift from EC Site](Completed/004-custom-hooks-lift/PLAN.md) - Complete - **Medium Priority** - Lift 4 battle-tested hooks (useInView, useMediaQuery, useCTARotation, useSlideshow) from EC site

- [005: Vite Config Optimisation](Completed/005-vite-config-optimisation/PLAN.md) - Complete - **Low-Medium Priority** - Code splitting, terser minification, and rollup visualiser from EC site Vite config

- [007: Component Library Lift from EC Site](Completed/007-component-library-lift/PLAN.md) - Complete - **Medium Priority** - Adopt 6 UI components (BlurText, Typewriter, StatusBadge, ThreeColumnFeatures, MobileCarouselGrid, HighlightTypewriter)

- [008: ESLint Custom Rules Adoption](Completed/008-eslint-custom-rules/PLAN.md) - Complete - **Medium-High Priority** - Cherry-pick 8 ESLint rules from EC site's 80+ (SEO enforcement, navigation, placeholder prevention)

- [009: Screenshot System Lift](Completed/009-screenshot-system/PLAN.md) - Complete - **Medium Priority** - Lift the screenshot system from the EC site

- [011: ts-qa-ci — TypeScript QA/CI Harness Package](Completed/011-ts-qa-ci-package/PLAN.md) - Complete - **High Priority** - New `@longtermsupport/ts-qa-ci` package (TS analogue of `lts/php-qa-ci`): orchestrated QA pipeline, CDD ESLint rule tier, Claude Code integration, dogfooded on this repo first

- [00013: Host-Action Bridge Article](Completed/00013-host-action-bridge-article/PLAN.md) - Complete - **Medium Priority** - Full-depth article on the Host-Action Bridge pattern, donated as a plan-plus-reference-pack hand-off per `CONTRIBUTING-PROJECTS.md` (which this plan is the worked example for); published to `src/data/articles.ts` as `host-action-bridge`

## Blocked Plans

None currently.

## Cancelled Plans

None currently.

---

**Note**: Plan statuses should be updated as work progresses. See `CLAUDE/PlanWorkflow.md` for status definitions and workflow.

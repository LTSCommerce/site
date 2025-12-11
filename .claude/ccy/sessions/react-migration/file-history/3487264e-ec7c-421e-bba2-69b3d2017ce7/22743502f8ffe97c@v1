# Legacy LTS Commerce Build System (Archived)

**Archived**: 2025-12-11
**Reason**: Migration to React/TypeScript (Plan 001)
**Replacement**: React site skeleton approach (Plan 002)

## What's Archived Here

This directory contains the complete legacy build system for the LTS Commerce static site that was built with EJS templates and Vite.

### Files & Directories

- **private_html/** - Source files for the EJS-based site
  - `templates/` - EJS layout and component templates
  - `pages/` - EJS page templates
  - `articles/` - Article templates with embedded metadata
  - `data/` - Template data (site.json, navigation.json)
  - `css/` - Stylesheets
  - `js/` - JavaScript modules
  - `images/` - Static assets

- **scripts/** - Build utilities
  - `process-ejs.js` - EJS template processor
  - `auto-register-articles.js` - Article registration system
  - `screenshot.js` - Playwright screenshot utility

- **vite.config.js** - Legacy Vite configuration
  - Custom EJS preprocessing
  - Multi-entry build setup
  - Asset optimization

- **package.json** - Legacy npm dependencies
  - EJS templating
  - Vite 5.x
  - Vanilla JavaScript tooling

## Why Archived?

The site is being migrated to React/TypeScript for:
- **Type safety**: Zero runtime type errors
- **Component reusability**: Reduce duplication
- **Better DX**: TypeScript + ESLint + modern tooling
- **AI collaboration**: Better Claude Code integration

## Technology Comparison

### Legacy (Archived)
```
EJS Templates → Custom Preprocessing → Vite → Static HTML
- ✅ Simple, no framework overhead
- ❌ No type safety
- ❌ Template duplication
- ❌ Manual component reuse
```

### New (React)
```
React Components → TypeScript → Vite → Static HTML (SSG)
- ✅ Type-safe throughout
- ✅ Component-driven design
- ✅ Robust ESLint rules
- ✅ Better AI assistance
```

## Content Preserved

All articles and content from `private_html/articles/` are being migrated to the new React system. No content is lost.

## Reference

This archive remains for:
- **Content reference**: When migrating articles
- **Design reference**: Reviewing layout decisions
- **Build reference**: Understanding previous approach
- **Rollback**: Emergency fallback if needed

## Related Plans

- **Plan 001**: React Migration & Claude Code Infrastructure Adoption
- **Plan 002**: React Site Skeleton - Reusable Foundation

## How to Use This Archive

### Extract Article Content
```bash
# Articles are in ARCHIVE/private_html/articles/
ls ARCHIVE/private_html/articles/
```

### View Original Styles
```bash
# CSS files in ARCHIVE/private_html/css/
cat ARCHIVE/private_html/css/main.css
```

### Review Build Scripts
```bash
# Build utilities in ARCHIVE/scripts/
cat ARCHIVE/scripts/process-ejs.js
```

## Do Not Use for New Development

⚠️ **This system is archived and should NOT be used for new development.**

All new work follows:
- React/TypeScript architecture
- react-site-skeleton patterns
- PlanWorkflow system
- Type-safe component design

---

**Archived by**: Claude Code
**Plan References**: CLAUDE/Plan/001-react-migration-adoption/PLAN.md
**Date**: 2025-12-11

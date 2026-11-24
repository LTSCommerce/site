# Plan 010: Go Live — React Migration

**Status**: Complete
**Created**: 2026-02-20
**Owner**: Claude
**Priority**: Critical

## Overview

All redesign work (Plans 001–009) is complete on `react-migration`. This plan covers every
remaining task needed to merge to `main` and go live with the React site.

## Tasks

### P0 — Hard Blockers

- [x] ✅ **CI/CD**: Fix `ci.yml` to deploy `dist/` not `public_html/`; remove old EJS timestamp sed commands
- [x] ✅ **Contact.tsx**: Fix wrong LinkedIn (`josephltshq` → `edmondscommerce`) and GitHub (`josephltshq` → `LongTermSupport`) links
- [x] ✅ **About.tsx**: Fix wrong LinkedIn and GitHub links in sidebar

### P1 — Should Fix Before Launch

- [x] ✅ **ArticleList.tsx**: Rewrite inline styles with Tailwind, fix filter active colour to brand primary
- [x] ✅ **Article content**: Audited — 16k line file, all articles have embedded HTML content
- [x] ✅ **Contact form fallback**: Opens mailto with pre-filled subject/body when `VITE_CONTACT_FORM_URL` not set

### P2 — Tidy Up

- [x] ✅ **package.json**: Remove `flowbite` and `flowbite-react` from devDependencies
- [x] ✅ **vite.config.ts**: Remove stale flowbite chunk references
- [x] ✅ **About CTA**: Changed `bg-blue-600` to `bg-[#0f4c81]` (brand primary)

### P3 — Merge & Deploy

- [x] ✅ **QA pass**: TypeScript clean, build succeeds
- [x] ✅ **Commit all changes** with clear message
- [x] ✅ **Merge `react-migration` → `main`**: main is the React site and no react-migration branch remains

## Success Criteria

Verified 2026-11-20:

- [x] ✅ `npm run llm:build` succeeds with zero errors (70 routes prerendered, 0 failed; the build runs `tsc`)
- [x] ✅ TypeScript clean (the build type-checks first)
- [x] ✅ CI uploads `dist/` for GitHub Pages (`.github/workflows/ci.yml`)
- [x] ✅ No source imports of Flowbite
- [ ] ⬜ `flowbite-react` is still listed in `dependencies` in package.json although nothing imports it; remove it with the package manager (pnpm) so the lockfile stays in step
- [ ] ⬜ Social links, ArticleList Tailwind and contact-form fallback were verified when written but not re-checked in this pass

## Closure

Closed as Complete on 2026-11-24. The goal of this plan, taking the React site live, was met: `react-migration` was merged into `main` in `e4dd9ac` and the site has been deployed from `main` since. The two unticked items above were left open, not done:

- `flowbite-react` is still in `package.json` `dependencies`. Nothing under `src/` imports it, but `tailwind.config.ts` does (`flowbite-react/tailwind`), so that config has to change before the package can be removed. (Success Criterion 4 above is true only for `src/`.)
- The social-link, ArticleList and contact-form re-check was never done as a separate pass.

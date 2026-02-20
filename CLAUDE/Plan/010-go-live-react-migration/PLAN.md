# Plan 010: Go Live — React Migration

**Status**: 🔄 In Progress
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
- [ ] ⬜ **Commit all changes** with clear message
- [ ] ⬜ **Merge `react-migration` → `main`** (PR or direct)

## Success Criteria

- [ ] `npm run build` succeeds with zero errors
- [ ] TypeScript clean (`tsc --noEmit`)
- [ ] CI deploys `dist/` to GitHub Pages correctly
- [ ] All social links correct (LinkedIn: edmondscommerce, GitHub: LongTermSupport)
- [ ] No Flowbite in source or deps
- [ ] ArticleList uses Tailwind throughout
- [ ] Contact form has clear fallback

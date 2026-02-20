# Plan 009: Screenshot System Lift

**Status**: ✅ Complete
**Created**: 2026-02-20
**Owner**: Claude
**Priority**: High

## Overview

Lift the screenshot system from the EC site to LTS Commerce. The EC site has a mature
Playwright-based screenshot system with multi-viewport support, auto dev-server management,
scroll-position capture, and LLM-optimised agents. This was not included in the original
lift analysis (Plans 003-008) and is needed now for visual debugging.

## Goals

- Adapt `generate-screenshots.ts` from EC site for our pages and routes
- Install Playwright Chromium in the container
- Add `npm run screenshots` and `npm run llm:screenshots` scripts
- Lift `page-screenshotter` and `page-screenshot-analyser` agents

## Non-Goals

- Action sequences / carousel swipe simulation (EC site v3 feature, not needed yet)
- Feedback submission screenshots
- Cloudflare Worker integration

## Tasks

### Phase 1: Core Script

- [x] ✅ Create Plan 009
- [x] ✅ Write `scripts/generate-screenshots.ts` adapted for LTS routes
- [x] ✅ Install Playwright Chromium
- [x] ✅ Add npm scripts to package.json (`screenshots`, `llm:screenshots`)
- [x] ✅ Test: successfully captured 13 scroll-position screenshots of homepage at 1920×1080

### Phase 2: Agents & Documentation

- [ ] ⬜ Lift `page-screenshotter` agent (adapted for LTS)
- [ ] ⬜ Lift `page-screenshot-analyser` agent (adapted for LTS)
- [ ] ⬜ Add `CLAUDE/Screenshots.md` quick reference

## Fixes Applied

- **Server-ready detection**: Replaced stdout text matching with HTTP polling (Vite v6 logs to stderr)
- **Hang prevention**: Added 3-minute global process timeout + explicit `process.exit(0)`
- **Animation wait**: Added 2s wait after `body.loaded` so CSS animations complete before capture

## Success Criteria

- [x] ✅ `npm run screenshots` generates desktop screenshots for all pages
- [x] ✅ Screenshots saved to `untracked/screenshots/`
- [x] ✅ Script auto-manages dev server (build + preview)
- [ ] ⬜ Agents can invoke the script and read screenshots (Phase 2)

# Plan 005: Vite Configuration Optimisation

**Status**: 📋 Planned
**Created**: 2026-02-20
**Last Updated**: 2026-02-20
**Owner**: Claude Code
**Priority**: Low-Medium
**Type**: Build Optimisation / Developer Experience
**Related**: Plan 001 (React Migration), Plan 006 (Testing Infrastructure)

## ⚠️ Execution Workflow: Worktree Required

This plan **must** be executed using the git worktree workflow. Read the full documentation before starting any implementation:

**@CLAUDE/Worktree.md**

```bash
# Setup: create parent worktree before any implementation
git worktree add untracked/worktrees/worktree-plan-005 -b worktree-plan-005
```

- All implementation work happens inside the worktree — never directly in `/workspace`
- Child → Parent merges: automatic (no approval needed)
- Parent → `react-migration` merge: **requires explicit human approval**

## Overview

Adopt advanced Vite build optimisations from the EC site into LTS Commerce. The EC site's `vite.config.ts` contains battle-tested configuration for code splitting, minification, bundle analysis, and build performance that would benefit the LTS site as it grows.

The current LTS Vite config is minimal -- a basic React plugin, path alias, sourcemaps, and a single static `manualChunks` entry that groups `react` and `react-dom` into a `vendor` chunk. As more dependencies are added (routing, forms, syntax highlighting, UI libraries), the bundle will grow without intelligent splitting. This plan addresses that proactively.

The goal is not to blindly copy the EC config, but to adopt the patterns that make sense for LTS Commerce's current and near-future dependency graph, while keeping the config simple and maintainable.

## Goals

1. **Intelligent Code Splitting**: Split the bundle by dependency type so users only download what each page needs
2. **Aggressive Minification**: Adopt terser with production-optimised settings (drop console, multi-pass)
3. **Bundle Visibility**: Add rollup-plugin-visualizer for ongoing bundle analysis
4. **Build Performance**: Tune `optimizeDeps`, `reportCompressedSize`, and chunk size warnings
5. **Measured Improvement**: Document before/after bundle sizes to validate changes

## Non-Goals

- **Not copying EC-specific plugins**: The dev-server-lock and preload-logo plugins solve EC-specific problems (Docker dev environments, SSR logo preloading) and are not relevant to LTS
- **Not adding SSR/SSG**: LTS remains a client-side SPA
- **Not changing the dev server config**: Port, host, and Docker settings are EC-specific
- **Not adding dependencies just for optimisation**: Only optimise what we already have or plan to add

## Context & Background

### Current LTS Vite Config (`vite.config.ts`)

The current config is minimal:

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

**What this does:**
- Single `vendor` chunk for React core (good start)
- Sourcemaps enabled (good for debugging, but large in production)
- Default esbuild minification (fast but not as aggressive as terser)
- No bundle analysis tooling
- No chunk naming convention
- No `optimizeDeps` configuration

### EC Site Vite Config (Reference)

The EC site config includes several advanced features:

| Feature | EC Site | LTS Current | Gap |
|---------|---------|-------------|-----|
| `manualChunks` | Function-based, 9 chunk categories | Static object, 1 chunk | Large |
| Minifier | Terser with 2-pass, drop_console | Default esbuild | Medium |
| Bundle visualiser | rollup-plugin-visualizer | None | Medium |
| `optimizeDeps.exclude` | Lazy-loaded deps excluded | None configured | Small |
| `chunkSizeWarningLimit` | 1000KB | Default (500KB) | Small |
| `reportCompressedSize` | false (faster builds) | Default (true) | Small |
| Chunk naming | `assets/[name]-[hash].js` | Default | Small |
| Custom plugins | dev-server-lock, preload-logo | None | N/A (not needed) |
| Sourcemaps | Not configured (default off for prod) | Enabled | Review needed |

### Current LTS Dependencies (Relevant to Chunking)

From `package.json`:

**Runtime dependencies:**
- `react` ^18.3.1 + `react-dom` ^18.3.1 -- React core (~140KB)
- `react-router-dom` ^7.10.1 -- Routing (~40KB)
- `highlight.js` ^11.11.1 -- Syntax highlighting (~large, language-dependent)

**Dev dependencies used at runtime (via Flowbite):**
- `flowbite` ^4.0.1 + `flowbite-react` ^0.12.16 -- UI component library

### Custom Plugin Evaluation

**`vite-plugin-dev-server-lock`**: Prevents multiple dev server instances using a `/tmp` lock file. This solves an EC-specific problem with Docker containers and multiple developers. LTS is a single-developer project without containerised development. **Verdict: Not needed.**

**`vite-plugin-preload-logo`**: Injects `<link rel="preload">` for the LCP logo image into HTML during build. This is an SSR/SSG optimisation where the logo path includes a content hash. LTS is a client-side SPA where the logo is bundled by React. **Verdict: Not needed now. Revisit if LTS adds SSR/SSG.**

## Tasks

### Phase 1: Audit & Baseline

- [ ] ⬜ **Capture baseline bundle metrics**: Run `npm run build` and record all chunk sizes, total bundle size (currently 218KB), and build time
- [ ] ⬜ **Map dependency graph**: List all runtime dependencies and which pages/components use them to inform chunking strategy
- [ ] ⬜ **Document current chunk output**: Record the exact files produced by the current build (names, sizes, contents)

### Phase 2: Manual Chunks Strategy

- [ ] ⬜ **Convert static manualChunks to function-based**: Replace the static `{ vendor: ['react', 'react-dom'] }` with a function that inspects module IDs
- [ ] ⬜ **Add react-core chunk**: Group `react`, `react-dom`, and `scheduler` into a `react-core` chunk (these rarely change, excellent cache candidates)
- [ ] ⬜ **Add react-router chunk**: Separate `react-router-dom` and `react-router` into their own chunk (only needed on route transitions)
- [ ] ⬜ **Add highlight-js chunk**: Separate `highlight.js` into its own chunk (large library, only needed on article detail pages, strong candidate for lazy loading)
- [ ] ⬜ **Add flowbite chunk**: Separate `flowbite` and `flowbite-react` into a `ui-library` chunk (assess size impact)
- [ ] ⬜ **Add vendor catch-all**: All remaining `node_modules` go into a `vendor` chunk
- [ ] ⬜ **Add chunk naming convention**: Use `assets/[name]-[hash].js` pattern for predictable output
- [ ] ⬜ **Verify build succeeds**: `npm run build` completes with 0 errors

### Phase 3: Build Optimisation

- [ ] ⬜ **Install terser**: Add `terser` as a devDependency (`npm install -D terser`)
- [ ] ⬜ **Configure terser minification**: Switch from esbuild to terser with:
  - `compress.drop_console: true` -- Remove console.log in production
  - `compress.drop_debugger: true` -- Remove debugger statements
  - `compress.pure_funcs: ['console.log', 'console.info', 'console.debug']` -- Mark as side-effect-free
  - `compress.passes: 2` -- Extra minification pass for smaller output
  - `mangle.safari10: true` -- Fix Safari 10+ compatibility bugs
- [ ] ⬜ **Review sourcemap strategy**: Evaluate whether production sourcemaps are needed:
  - Option A: `sourcemap: true` (current) -- Full sourcemaps, larger build output
  - Option B: `sourcemap: 'hidden'` -- Sourcemaps generated but not referenced in bundles (for error tracking)
  - Option C: `sourcemap: false` -- No sourcemaps in production (smallest output)
  - **Recommendation**: Switch to `'hidden'` or `false` for production; sourcemaps add significant size
- [ ] ⬜ **Set `reportCompressedSize: false`**: Skip gzip size calculation during build (faster builds, we can measure separately)
- [ ] ⬜ **Set `chunkSizeWarningLimit: 1000`**: Raise from default 500KB to 1000KB to avoid false warnings for vendor chunks while still catching genuinely oversized application chunks
- [ ] ⬜ **Verify build succeeds**: `npm run build` completes with 0 errors

### Phase 4: Developer Experience

- [ ] ⬜ **Install rollup-plugin-visualizer**: Add as devDependency (`npm install -D rollup-plugin-visualizer`)
- [ ] ⬜ **Configure visualizer**: Add to plugins array with:
  - `filename: 'var/bundle-analysis.html'` -- Output to gitignored var/ directory
  - `open: false` -- Don't auto-open browser
  - `gzipSize: true` -- Show gzip sizes
  - `brotliSize: true` -- Show brotli sizes
- [ ] ⬜ **Configure `optimizeDeps.exclude`**: Exclude lazy-loaded dependencies from Vite's pre-bundling:
  - `highlight.js` -- Only needed on article detail pages (if lazy-loaded)
  - Any future form libraries (react-hook-form, zod) when added
- [ ] ⬜ **Add `build:analyze` npm script**: Convenience script that builds then opens the visualizer report
- [ ] ⬜ **Verify dev server still works**: `npm run dev` starts without errors

### Phase 5: Verification & Documentation

- [ ] ⬜ **Capture post-optimisation metrics**: Run build and record all chunk sizes, total bundle size, and build time
- [ ] ⬜ **Compare before/after**: Create comparison table showing size changes per chunk
- [ ] ⬜ **Verify code splitting**: Confirm separate chunks exist for react-core, react-router, highlight-js, vendor
- [ ] ⬜ **Verify lazy loading compatibility**: If highlight.js is lazy-loaded, confirm it loads correctly on article pages
- [ ] ⬜ **Run bundle visualizer**: Open `var/bundle-analysis.html` and verify clean dependency separation
- [ ] ⬜ **Update plan with results**: Record final metrics and mark plan complete

## Dependencies

- **Depends on**: Plan 001 Phase 5 (Complete) -- Need a working React build to optimise
- **Blocks**: Plan 006 (Testing Infrastructure) -- Build must be stable before adding test infrastructure
- **Related**: Plan 001 (React Migration) -- This plan optimises the build system established in Plan 001

## Technical Decisions

### Decision 1: Function-Based vs Static manualChunks

**Context**: The current config uses a static object for `manualChunks`. The EC site uses a function.

**Options Considered**:
1. **Static object** -- Simpler, explicit list of packages per chunk
2. **Function-based** -- More flexible, can use `id.includes()` patterns to catch sub-dependencies

**Decision**: Function-based (matching EC site pattern)

**Rationale**: A function-based approach is more maintainable as dependencies grow. It catches sub-packages automatically (e.g., `scheduler` with React) and provides a clear, readable pattern for adding new chunks. The static approach requires knowing every sub-package name.

**Date**: 2026-02-20

### Decision 2: Terser vs esbuild Minification

**Context**: Vite defaults to esbuild for minification (fast). The EC site uses terser (slower but smaller output).

**Options Considered**:
1. **esbuild** (current) -- ~10x faster minification, good-enough compression
2. **terser** -- Slower but supports `drop_console`, multi-pass, and produces 5-15% smaller bundles

**Decision**: Terser for production builds

**Rationale**: Build speed is less critical than bundle size for a portfolio site with infrequent builds. The ability to drop console statements and perform multi-pass compression is valuable. The EC site has validated this approach in production.

**Date**: 2026-02-20

### Decision 3: Custom Vite Plugins

**Context**: The EC site has two custom plugins (dev-server-lock, preload-logo). Should LTS adopt them?

**Options Considered**:
1. **Adopt both plugins** -- Full feature parity with EC site
2. **Adopt preload-logo only** -- LCP optimisation is universally beneficial
3. **Adopt neither** -- Both solve EC-specific problems

**Decision**: Adopt neither

**Rationale**:
- `dev-server-lock` solves Docker multi-developer conflicts -- LTS is single-developer without Docker
- `preload-logo` requires SSR/SSG to inject into HTML at build time -- LTS is a client-side SPA where React controls the DOM
- Both can be revisited if LTS adds SSR or containerised development

**Date**: 2026-02-20

### Decision 4: Production Sourcemaps

**Context**: Current config has `sourcemap: true`. This increases build output size significantly.

**Options Considered**:
1. **`true`** (current) -- Full sourcemaps, referenced in bundles, visible in browser DevTools
2. **`'hidden'`** -- Sourcemaps generated but not referenced (for error tracking services)
3. **`false`** -- No sourcemaps (smallest build, no debugging aid)

**Decision**: TBD during Phase 3 implementation

**Rationale**: Depends on whether LTS uses an error tracking service (Sentry, etc.). If not, `false` is the pragmatic choice. If error tracking is added later, switch to `'hidden'`.

**Date**: 2026-02-20 (pending)

## Success Criteria

- [ ] Build succeeds with 0 errors after all changes
- [ ] Total bundle size equal to or smaller than current baseline (218KB)
- [ ] Code splitting produces separate chunks: `react-core`, `react-router`, `highlight-js`, `vendor`
- [ ] Rollup visualizer report shows clean dependency separation
- [ ] No console.log statements in production bundle (terser drops them)
- [ ] Bundle analysis report generated at `var/bundle-analysis.html`
- [ ] Dev server (`npm run dev`) still works correctly
- [ ] Before/after metrics documented in plan notes

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Terser slows build significantly | Low | Medium | Build speed is not critical for infrequent deployments; can revert to esbuild if > 30s |
| manualChunks breaks lazy loading | High | Low | Test lazy-loaded routes after changes; function includes fallback vendor chunk |
| Over-splitting creates too many HTTP requests | Medium | Low | Monitor chunk count; merge small chunks if > 10 separate files |
| Removing sourcemaps hinders debugging | Low | Low | Keep `sourcemap: 'hidden'` as compromise; can re-enable for debugging sessions |
| rollup-plugin-visualizer adds dev dependency bloat | Low | Low | It's a devDependency only, ~2MB, no production impact |
| optimizeDeps.exclude causes dev server issues | Medium | Low | Test dev server thoroughly; easy to revert exclusions |

## Timeline

Per PlanWorkflow guidance, no specific time estimates. Work proceeds in phases, each completed before moving to next.

- **Phase 1**: Audit & Baseline (prerequisite for all other phases)
- **Phase 2**: Manual Chunks Strategy (core improvement)
- **Phase 3**: Build Optimisation (terser, sourcemaps, limits)
- **Phase 4**: Developer Experience (visualizer, optimizeDeps)
- **Phase 5**: Verification & Documentation (measure results)

**Target Completion**: When all phases complete and success criteria met

## Notes & Updates

### 2026-02-20 - Plan Creation

- Created plan based on analysis of EC site `vite.config.ts` vs current LTS `vite.config.ts`
- Current LTS bundle: 218KB total (from Plan 001 Phase 5 completion)
- Key dependencies to split: react (140KB), react-router-dom (40KB), highlight.js (variable), flowbite (variable)
- Decided against adopting EC custom plugins (dev-server-lock, preload-logo) as they solve EC-specific problems
- Priority set to Low-Medium: not blocking any current work, but beneficial to do before the dependency list grows further

---

**Maintained by**: Joseph (LTS Commerce)
**Last Updated**: 2026-02-20
**Plan Status**: 📋 Planned

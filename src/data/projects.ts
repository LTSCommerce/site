/**
 * Open Source Projects
 *
 * Public repos published under the LongTermSupport GitHub org. Content is
 * kept factual and verifiable (No Bullshit Rule, see CLAUDE.md) — sourced
 * directly from each repo's own README/package manifest, not marketing copy.
 *
 * Ordering: newest/most relevant first.
 */

import type { OpenSourceProject } from '@/types/project';

const PROJECTS: readonly OpenSourceProject[] = [
  {
    id: 'ts-qa-ci',
    name: 'ts-qa-ci',
    tagline:
      'Orchestrated QA/CI pipeline for TypeScript/React projects — the TypeScript analogue of php-qa-ci',
    description: [
      'A single devDependency that orchestrates formatting, linting, type-checking, structural/architecture checks, and testing behind one command — auto-fixing locally, failing the gate on any pending diff in CI.',
      'Includes a Component-Driven Development (CDD) ESLint rule tier that bans ad hoc raw HTML in component/page files, forcing all styling through a reviewable component API. A fast Rust-based pre-filter (oxlint) catches obvious problems before anything slower runs.',
      'This site (lts-commerce-site) is the first real dogfooding consumer — its own CI pipeline runs on ts-qa-ci.',
    ],
    language: 'TypeScript',
    status: 'Pre-release — not yet published to npm; install via git dependency',
    githubUrl: 'https://github.com/LongTermSupport/ts-qa-ci',
    installCommand: 'npm install --save-dev github:LongTermSupport/ts-qa-ci#<commit-sha>',
    highlights: [
      {
        title: 'Phase 0 — Fast Fail',
        detail:
          'oxlint, a Rust-based linter roughly 50-100x faster than ESLint, aborts the run in milliseconds on obvious problems.',
      },
      {
        title: 'Phase 1 — Code Modification',
        detail: 'Prettier and ESLint --fix apply every automatic fix (read-only/check mode in CI).',
      },
      {
        title: 'Phase 2 — Lint & Validation',
        detail:
          'A full ESLint report pass including the CDD rule tier, markdown link validation, and knip (dead code/unused dependency detection).',
      },
      {
        title: 'Phase 3 — Static Analysis',
        detail: 'tsc --noEmit and dependency-cruiser for structural/architecture checks.',
      },
      {
        title: 'Phase 4 — Testing',
        detail: 'Vitest and Playwright, with optional Stryker mutation testing.',
      },
    ],
  },
  {
    id: 'php-qa-ci',
    name: 'php-qa-ci',
    tagline: 'Comprehensive QA and CI pipeline for PHP 8.3+ projects',
    description: [
      'A composer package providing a single qa binary that runs PHP quality tools in a logical, fail-fast order — suitable for local development and CI alike.',
      'Uses a hybrid tool-delivery approach (PHARs via PHIVE, direct Composer dependencies, and an isolated Rector sub-project) to keep the tooling out of a consuming project’s own dependency graph.',
    ],
    language: 'PHP',
    status: 'Active',
    githubUrl: 'https://github.com/LongTermSupport/php-qa-ci',
    packagistPackage: 'lts/php-qa-ci',
    installCommand: 'composer require --dev lts/php-qa-ci:dev-php8.4@dev',
    highlights: [
      {
        title: 'Phase 1 — Code Modification',
        detail: 'Rector (safe functions, PHPUnit, PHP 8.4 upgrades) and PHP CS Fixer.',
      },
      {
        title: 'Phase 2 — Linting and Validation',
        detail:
          'PSR-4 validation, composer checks, strict types enforcement, PHP lint, Composer Require Checker, markdown link checking.',
      },
      {
        title: 'Phase 3 — Static Analysis',
        detail: 'PHPStan at max level, plus PHPArkitect for architecture rules.',
      },
      {
        title: 'Phase 4 — Testing',
        detail: 'PHPUnit, with optional Infection mutation testing.',
      },
    ],
  },
];

export function getAllProjects(): readonly OpenSourceProject[] {
  return PROJECTS;
}

export function getProjectById(id: string): OpenSourceProject | undefined {
  return PROJECTS.find(project => project.id === id);
}

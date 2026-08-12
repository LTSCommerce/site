/**
 * Open Source Projects
 *
 * Public repos published by Joseph Edmonds, across whichever GitHub account
 * actually hosts each one — content is kept factual and verifiable (No
 * Bullshit Rule, see CLAUDE.md), sourced directly from each repo's own
 * README/package manifest or the Packagist/GitHub API, not marketing copy.
 *
 * Grouped into three layers plus a supporting tier, per the site's thesis:
 * "Automate the enforcement, keep humans for the judgement."
 *   - Containment (CCY): blast radius — what an agent can reach
 *   - Policy (claude-code-hooks-daemon): permission — what an agent may do
 *   - Gates (php-qa-ci, ts-qa-ci, phpqa): shipping — what is allowed to leave
 *
 * Ordering within PROJECTS: layer priority first (containment, policy,
 * gates, supporting), newest/most relevant within each layer.
 */

import type { OpenSourceProject, ArchiveProject } from '@/types/project';

const PROJECTS: readonly OpenSourceProject[] = [
  {
    id: 'ccy',
    name: 'CCY (Claude Code YOLO)',
    tagline:
      'Rootless-Podman per-project sandboxing for AI coding agents — blast-radius containment',
    description: [
      'CCY runs Claude Code inside a disposable, rootless Podman container with permission prompts disabled, so an agent can work at full autonomy without the filesystem it can damage extending past the project it was launched in.',
      'It is the containment layer underneath everything else here: policy enforcement (the hooks daemon) and quality gates (the QA/CI packages) both assume an agent is already sandboxed. CCY is what makes that assumption safe to make.',
      'Lives inside the fedora-desktop repo rather than as a standalone package — it started as one piece of a broader "get a fresh Fedora box ready for development" toolkit and grew into its own subsystem.',
    ],
    language: 'Shell',
    status: 'Active — a subsystem of fedora-desktop, not an independently-versioned package',
    githubUrl: 'https://github.com/LongTermSupport/fedora-desktop/blob/master/docs/ccy.md',
    highlights: [
      {
        title: 'Rootless Podman',
        detail:
          'No root daemon, no privileged containers — the isolation boundary holds even if the agent inside is fully compromised.',
      },
      {
        title: 'Per-project, disposable',
        detail:
          'Each container is scoped to a single project and torn down after use — no persistent state to leak between engagements.',
      },
      {
        title: 'Built for --dangerously-skip-permissions',
        detail:
          'Designed specifically so permission prompts can be safely disabled — the sandbox is the safety net, not the prompts.',
      },
    ],
    layer: 'containment',
  },
  {
    id: 'claude-code-hooks-daemon',
    name: 'claude-code-hooks-daemon',
    tagline:
      '107 handlers enforcing deterministic guardrails on AI coding agents — the policy layer',
    description: [
      'A daemon-based hooks system for Claude Code: 107 handler implementations spread across pre-tool-use, post-tool-use, session-start, and stop events, covering everything from blocking destructive git commands to catching security antipatterns to enforcing project-specific plan workflows.',
      'The test tree is roughly 2.3x the size of the source tree — source runs to around 66,000 lines, tests to around 155,000. 122 releases since the first alpha, with continuous active development.',
      'This site is a dogfooding consumer: this exact repository runs the daemon as part of its own development workflow, including several of the handler guardrails described in this project catalogue.',
    ],
    language: 'Python',
    status: 'Active',
    githubUrl: 'https://github.com/Edmonds-Commerce-Limited/claude-code-hooks-daemon',
    highlights: [
      {
        title: 'Pre-tool-use guardrails',
        detail:
          'Blocks destructive git commands, security antipatterns, error-suppression patterns, and sensitive-content leaks before a tool call executes.',
      },
      {
        title: 'Post-tool-use & session hooks',
        detail:
          'Tracks backgrounded processes, audits hook registration, checks plan-document QA, and surfaces drift reports at session start.',
      },
      {
        title: 'Project-level extensibility',
        detail: 'Consuming repos can add their own handlers without forking the daemon itself.',
      },
      {
        title: '122 releases',
        detail:
          'Continuous delivery from a 2025-01 alpha to the current version — actively maintained, not a one-off script.',
      },
    ],
    layer: 'policy',
  },
  {
    id: 'php-qa-ci',
    name: 'php-qa-ci',
    tagline:
      'Comprehensive QA and CI pipeline for PHP 8.3+ projects — still pulled around 800 times a month',
    description: [
      'A composer package providing a single qa binary that runs PHP quality tools in a logical, fail-fast order — suitable for local development and CI alike.',
      'Uses a hybrid tool-delivery approach (PHARs via PHIVE, direct Composer dependencies, and an isolated Rector sub-project) to keep the tooling out of a consuming project’s own dependency graph.',
      'Currently averaging around 807 installs a month on Packagist — the strongest current-usage signal of anything in this catalogue. (Packagist counts install events, including CI re-installs on every build, so this measures build volume more than distinct users — still the more honest number to lead with than a lifetime total.)',
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
    layer: 'gates',
  },
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
    layer: 'gates',
  },
  {
    id: 'phpqa',
    name: 'phpqa',
    tagline: '22,918 lifetime installs — the most-installed thing Joseph has published',
    description: [
      'A composer package providing PHP quality-assurance tooling — linting, static analysis, and test orchestration behind a single command. The direct predecessor to php-qa-ci, and still the most widely-installed thing in this catalogue.',
      'Averaging around 63 installs a month on Packagist, on top of 22,918 lifetime installs — a package that has stayed in active use well past its original release.',
    ],
    language: 'PHP',
    status: 'Active',
    githubUrl: 'https://github.com/edmondscommerce/phpqa',
    packagistPackage: 'edmondscommerce/phpqa',
    installCommand: 'composer require --dev edmondscommerce/phpqa',
    highlights: [
      {
        title: 'Single-command QA',
        detail: 'Wraps PHP linting, static analysis, and test orchestration behind one binary.',
      },
      {
        title: '22,918 lifetime installs',
        detail:
          'The most-installed package Joseph has published, on Packagist’s own install-event count.',
      },
    ],
    layer: 'gates',
  },
  {
    id: 'typesafe-functions',
    name: 'typesafe-functions',
    tagline: 'Type-safe wrappers around PHP’s native functions — 16,528 lifetime installs',
    description: [
      'PHP’s built-in functions are notoriously loose with their return types (string|false, array|null, and so on). This package wraps the common ones in strictly-typed equivalents that throw instead of silently returning a sentinel value.',
      'Averaging around 68 installs a month on Packagist, on top of 16,528 lifetime installs.',
    ],
    language: 'PHP',
    status: 'Active',
    githubUrl: 'https://github.com/edmondscommerce/typesafe-functions',
    packagistPackage: 'edmondscommerce/typesafe-functions',
    installCommand: 'composer require edmondscommerce/typesafe-functions',
    highlights: [
      {
        title: 'Strict return types',
        detail:
          'Wraps loosely-typed native PHP functions so failures throw instead of returning false/null.',
      },
    ],
    layer: 'supporting',
  },
  {
    id: 'fedora-desktop',
    name: 'fedora-desktop',
    tagline: 'Taking a freshly installed Fedora desktop and getting it ready for development',
    description: [
      'Ansible-driven setup for a Fedora development workstation — the repo that CCY (see the Containment layer above) lives inside, alongside broader desktop and LXC tooling.',
    ],
    language: 'Shell',
    status: 'Active',
    githubUrl: 'https://github.com/LongTermSupport/fedora-desktop',
    highlights: [
      {
        title: 'Ansible-driven',
        detail: 'Repeatable, idempotent workstation setup rather than a manual checklist.',
      },
      {
        title: 'Hosts CCY',
        detail:
          'The rootless-Podman agent-sandboxing subsystem described in the Containment layer above.',
      },
    ],
    layer: 'supporting',
  },
  {
    id: 'mock-server',
    name: 'mock-server',
    tagline: 'A simple, lean HTTP mock server for integration testing — 2,782 lifetime installs',
    description: [
      'A lightweight mock server used to stub external HTTP dependencies in integration tests, avoiding flaky or slow calls to real third-party services during CI.',
      'A stable, mature utility rather than an actively-growing one — install volume is currently flat rather than trending, so this is presented as a lifetime total rather than a current-rate claim.',
    ],
    language: 'PHP',
    status: 'Stable',
    githubUrl: 'https://github.com/edmondscommerce/mock-server',
    packagistPackage: 'edmondscommerce/mock-server',
    highlights: [
      {
        title: 'Stubs external HTTP calls',
        detail:
          'Keeps integration tests fast and deterministic instead of depending on real third-party services.',
      },
    ],
    layer: 'supporting',
  },
  {
    id: 'doctrine-static-meta',
    name: 'doctrine-static-meta',
    tagline: 'Static metadata generation for Doctrine entities — legacy, archived',
    description: [
      'Generated boilerplate for Doctrine ORM entities from static metadata definitions. 3,449 lifetime installs, but marked abandoned on Packagist and archived on GitHub — included here for completeness and honesty about the full body of work, not as an active recommendation.',
    ],
    language: 'PHP',
    status: 'Archived — no longer maintained',
    githubUrl: 'https://github.com/edmondscommerce/doctrine-static-meta',
    packagistPackage: 'edmondscommerce/doctrine-static-meta',
    highlights: [
      {
        title: 'Archived',
        detail:
          'Marked abandoned on Packagist and archived on GitHub — listed for a complete record, not as current recommended tooling.',
      },
    ],
    layer: 'supporting',
  },
  {
    id: 'llm-friendly-qa-wrappers',
    name: 'llm-friendly-qa-wrappers',
    tagline: 'LLM-friendly wrappers for common QA tools — terse terminal output, JSON-first',
    description: [
      'Wrappers around ESLint, Prettier, Jest, PHPStan, PHPUnit, Ruff, MyPy, ShellCheck and others, built specifically for agent consumption: terse terminal output for a human, detailed native-JSON logs for a tool to parse. A newer, narrower piece of the same QA-gates thesis as php-qa-ci/ts-qa-ci/phpqa.',
    ],
    language: 'Shell',
    status: 'Active — early stage',
    githubUrl: 'https://github.com/edmondscommerce/llm-friendly-qa-wrappers',
    highlights: [
      {
        title: 'Native JSON output',
        detail:
          'Structured logs designed for an LLM agent to parse directly, not scraped from human-formatted terminal text.',
      },
    ],
    layer: 'supporting',
  },
];

/**
 * Historical/archive-tier repos — eleven years of published test and CI
 * infrastructure, continuously since February 2015 (selenium-server,
 * created 2015-02-11, is the earliest confirmed repo in this lineage).
 * Lighter weight than PROJECTS: no detail page, just a dated, grouped list.
 */
const ARCHIVE_PROJECTS: readonly ArchiveProject[] = [
  {
    name: 'selenium-server',
    url: 'https://github.com/edmondscommerce/selenium-server',
    note: 'Created Feb 2015 — the earliest repo in this lineage',
  },
  {
    name: 'behat-framework',
    url: 'https://github.com/edmondscommerce/behat-framework',
    note: 'Created Jan 2016 — the flagship of 18 Behat/Selenium context repos',
  },
  {
    name: 'behat-magento-2-context',
    url: 'https://github.com/edmondscommerce/behat-magento-2-context',
    note: 'Behat context',
  },
  {
    name: 'behat-magento-one-context',
    url: 'https://github.com/edmondscommerce/behat-magento-one-context',
    note: 'Behat context',
  },
  {
    name: 'behat-prestashop-context',
    url: 'https://github.com/edmondscommerce/behat-prestashop-context',
    note: 'Behat context',
  },
  {
    name: 'behat-virtuemart',
    url: 'https://github.com/edmondscommerce/behat-virtuemart',
    note: 'Behat context',
  },
  {
    name: 'behat-chrome-performance-context',
    url: 'https://github.com/edmondscommerce/behat-chrome-performance-context',
    note: 'Behat context',
  },
  {
    name: 'behat-db-context',
    url: 'https://github.com/edmondscommerce/behat-db-context',
    note: 'Behat context',
  },
  {
    name: 'behat-error-detection-context',
    url: 'https://github.com/edmondscommerce/behat-error-detection-context',
    note: 'Behat context',
  },
  {
    name: 'behat-error-handling-context',
    url: 'https://github.com/edmondscommerce/behat-error-handling-context',
    note: 'Behat context',
  },
  {
    name: 'behat-faker-context',
    url: 'https://github.com/edmondscommerce/behat-faker-context',
    note: 'Created Feb 2015',
  },
  {
    name: 'behat-html-context',
    url: 'https://github.com/edmondscommerce/behat-html-context',
    note: 'Behat context',
  },
  {
    name: 'behat-javascript-context',
    url: 'https://github.com/edmondscommerce/behat-javascript-context',
    note: 'Behat context',
  },
  {
    name: 'behat-monolog',
    url: 'https://github.com/edmondscommerce/behat-monolog',
    note: 'Behat context',
  },
  {
    name: 'behat-mouse-context',
    url: 'https://github.com/edmondscommerce/behat-mouse-context',
    note: 'Behat context',
  },
  {
    name: 'behat-screenshot-context',
    url: 'https://github.com/edmondscommerce/behat-screenshot-context',
    note: 'Behat context',
  },
  {
    name: 'behat-zalenium-context',
    url: 'https://github.com/edmondscommerce/behat-zalenium-context',
    note: 'Behat context',
  },
  {
    name: 'magento2-zalenium',
    url: 'https://github.com/edmondscommerce/magento2-zalenium',
    note: 'Zalenium integration',
  },
  {
    name: 'ansible-role-vault-scripts',
    url: 'https://github.com/LongTermSupport/ansible-role-vault-scripts',
    note: 'Ansible Vault encrypt-string workflow, packaged as a role',
  },
  {
    name: 'ansible-role-centos',
    url: 'https://github.com/LongTermSupport/ansible-role-centos',
    note: 'Ansible role',
  },
  {
    name: 'template-ansible-role',
    url: 'https://github.com/LongTermSupport/template-ansible-role',
    note: 'Repository template for new Ansible roles',
  },
  {
    name: 'microdeps-curl',
    url: 'https://github.com/LongTermSupport/microdeps-curl',
    note: 'MicroDeps utility library',
  },
  {
    name: 'microdeps-installer',
    url: 'https://github.com/LongTermSupport/microdeps-installer',
    note: 'Installer for copying MicroDeps into first-party code',
  },
  {
    name: 'microdeps-safeobjects',
    url: 'https://github.com/LongTermSupport/microdeps-safeobjects',
    note: 'Objects safe from dynamic-property foot guns',
  },
  {
    name: 'microdeps-pdo',
    url: 'https://github.com/LongTermSupport/microdeps-pdo',
    note: 'Simple, lean, well-tested PDO factory',
  },
];

export function getAllProjects(): readonly OpenSourceProject[] {
  return PROJECTS;
}

export function getProjectById(id: string): OpenSourceProject | undefined {
  return PROJECTS.find(project => project.id === id);
}

export function getProjectsByLayer(
  layer: OpenSourceProject['layer']
): readonly OpenSourceProject[] {
  return PROJECTS.filter(project => project.layer === layer);
}

export function getArchiveProjects(): readonly ArchiveProject[] {
  return ARCHIVE_PROJECTS;
}

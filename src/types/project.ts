/**
 * Open Source Project Type Definitions
 *
 * Type-safe data structures for the public-repo catalogue (LTS-published
 * open source packages/tools). Distinct from client work — covers repos
 * genuinely published by Joseph Edmonds, across whichever GitHub account or
 * org actually hosts each one (LongTermSupport, Edmonds-Commerce-Limited,
 * edmondscommerce — `githubUrl` is always the source of truth per project).
 */

/**
 * A single pipeline phase or feature highlight, shown as a bullet on the
 * project detail page.
 */
export interface ProjectHighlight {
  readonly title: string;
  readonly detail: string;
}

/**
 * Which layer of the "containment / policy / gates" thesis a project
 * belongs to, for grouping on the catalogue index page. Omitted for
 * projects that don't fit the thesis (they render in a general list).
 */
export type ProjectLayer = 'containment' | 'policy' | 'gates' | 'supporting';

export interface OpenSourceProject {
  /** Unique project identifier (URL slug), matches the GitHub repo name */
  readonly id: string;

  /** Display name */
  readonly name: string;

  /** One-line summary shown on cards and as the page subtitle */
  readonly tagline: string;

  /** Longer description shown on the detail page (plain text, one or more paragraphs) */
  readonly description: readonly string[];

  /** Primary implementation language */
  readonly language: string;

  /** Current status — kept factual, not marketing copy (e.g. "Active", "Pre-release") */
  readonly status: string;

  /** GitHub repository URL */
  readonly githubUrl: string;

  /** Packagist package name, if published (e.g. "lts/php-qa-ci") */
  readonly packagistPackage?: string;

  /** npm package name, if published (e.g. "@longtermsupport/ts-qa-ci") */
  readonly npmPackage?: string;

  /** Install command shown as a code block, if applicable */
  readonly installCommand?: string;

  /** Feature/pipeline-phase highlights shown as a bulleted list */
  readonly highlights: readonly ProjectHighlight[];

  /** Thesis layer for grouping on the catalogue index (see ProjectLayer) */
  readonly layer?: ProjectLayer;
}

/** A historical/archive-tier repo — lighter weight than a full catalogue entry, no detail page */
export interface ArchiveProject {
  readonly name: string;
  readonly url: string;
  readonly note: string;
}

/**
 * Type guard: Check if object is an OpenSourceProject
 */
export function isOpenSourceProject(value: unknown): value is OpenSourceProject {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'tagline' in value &&
    'githubUrl' in value
  );
}

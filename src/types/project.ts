/**
 * Open Source Project Type Definitions
 *
 * Type-safe data structures for the public-repo catalogue (LTS-published
 * open source packages/tools). Distinct from client work — this catalogue
 * exists only for repos genuinely published under the LongTermSupport org.
 */

/**
 * A single pipeline phase or feature highlight, shown as a bullet on the
 * project detail page.
 */
export interface ProjectHighlight {
  readonly title: string;
  readonly detail: string;
}

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

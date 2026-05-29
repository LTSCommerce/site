/**
 * Article Type Definitions
 *
 * Type-safe article data structures for the LTS Commerce site.
 */

import type { CategoryId } from '@/data/categories';

/**
 * Editorial register — defines prose standards for AI tooling (humanisation, review).
 * All new articles must declare this explicitly. Existing articles without the field
 * default to 'formal' (see DEFAULT_ARTICLE_REGISTER).
 *
 * formal: no contractions, authoritative third-person, direct assertions, active voice,
 *         no hedging, no first-person, British English spelling preferred.
 */
export type ArticleRegister = 'formal';

/** Site-wide fallback used by agents when an article omits the register field. */
export const DEFAULT_ARTICLE_REGISTER: ArticleRegister = 'formal';

/**
 * Article metadata and content
 */
export interface Article {
  /** Unique article identifier (URL slug) */
  readonly id: string;

  /** Article title */
  readonly title: string;

  /** Short description/excerpt */
  readonly description: string;

  /** Publication date (ISO 8601 format) */
  readonly date: string;

  /** Article category */
  readonly category: CategoryId;

  /** Estimated reading time in minutes */
  readonly readingTime: number;

  /** Article content (HTML or React component) */
  readonly content?: string | React.ReactNode;

  /** Article author (defaults to site owner) */
  readonly author?: string;

  /** Article tags for search/filtering */
  readonly tags?: readonly string[];

  /** Subreddit for social sharing (e.g., 'PHP', 'typescript', 'programming') */
  readonly subreddit?: string;

  /**
   * Editorial register — must be set on all new articles.
   * AI tools (content-editor, article-reviewer) read this field to determine
   * prose standards. Omitting it falls back to DEFAULT_ARTICLE_REGISTER.
   */
  readonly register?: ArticleRegister;
}

/**
 * Article preview (subset of Article for listing pages)
 */
export type ArticlePreview = Pick<
  Article,
  'id' | 'title' | 'description' | 'date' | 'category' | 'readingTime'
>;

/**
 * Type guard: Check if object is an Article
 */
export function isArticle(value: unknown): value is Article {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'description' in value &&
    'date' in value &&
    'category' in value &&
    'readingTime' in value
  );
}

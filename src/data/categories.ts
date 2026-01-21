/**
 * Article Categories for LTS Commerce Site
 *
 * Type-safe category definitions for technical articles.
 * Each category has unique ID, display label, and brand color.
 */

/* eslint-disable custom/use-types-not-strings -- This file defines the category constants */
export const CATEGORIES = {
  php: {
    id: 'php' as const,
    label: 'PHP',
    color: '#8B5CF6', // Purple
    description: 'Modern PHP development, patterns, and best practices',
  },
  infrastructure: {
    id: 'infrastructure' as const,
    label: 'Infrastructure',
    color: '#10B981', // Green
    description: 'DevOps, deployment, and infrastructure automation',
  },
  database: {
    id: 'database' as const,
    label: 'Database',
    color: '#3B82F6', // Blue
    description: 'Database optimization, architecture, and performance',
  },
  ai: {
    id: 'ai' as const,
    label: 'AI & LLMs',
    color: '#F59E0B', // Orange/Amber
    description: 'Artificial intelligence, LLMs, and integration patterns',
  },
  typescript: {
    id: 'typescript' as const,
    label: 'TypeScript',
    color: '#3178C6', // TypeScript Blue
    description: 'TypeScript development, type safety, and patterns',
  },
} as const;

export type CategoryId = (typeof CATEGORIES)[keyof typeof CATEGORIES]['id'];
export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

/**
 * Get category by ID (type-safe)
 */
export function getCategoryById(id: CategoryId): Category {
  return CATEGORIES[id];
}

/**
 * Get all categories as array
 */
export function getAllCategories(): readonly Category[] {
  return Object.values(CATEGORIES);
}

/**
 * Check if string is valid category ID
 */
export function isCategoryId(value: string): value is CategoryId {
  return value in CATEGORIES;
}

import type { RouteEntry } from './types/routing';

/**
 * Type-Safe Routes
 *
 * All routes are defined as RouteEntry objects with path and optional label.
 * This prevents hardcoded route strings throughout the application.
 *
 * Usage:
 * ```tsx
 * import { ROUTES } from '@/routes';
 *
 * // ✅ Correct - type-safe route reference
 * <Link to={ROUTES.home.path}>Home</Link>
 *
 * // ❌ Wrong - hardcoded string (ESLint error)
 * <Link to="/">Home</Link>
 * ```
 */

export const ROUTES = {
  home: { path: '/', label: 'Home' },
  about: { path: '/about', label: 'About' },
  articles: { path: '/articles', label: 'Articles' },
  contact: { path: '/contact', label: 'Contact' },
} as const satisfies Record<string, RouteEntry>;

/**
 * Type helper to get all route paths
 */
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]['path'];

/**
 * Type helper to get all route keys
 */
export type RouteKey = keyof typeof ROUTES;

/**
 * Dynamic Route Generators
 *
 * These functions generate RouteEntry objects for dynamic routes.
 * Using functions ensures type safety and prevents hardcoded route strings.
 */

/**
 * Generate route for individual article page
 *
 * @param slug - Article URL slug (kebab-case)
 * @returns RouteEntry for article detail page
 *
 * @example
 * ```tsx
 * const articleRoute = getArticleRoute('modern-php-patterns');
 * <Link to={articleRoute.path}>{articleRoute.label}</Link>
 * ```
 */
export function getArticleRoute(slug: string): RouteEntry {
  return {
    path: `/articles/${slug}`,
    // Label omitted - typically comes from article metadata
  };
}

/**
 * Generate route for category-filtered articles
 *
 * @param categoryId - Category ID from CATEGORIES
 * @returns RouteEntry for filtered article list
 *
 * @example
 * ```tsx
 * import { CATEGORIES } from '@/data/categories';
 * const phpArticles = getCategoryRoute(CATEGORIES.php.id);
 * <Link to={phpArticles.path}>{phpArticles.label}</Link>
 * ```
 */
export function getCategoryRoute(categoryId: string): RouteEntry {
  return {
    path: `/articles/category/${categoryId}`,
    // Label omitted - typically comes from category metadata
  };
}

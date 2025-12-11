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

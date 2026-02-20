/**
 * useMediaQuery Hook
 *
 * A React hook for responsive design that matches media queries
 * and updates when the viewport changes.
 *
 * Uses useSyncExternalStore for proper SSR/hydration support (React 18+).
 * This prevents hydration mismatches by providing separate server/client snapshots.
 *
 * More reliable than user agent sniffing as it:
 * - Responds to actual viewport size
 * - Updates on resize/orientation change
 * - Matches site breakpoints (lg: 1024px)
 * - Handles SSR correctly without hydration errors
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const isMobile = useMediaQuery('(max-width: 1023px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
import { useSyncExternalStore } from 'react';

/**
 * Server snapshot always returns false for SSR safety.
 * React knows this will differ from client and handles it properly.
 */
function getServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(query: string): boolean {
  // Subscribe function - sets up media query listener
  const subscribe = (callback: () => void) => {
    // SSR safety - no window during server render
    if (typeof window === 'undefined') return () => {};

    const mediaQuery = window.matchMedia(query);

    // Modern API (all browsers we support)
    mediaQuery.addEventListener('change', callback);

    return () => {
      mediaQuery.removeEventListener('change', callback);
    };
  };

  // Client snapshot - gets current match state
  const getSnapshot = () => {
    // SSR safety - return false during server render
    if (typeof window === 'undefined') return false;

    return window.matchMedia(query).matches;
  };

  // useSyncExternalStore properly handles SSR/hydration:
  // - During SSR: uses getServerSnapshot (false)
  // - During hydration: knows to expect mismatch, handles gracefully
  // - After hydration: uses getSnapshot (actual media query result)
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

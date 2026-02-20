/**
 * useMediaQuery Hook
 *
 * A React hook for responsive design that matches media queries
 * and updates when the viewport changes.
 *
 * Uses useSyncExternalStore for proper SSR/hydration support (React 18+).
 * This prevents hydration mismatches by providing separate server/client snapshots.
 *
 * subscribe and getSnapshot are memoized with useCallback/useMemo to provide
 * stable references to useSyncExternalStore, preventing unnecessary
 * unsubscribe/resubscribe on every parent re-render.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
import { useCallback, useMemo, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  const mediaQuery = useMemo(
    () => (typeof window !== 'undefined' ? window.matchMedia(query) : null),
    [query],
  );

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!mediaQuery) return () => undefined;
      mediaQuery.addEventListener('change', callback);
      return () => {
        mediaQuery.removeEventListener('change', callback);
      };
    },
    [mediaQuery],
  );

  const getSnapshot = useCallback(
    () => mediaQuery?.matches ?? false,
    [mediaQuery],
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

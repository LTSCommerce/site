/**
 * Body Loaded Hook
 *
 * Prevents FOUC (Flash of Unstyled Content) by adding a 'loaded' class
 * to the body element after the component mounts.
 */

import { useEffect } from 'react';

/**
 * Hook to add 'loaded' class to body for smooth fade-in effect
 *
 * @example
 * ```tsx
 * function App() {
 *   useBodyLoaded();
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useBodyLoaded(): void {
  useEffect(() => {
    // Add loaded class to trigger fade-in — intentionally no cleanup,
    // the loaded state is permanent once the app has mounted.
    document.body.classList.add('loaded');
  }, []);
}

import { RefObject, useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * useInView hook - Custom React hook wrapping Intersection Observer API
 *
 * This hook detects when an element enters the viewport and can be used
 * for scroll-triggered animations or lazy loading.
 *
 * Performance considerations:
 * - Automatically disconnects observer when triggerOnce is true
 * - Proper cleanup on component unmount
 * - Efficient re-observation when options change
 *
 * @param options - Configuration options
 * @param options.threshold - Intersection threshold (0-1, default: 0.1)
 * @param options.rootMargin - Margin around root (default: '0px')
 * @param options.triggerOnce - Only trigger once (default: true)
 * @returns Object with ref to attach to element and isInView boolean
 *
 * @example
 * ```tsx
 * const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true });
 * return <div ref={ref}>{isInView ? 'Visible!' : 'Not visible'}</div>;
 * ```
 */
export const useInView = (
  options: UseInViewOptions = {}
): { ref: RefObject<HTMLDivElement>; isInView: boolean } => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observerOptions: IntersectionObserverInit = {
      threshold,
      rootMargin,
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          observer.disconnect();
        }
      } else if (!triggerOnce) {
        // Allow re-triggering when element leaves viewport
        setIsInView(false);
      }
    }, observerOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
};

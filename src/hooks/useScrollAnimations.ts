/**
 * Scroll Animations Hook
 *
 * Implements elegant scroll-based animations using Intersection Observer.
 * Elements fade in and slide up when they enter the viewport.
 */

import { useEffect } from 'react';

/**
 * Hook to enable scroll-based animations for elements
 *
 * Observes elements with the 'scroll-animate' class and adds
 * fade-in and slide-up animations when they enter the viewport.
 *
 * @example
 * ```tsx
 * function Page() {
 *   useScrollAnimations();
 *   return (
 *     <div className="scroll-animate">
 *       Content that will animate on scroll
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollAnimations(): void {
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered animation delays
          setTimeout(() => {
            const target = entry.target as HTMLElement;
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      // Set initial state
      htmlElement.style.opacity = '0';
      htmlElement.style.transform = 'translateY(20px)';
      htmlElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(htmlElement);
    });

    // Cleanup
    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);
}

import { useEffect, useState } from 'react';

interface UseCTARotationOptions<T> {
  variants: T[];
  interval?: number;
  autoplay?: boolean;
}

/**
 * useCTARotation - Manages automatic rotation through an array of items
 *
 * Provides simple interval-based rotation logic for cycling through
 * any array of items at a configurable interval.
 *
 * Features:
 * - Auto-advance through items at specified interval
 * - Circular navigation (wraps around to start)
 * - Optional autoplay control
 * - Automatic cleanup on unmount
 *
 * @param variants - Array of items to rotate through
 * @param interval - Milliseconds between rotations (default: 8000)
 * @param autoplay - Whether to start rotating automatically (default: true)
 * @returns Object containing the current item
 *
 * @example
 * ```tsx
 * const { currentVariant } = useCTARotation({
 *   variants: ['Build systems', 'Automate infrastructure', 'Deliver results'],
 *   interval: 4000,
 * });
 * ```
 */
export function useCTARotation<T>({
  variants,
  interval = 8000,
  autoplay = true,
}: UseCTARotationOptions<T>): { currentVariant: T } {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Don't rotate if only one variant or autoplay disabled
    if (variants.length <= 1 || !autoplay) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % variants.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [variants.length, interval, autoplay]);

  const currentVariant = variants[currentIndex];
  if (currentVariant === undefined) {
    throw new Error('useCTARotation: No current variant - variants array must not be empty');
  }

  return {
    currentVariant,
  };
}

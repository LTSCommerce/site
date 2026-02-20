import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSlideshowOptions<T> {
  variants: T[];
  interval?: number;
  autoplay?: boolean;
}

interface UseSlideshowReturn<T> {
  currentVariant: T;
  currentIndex: number;
  next: () => void;
  prev: () => void;
  goTo: (targetIndex: number) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

/**
 * Custom hook for managing slideshow state and auto-advance logic
 *
 * Provides controls for:
 * - Auto-advancing through items at a specified interval
 * - Manual navigation (next/prev/goTo)
 * - Pause/resume functionality
 * - Circular navigation (wraps around)
 *
 * @param variants - Array of items to cycle through
 * @param interval - Auto-advance interval in milliseconds (default: 6000)
 * @param autoplay - Whether to start auto-advancing immediately (default: true)
 * @returns Current item and control functions
 *
 * @example
 * ```tsx
 * const { currentVariant, next, prev, isPaused, pause, resume } = useSlideshow({
 *   variants: slides,
 *   interval: 5000,
 * });
 * ```
 */
export function useSlideshow<T>({
  variants,
  interval = 6000,
  autoplay = true,
}: UseSlideshowOptions<T>): UseSlideshowReturn<T> {
  // Handle edge case: empty array
  if (variants.length === 0) {
    throw new Error('useSlideshow: variants array cannot be empty');
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoplay);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get current variant safely (guaranteed to exist since we check for empty array)
  const currentVariant = variants[currentIndex];
  if (currentVariant === undefined) {
    throw new Error(`useSlideshow: No variant found at index ${currentIndex.toString()}`);
  }

  /**
   * Navigate to next variant (circular)
   */
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % variants.length);
  }, [variants.length]);

  /**
   * Navigate to previous variant (circular)
   */
  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + variants.length) % variants.length);
  }, [variants.length]);

  /**
   * Navigate to specific variant by index
   */
  const goTo = useCallback(
    (targetIndex: number) => {
      if (targetIndex >= 0 && targetIndex < variants.length) {
        setCurrentIndex(targetIndex);
      }
    },
    [variants.length]
  );

  /**
   * Pause auto-advance
   */
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  /**
   * Resume auto-advance
   */
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  /**
   * Auto-advance logic
   * Clears and recreates interval when isPaused or interval changes
   */
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't set up interval if paused or only one variant
    if (isPaused || variants.length <= 1) {
      return;
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      next();
    }, interval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, interval, next, variants.length]);

  /**
   * Cleanup interval on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    currentVariant,
    currentIndex,
    next,
    prev,
    goTo,
    pause,
    resume,
    isPaused,
  };
}

/**
 * Hooks - Visual Effects and Utilities
 *
 * Custom React hooks for enhanced visual effects and interactions.
 *
 * Lifted from EC site (useInView, useMediaQuery, useCTARotation, useSlideshow):
 * - useInView: Intersection Observer for scroll-triggered animations (per-component)
 * - useMediaQuery: Responsive breakpoint detection via matchMedia with SSR safety
 * - useCTARotation: Generic auto-rotating content array with interval timer
 * - useSlideshow: Generic slideshow state machine with full nav controls
 */

export { useMouseResponsiveEffects } from './useMouseResponsiveEffects';
export { useBodyLoaded } from './useBodyLoaded';
export { useScrollAnimations } from './useScrollAnimations';
export { useInView } from './useInView';
export { useMediaQuery } from './useMediaQuery';
export { useCTARotation } from './useCTARotation';
export { useSlideshow } from './useSlideshow';

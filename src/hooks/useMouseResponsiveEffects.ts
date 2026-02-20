/**
 * Mouse-Responsive Effects Hook
 *
 * Implements dynamic gradient angles and shadow positions based on mouse movement.
 * Updates CSS custom properties in real-time for smooth visual effects.
 */

import { useEffect } from 'react';

/**
 * Throttle function to limit execution rate
 */
function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Hook to enable mouse-responsive gradient and shadow effects
 *
 * This hook listens to mouse movement and updates CSS custom properties:
 * - --gradient-angle: Dynamic gradient direction based on mouse position
 * - --shadow-x, --shadow-y: Shadow offsets that respond to mouse position
 * - --shadow-blur: Subtle blur variation based on distance from center
 *
 * @example
 * ```tsx
 * function App() {
 *   useMouseResponsiveEffects();
 *   return <div>Content with dynamic gradients</div>;
 * }
 * ```
 */
export function useMouseResponsiveEffects(): void {
  useEffect(() => {
    const dynamicGradientHandler = throttle((e: MouseEvent) => {
      // Calculate angle based on mouse position
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Convert to angle (in degrees), add offset for nice starting angle
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 135;

      // Update CSS custom property for gradient angle
      document.documentElement.style.setProperty('--gradient-angle', `${angle.toString()}deg`);

      // Calculate complementary drop shadow position (inverted from mouse)
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;

      // Calculate shadow offset (subtle, opposite to mouse position)
      const shadowX = (50 - mouseX) * 0.08; // Very subtle horizontal offset
      const shadowY = (50 - mouseY) * 0.06; // Very subtle vertical offset

      // Update CSS custom properties for dynamic shadow
      document.documentElement.style.setProperty('--shadow-x', `${shadowX.toString()}px`);
      document.documentElement.style.setProperty('--shadow-y', `${shadowY.toString()}px`);

      // Calculate subtle blur based on distance from center
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const blurIntensity = 2 + (distanceFromCenter / maxDistance) * 1; // 2-3px blur range

      document.documentElement.style.setProperty('--shadow-blur', `${blurIntensity.toString()}px`);
    }, 16); // 60fps

    // Reset to default values
    const resetValues = () => {
      document.documentElement.style.setProperty('--gradient-angle', '135deg');
      document.documentElement.style.setProperty('--shadow-x', '2px');
      document.documentElement.style.setProperty('--shadow-y', '2px');
      document.documentElement.style.setProperty('--shadow-blur', '2px');
    };

    // Add listeners
    document.addEventListener('mousemove', dynamicGradientHandler);
    document.addEventListener('mouseleave', resetValues);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', dynamicGradientHandler);
      document.removeEventListener('mouseleave', resetValues);
    };
  }, []);
}

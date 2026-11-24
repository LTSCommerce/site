/**
 * useCarouselState Hook
 *
 * Reads an Embla carousel's selection state (current slide, slide count,
 * whether it can scroll either way) and keeps it in sync as the carousel
 * changes.
 *
 * Embla owns this state, so it is an external store: useSyncExternalStore
 * subscribes to Embla's 'select' and 'reInit' events and reads the values
 * straight from the API, rather than copying them into React state from an
 * effect. 'reInit' matters for the slide count, which changes on resize.
 *
 * @example
 * const [api, setApi] = useState<CarouselApi>();
 * const { selectedIndex, snapCount } = useCarouselState(api);
 */
import { useCallback, useSyncExternalStore } from 'react';

/** The slice of the Embla API this hook uses (Embla's own API satisfies it). */
export interface CarouselStateApi {
  on: (event: 'select' | 'reInit', callback: () => void) => unknown;
  off: (event: 'select' | 'reInit', callback: () => void) => unknown;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
}

export interface CarouselState {
  selectedIndex: number;
  snapCount: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const serverZero = () => 0;
const serverFalse = () => false;

export function useCarouselState(api: CarouselStateApi | undefined): CarouselState {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!api) return () => undefined;
      api.on('select', callback);
      api.on('reInit', callback);
      return () => {
        api.off('select', callback);
        api.off('reInit', callback);
      };
    },
    [api]
  );

  const selectedIndex = useSyncExternalStore(
    subscribe,
    useCallback(() => api?.selectedScrollSnap() ?? 0, [api]),
    serverZero
  );
  const snapCount = useSyncExternalStore(
    subscribe,
    useCallback(() => api?.scrollSnapList().length ?? 0, [api]),
    serverZero
  );
  const canScrollPrev = useSyncExternalStore(
    subscribe,
    useCallback(() => api?.canScrollPrev() ?? false, [api]),
    serverFalse
  );
  const canScrollNext = useSyncExternalStore(
    subscribe,
    useCallback(() => api?.canScrollNext() ?? false, [api]),
    serverFalse
  );

  return { selectedIndex, snapCount, canScrollPrev, canScrollNext };
}

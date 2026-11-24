import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useCarouselState, type CarouselStateApi } from './useCarouselState';

type ExampleEvent = 'select' | 'reInit';

/** Minimal stand-in for an Embla API: just the members the hook reads. */
function createExampleApi(snapCount: number) {
  let selected = 0;
  const listeners: Record<ExampleEvent, Set<() => void>> = {
    select: new Set(),
    reInit: new Set(),
  };
  const api: CarouselStateApi = {
    on: (event, callback) => {
      listeners[event].add(callback);
      return api;
    },
    off: (event, callback) => {
      listeners[event].delete(callback);
      return api;
    },
    selectedScrollSnap: () => selected,
    scrollSnapList: () => Array.from({ length: snapCount }, (_, i) => i),
    canScrollPrev: () => selected > 0,
    canScrollNext: () => selected < snapCount - 1,
  };
  return {
    api,
    listenerCount: () => listeners.select.size + listeners.reInit.size,
    select: (index: number) => {
      selected = index;
      listeners.select.forEach(callback => {
        callback();
      });
    },
    reInit: (newSnapCount: number) => {
      snapCount = newSnapCount;
      listeners.reInit.forEach(callback => {
        callback();
      });
    },
  };
}

describe('useCarouselState', () => {
  it('returns empty state before the carousel API exists', () => {
    const { result } = renderHook(() => useCarouselState(undefined));
    expect(result.current).toEqual({
      selectedIndex: 0,
      snapCount: 0,
      canScrollPrev: false,
      canScrollNext: false,
    });
  });

  it('reads the initial state from the API', () => {
    const example = createExampleApi(3);
    const { result } = renderHook(() => useCarouselState(example.api));
    expect(result.current).toEqual({
      selectedIndex: 0,
      snapCount: 3,
      canScrollPrev: false,
      canScrollNext: true,
    });
  });

  it('updates when a slide is selected', () => {
    const example = createExampleApi(3);
    const { result } = renderHook(() => useCarouselState(example.api));
    act(() => {
      example.select(2);
    });
    expect(result.current.selectedIndex).toBe(2);
    expect(result.current.canScrollPrev).toBe(true);
    expect(result.current.canScrollNext).toBe(false);
  });

  it('updates the snap count on reInit', () => {
    const example = createExampleApi(3);
    const { result } = renderHook(() => useCarouselState(example.api));
    act(() => {
      example.reInit(5);
    });
    expect(result.current.snapCount).toBe(5);
  });

  it('unsubscribes from every event on unmount', () => {
    const example = createExampleApi(3);
    const { unmount } = renderHook(() => useCarouselState(example.api));
    expect(example.listenerCount()).toBeGreaterThan(0);
    unmount();
    expect(example.listenerCount()).toBe(0);
  });
});

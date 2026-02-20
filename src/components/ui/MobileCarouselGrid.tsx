/**
 * MobileCarouselGrid - Mobile carousel with desktop grid layout.
 *
 * CSS-first responsive wrapper that uses Embla carousel on mobile (<768px)
 * and standard CSS grid on desktop (>=768px).
 *
 * Adapted from EC site's MobileCarouselGrid -- Zod validation removed,
 * `@/components/ui/carousel` import updated to LTS local Carousel component.
 *
 * @example
 * <MobileCarouselGrid columns={3} showDots={true}>
 *   <MyCard title="Card 1" />
 *   <MyCard title="Card 2" />
 *   <MyCard title="Card 3" />
 * </MobileCarouselGrid>
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './Carousel';

export interface MobileCarouselGridProps {
  /** Card components to display */
  children: React.ReactNode[];
  /** Number of columns on desktop (default: 3) */
  columns?: 2 | 3 | 4;
  /** Additional CSS classes for container */
  className?: string;
  /** Show dot indicators on mobile (default: true) */
  showDots?: boolean;
}

/**
 * CarouselDots - Position indicator for Embla carousel (mobile only).
 *
 * Shows current slide position with dots (e.g. "• ○ ○" for slide 1 of 3).
 * Dots are clickable to navigate to specific slides.
 */
function CarouselDots({ api }: { api: CarouselApi | undefined }) {
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  // Create stable click handlers for each dot (memoised)
  const dotHandlers = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => () => {
        handleDotClick(i);
      }),
    [count, handleDotClick]
  );

  if (count <= 1) return null;

  return (
    <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Slide indicators">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to slide ${i + 1} of ${count}`}
          onClick={dotHandlers[i]}
          className={`h-2 rounded-full transition-all ${
            i === current ? 'w-6 bg-[#0f4c81]' : 'w-2 bg-gray-600 hover:bg-gray-500'
          }`}
        />
      ))}
    </div>
  );
}

export function MobileCarouselGrid({
  children,
  columns = 3,
  className = '',
  showDots = true,
}: MobileCarouselGridProps) {
  const [api, setApi] = useState<CarouselApi>();

  // Grid column classes for desktop
  const gridColClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns];

  return (
    <div className={className}>
      {/* Mobile: Embla Carousel */}
      <div className="md:hidden">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
            skipSnaps: false,
            dragFree: false,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {children.map((child, index) => (
              <CarouselItem key={index} className="basis-[85%] pl-2 md:pl-4">
                {child}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Previous/Next buttons hidden on mobile -- use swipe instead */}
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>

        {/* Dot indicators */}
        {showDots && <CarouselDots api={api} />}
      </div>

      {/* Desktop: Standard Grid */}
      <div className={`hidden gap-6 md:grid ${gridColClass}`}>
        {children.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    </div>
  );
}

export default MobileCarouselGrid;

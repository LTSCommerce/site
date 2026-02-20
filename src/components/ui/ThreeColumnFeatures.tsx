/**
 * ThreeColumnFeatures - Three-column feature showcase with mobile carousel.
 *
 * Displays exactly three features in a responsive layout:
 * - Mobile (<768px): Embla carousel with peek (90% width cards)
 * - Desktop (>=768px): 3-column CSS grid
 *
 * Adapted from EC site's ThreeColumnFeatures:
 * - CSI category colour system removed (getCategoryColour, getCategoryPath, getCategoryPath)
 * - Zod validation removed (ThreeColumnFeaturesPropsSchema, validateProps)
 * - Icon component replaced with direct Lucide icon rendering
 * - CardTitle/SubHeading replaced with inline typography
 * - linkToCategories prop removed (EC-specific)
 * - categories prop removed (EC-specific CSICategory tuple)
 * - Colour scheme simplified to 3 fixed LTS palette accents (teal → blue → brand-blue)
 * - CarouselIconIndicators simplified to plain dot indicators
 * - RouteEntry / HashLink / getLinkPath removed -- link is now a plain string (href)
 *
 * @example
 * <ThreeColumnFeatures
 *   features={[
 *     { title: 'PHP Development', description: '...', icon: Code2, items: ['...'] },
 *     { title: 'Infrastructure', description: '...', icon: Server },
 *     { title: 'AI Integration', description: '...', icon: Zap },
 *   ]}
 * />
 */
import { useEffect, useState } from 'react';

import type { LucideIcon } from 'lucide-react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './Carousel';

export interface ThreeColumnFeature {
  title: string;
  description: string;
  /** A Lucide icon component */
  icon: LucideIcon;
  /** Optional bullet-point list items */
  items?: string[];
  /** Optional link href -- makes the card a clickable anchor */
  link?: string;
}

export interface ThreeColumnFeaturesProps {
  /** Exactly 3 features to display */
  features: [ThreeColumnFeature, ThreeColumnFeature, ThreeColumnFeature];
  /** Base animation delay in ms (default: 400) */
  animationDelay?: number;
  /** Stagger between items in ms (default: 200) */
  stagger?: number;
  /** Show border hover effect (default: true) */
  showHoverEffect?: boolean;
  /** Card padding variant (default: 'default') */
  variant?: 'default' | 'compact';
}

/**
 * Fixed colour scheme for the three columns.
 * Teal → Blue → LTS brand blue -- matches LTS palette without EC CSI dependency.
 */
const COLOUR_SCHEME = ['teal', 'blue', 'brand'] as const;
type ColourKey = (typeof COLOUR_SCHEME)[number];

const iconColourMap: Record<ColourKey, string> = {
  teal: 'bg-teal-500/10 text-teal-400',
  blue: 'bg-blue-500/10 text-blue-400',
  brand: 'bg-[#0f4c81]/10 text-[#0f4c81]',
};

const hoverBorderMap: Record<ColourKey, string> = {
  teal: 'hover:border-teal-500',
  blue: 'hover:border-blue-500',
  brand: 'hover:border-[#0f4c81]',
};

const bulletColourMap: Record<ColourKey, string> = {
  teal: 'bg-teal-400',
  blue: 'bg-blue-400',
  brand: 'bg-[#0f4c81]',
};

type AnimationStyle = {
  animationDelay: string;
  animationFillMode: 'forwards';
};

/**
 * FeatureCard - Individual feature card rendered in both mobile carousel and desktop grid.
 */
function FeatureCard({
  feature,
  index,
  showHoverEffect,
  variant,
  animationDelay,
  stagger,
}: {
  feature: ThreeColumnFeature;
  index: number;
  showHoverEffect: boolean;
  variant: 'default' | 'compact';
  animationDelay: number;
  stagger: number;
}) {
  // COLOUR_SCHEME always has exactly 3 entries; index is always 0, 1, or 2
  const colourKey: ColourKey = COLOUR_SCHEME[index] ?? 'brand';
  const iconColourClass = iconColourMap[colourKey];
  const hoverBorderClass = showHoverEffect ? hoverBorderMap[colourKey] : '';
  const bulletColourClass = bulletColourMap[colourKey];

  const responsivePaddingClass = variant === 'compact' ? 'p-4 md:p-6' : 'p-6 md:p-8';

  const animationStyle: AnimationStyle = {
    animationDelay: `${animationDelay + index * stagger}ms`,
    animationFillMode: 'forwards',
  };

  const Icon = feature.icon;

  const cardContent = (
    <>
      {/* Icon */}
      <div
        className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-sm ${iconColourClass}`}
      >
        <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
      </div>

      {/* Title */}
      <h3 className="mb-3 text-base font-semibold text-white">{feature.title}</h3>

      {/* Description */}
      <p className={`text-sm font-light text-gray-400 ${feature.items ? 'mb-6' : ''}`}>
        {feature.description}
      </p>

      {/* Optional bullet list */}
      {feature.items && feature.items.length > 0 && (
        <ul className="space-y-2">
          {feature.items.map(item => (
            <li key={item} className="flex items-start gap-2 text-sm font-light">
              <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletColourClass}`} />
              <span className="text-gray-400">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const baseClasses = `group flex h-full flex-col rounded-sm border border-gray-700 bg-gray-800/50 ${responsivePaddingClass} transition-all ${hoverBorderClass}`;

  // Wrap in animate class only if CSS animation is defined in project styles
  const animatedClasses = `${baseClasses} opacity-0 animate-fade-in-up`;

  return feature.link ? (
    <a href={feature.link} className={`${animatedClasses} block`} style={animationStyle}>
      {cardContent}
    </a>
  ) : (
    <div className={animatedClasses} style={animationStyle}>
      {cardContent}
    </div>
  );
}

/**
 * CarouselDots - Simple dot indicators for the mobile carousel.
 */
function CarouselDots({ api }: { api: CarouselApi | undefined }) {
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => { setCurrent(api.selectedScrollSnap()); };
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (count <= 1) return null;

  return (
    <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Slide indicators">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to slide ${i + 1} of ${count}`}
          onClick={() => api?.scrollTo(i)}
          className={`h-2 rounded-full transition-all ${
            i === current ? 'w-6 bg-[#0f4c81]' : 'w-2 bg-gray-600 hover:bg-gray-500'
          }`}
        />
      ))}
    </div>
  );
}

export function ThreeColumnFeatures({
  features,
  animationDelay = 400,
  stagger = 200,
  showHoverEffect = true,
  variant = 'default',
}: ThreeColumnFeaturesProps) {
  const [api, setApi] = useState<CarouselApi>();

  const sharedCardProps = { showHoverEffect, variant, animationDelay, stagger };

  return (
    <>
      {/* Mobile: Full-width Embla carousel */}
      <div className="md:hidden">
        <Carousel
          opts={{
            align: 'center',
            loop: false,
            skipSnaps: false,
            dragFree: false,
            containScroll: false as const,
            duration: 35,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {features.map((feature, index) => (
              <CarouselItem key={feature.title} className="basis-[90%] pl-2">
                <FeatureCard feature={feature} index={index} {...sharedCardProps} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Prev/Next hidden -- use swipe */}
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>

        <CarouselDots api={api} />
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden gap-6 md:grid md:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} {...sharedCardProps} />
        ))}
      </div>
    </>
  );
}

export default ThreeColumnFeatures;

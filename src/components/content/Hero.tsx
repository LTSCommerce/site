/**
 * Hero Component
 *
 * Minimal, clean hero section with Tailwind CSS.
 * Features title, subtitle, and optional CTA button.
 */

import { Link } from 'react-router-dom';
import type { RouteEntry } from '@/types/routing';
import { getLinkPath } from '@/types/routing';

interface HeroProps {
  title: string;
  subtitle?: string;
  cta?: {
    text: string;
    link: RouteEntry;
  };
}

export function Hero({ title, subtitle, cta }: HeroProps) {
  return (
    <section className="py-16 md:py-24 px-4 text-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}

        {cta && (
          <Link
            to={getLinkPath(cta.link)}
            className="inline-block px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            {cta.text}
          </Link>
        )}
      </div>
    </section>
  );
}

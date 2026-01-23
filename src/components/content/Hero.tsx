/**
 * Hero Component
 *
 * Minimal hero section with pure typography.
 * Features title, subtitle, and optional CTA.
 */

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
    <section className="py-24 md:py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8">{title}</h1>

        {subtitle && <p className="text-lg max-w-2xl mb-12">{subtitle}</p>}

        {cta && (
          <a
            href={getLinkPath(cta.link)}
            className="inline-block px-8 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md"
          >
            {cta.text}
          </a>
        )}
      </div>
    </section>
  );
}

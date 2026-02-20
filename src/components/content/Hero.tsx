/**
 * Hero Component
 *
 * Full-width dark hero with centered content, credentials bar, and dual CTAs.
 */

import { Link } from 'react-router-dom';
import type { RouteEntry } from '@/types/routing';
import { getLinkPath } from '@/types/routing';
import { ROUTES } from '@/routes';

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
    <section className="bg-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto px-6 py-28 md:py-36 text-center">

        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#111] text-xs text-gray-500 mb-10 font-mono uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0f4c81] animate-pulse" />
          Available for engagements
        </div>

        {/* Headline */}
        <h1 className="text-white text-4xl md:text-6xl lg:text-[4.5rem] font-bold mb-6 leading-[1.1] tracking-tight mt-0">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {cta && (
            <a
              href={getLinkPath(cta.link)}
              className="px-7 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium rounded-md transition-colors text-sm"
            >
              {cta.text}
            </a>
          )}
          <Link
            to={ROUTES.articles.path}
            className="px-7 py-3 border border-[#2a2a2a] hover:border-[#444] text-gray-300 hover:text-white font-medium rounded-md transition-colors text-sm"
          >
            Read Articles
          </Link>
        </div>

        {/* Credentials bar */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a] grid grid-cols-3 gap-6 max-w-xs mx-auto">
          <div>
            <div className="text-xl font-bold text-white">18+</div>
            <div className="text-xs text-gray-600 mt-0.5">Years PHP</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">Packt</div>
            <div className="text-xs text-gray-600 mt-0.5">Published</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">AI&#8209;First</div>
            <div className="text-xs text-gray-600 mt-0.5">Workflows</div>
          </div>
        </div>

      </div>
    </section>
  );
}

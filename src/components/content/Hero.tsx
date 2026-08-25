/**
 * Hero Component
 *
 * Full-width dark hero with centered content, credentials bar, and dual CTAs.
 */

import { Link } from 'react-router-dom';
import type { RouteEntry } from '@/types/routing';
import { getLinkPath } from '@/types/routing';
import { ROUTES } from '@/routes';

export interface HeroProps {
  title: string;
  subtitle?: string;
  cta?: {
    text: string;
    link: RouteEntry;
  };
  /** Short line naming who this isn't for, shown below the CTAs */
  disqualifier?: string;
  /** Personal identity greeting shown above the headline */
  identity?: string;
}

export function Hero({ title, subtitle, cta, disqualifier, identity }: HeroProps) {
  return (
    <section className="bg-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        {/* Thesis line */}
        <div className="text-xs text-gray-400 mb-8 font-mono uppercase tracking-widest">
          Containment &middot; Policy &middot; Gates
        </div>

        {/* Identity greeting */}
        {identity && (
          <p className="text-gray-200 text-xl md:text-2xl font-medium mb-4">{identity}</p>
        )}

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

        {/* Disqualifier */}
        {disqualifier && (
          <p className="mt-10 text-sm text-gray-400 max-w-md mx-auto">{disqualifier}</p>
        )}

        {/* Credentials bar */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a] grid grid-cols-3 gap-6 max-w-xs mx-auto">
          <div>
            <div className="text-xl font-bold text-white">20+</div>
            <div className="text-xs text-gray-400 mt-0.5">Years PHP</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">Packt</div>
            <div className="text-xs text-gray-400 mt-0.5">Published</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">AI&#8209;First</div>
            <div className="text-xs text-gray-400 mt-0.5">Workflows</div>
          </div>
        </div>
      </div>
    </section>
  );
}

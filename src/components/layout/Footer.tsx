/**
 * Footer Component
 *
 * Dark footer — no Flowbite dependency.
 * Brand left, nav + connect columns right, copyright bar.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-gray-400 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to={ROUTES.home.path} className="flex items-center mb-4">
              <img src="/logo-mono-light.svg" alt="LTS Commerce" className="h-8 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Bespoke PHP development and infrastructure for complex, high-throughput backend
              systems. 18+ years. No bullshit.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-5 mt-0">
              Navigation
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              {[ROUTES.home, ROUTES.articles, ROUTES.about, ROUTES.contact].map(route => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-5 mt-0">
              Connect
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              <li>
                <a
                  href="https://github.com/LongTermSupport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/edmondscommerce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-[#1a1a1a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} LTS Commerce Ltd. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">TypeScript &amp; React</p>
        </div>
      </div>
    </footer>
  );
}

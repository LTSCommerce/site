/**
 * Footer Component
 *
 * Dark footer — no Flowbite dependency.
 * Brand left, nav + connect columns right, copyright bar.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

// Hardcoded rather than computed from `new Date()`: this is a static SSG
// build, so a runtime value would either be blank in the prerendered HTML
// until JS hydrates (bots, no-JS, first paint) or mismatch between the
// server-rendered year and whatever year the client happens to load in.
// Bump this by hand alongside other yearly maintenance.
const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-gray-400 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to={ROUTES.home.path} className="flex items-center mb-4">
              <img src="/logo-mono-light.svg" alt="LTS Commerce" className="h-8 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              I'm Joseph Edmonds — one engineer, 25 years of shipping. LTS stands for Long Term
              Support: retained expertise, on hand as and when you need it, from West Yorkshire,
              UK. No bullshit.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-5 mt-0">
              Navigation
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              {[ROUTES.home, ROUTES.articles, ROUTES.about, ROUTES.contact, ROUTES.privacy].map(
                route => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {route.label}
                    </Link>
                  </li>
                )
              )}
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
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/edmondscommerce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-[#1a1a1a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            &copy; {COPYRIGHT_YEAR} Joseph Edmonds · trading as LTS Commerce Ltd. Company No.
            16618262. Registered in England &amp; Wales. VAT registered.
          </p>
          <p className="text-xs text-gray-400">Built with TypeScript &amp; React</p>
        </div>
      </div>
    </footer>
  );
}

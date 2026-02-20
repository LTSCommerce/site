/**
 * Navigation Component
 *
 * Clean, custom navigation — no Flowbite dependency.
 * Logo left, nav links + CTA right, mobile hamburger.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '@/routes';
import type { RouteEntry } from '@/types/routing';

export function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ key: string; route: RouteEntry }> = [
    { key: 'articles', route: ROUTES.articles },
    { key: 'about', route: ROUTES.about },
  ];

  const isActive = (route: RouteEntry): boolean => {
    if (route.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(route.path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.home.path} className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.svg" alt="LTS Commerce" className="h-8 w-auto" />
            <span className="font-semibold text-gray-900 text-sm tracking-tight">LTSCommerce</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ key, route }) => (
              <Link
                key={key}
                to={route.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(route)
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {route.label}
              </Link>
            ))}
            <Link
              to={ROUTES.contact.path}
              className="ml-3 px-4 py-2 text-sm font-medium bg-[#0f4c81] hover:bg-[#1e6ba5] text-white rounded-md transition-colors"
            >
              Hire Me
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-900"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
          {navItems.map(({ key, route }) => (
            <Link
              key={key}
              to={route.path}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive(route)
                  ? 'text-gray-900 bg-gray-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {route.label}
            </Link>
          ))}
          <Link
            to={ROUTES.contact.path}
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-3 py-2.5 text-sm font-medium bg-[#0f4c81] text-white rounded-md text-center"
          >
            Hire Me
          </Link>
        </div>
      )}
    </header>
  );
}

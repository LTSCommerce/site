/**
 * Navigation Component
 *
 * Clean, custom navigation — no Flowbite dependency.
 * Logo left, nav links + CTA right, mobile hamburger.
 */

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AppLink } from '@/components/ui/AppLink';
import { ROUTES } from '@/routes';
import type { RouteEntry } from '@/types/routing';

export function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ key: string; route: RouteEntry }> = [
    { key: 'services', route: ROUTES.services },
    { key: 'articles', route: ROUTES.articles },
    { key: 'openSource', route: ROUTES.openSource },
    { key: 'about', route: ROUTES.about },
  ];

  const isActive = (route: RouteEntry): boolean => {
    if (route.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(route.path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/45 hover:bg-white/90 transition-colors duration-200 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo — always-opaque pill so it stays readable regardless of the translucent
              nav strip behind it or whatever's in a hero image under that */}
          <AppLink to={ROUTES.home.path} variant="navLogo">
            <img src="/logo-mark.svg" alt="LTS Commerce" className="h-8 w-8" />
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-gray-900">Joseph Edmonds</span>
              <span className="hidden md:block text-xs text-gray-500">
                Engineer &amp; Fractional CTO · LTS Commerce
              </span>
            </span>
          </AppLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ key, route }) => (
              <AppLink key={key} to={route.path} variant="navItem" active={isActive(route)}>
                {route.label}
              </AppLink>
            ))}
            <AppLink to={ROUTES.contact.path} variant="navCta">
              Hire Me
            </AppLink>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-900"
            onClick={() => {
              setMobileOpen(v => !v);
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
          {navItems.map(({ key, route }) => (
            <AppLink
              key={key}
              to={route.path}
              variant="navItemMobile"
              active={isActive(route)}
              onClick={() => {
                setMobileOpen(false);
              }}
            >
              {route.label}
            </AppLink>
          ))}
          <AppLink
            to={ROUTES.contact.path}
            variant="navCtaMobile"
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            Hire Me
          </AppLink>
        </div>
      ) : null}
    </header>
  );
}

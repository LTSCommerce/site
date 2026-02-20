/**
 * Navigation Component
 *
 * Professional navigation using Flowbite React Navbar.
 * Type-safe navigation using ROUTES object and React Router.
 * Responsive behaviour via useMediaQuery (desktop breakpoint: 768px+).
 */

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes';
import type { RouteEntry } from '@/types/routing';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface NavigationProps {
  variant?: 'horizontal' | 'vertical';
}

export function Navigation({ variant = 'horizontal' }: NavigationProps) {
  const location = useLocation();

  // Detect desktop breakpoint (md: 768px+) for responsive nav behaviour.
  // On desktop the hamburger toggle is hidden by Flowbite CSS, but we also
  // use this to apply desktop-only aria attributes and styling decisions.
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const navItems: Array<{ key: string; route: RouteEntry }> = [
    { key: 'home', route: ROUTES.home },
    { key: 'articles', route: ROUTES.articles },
    { key: 'about', route: ROUTES.about },
    { key: 'contact', route: ROUTES.contact },
  ];

  const isActive = (route: RouteEntry): boolean => {
    if (route.path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(route.path);
  };

  if (variant === 'vertical') {
    // Keep vertical variant as custom for now (used in mobile menus)
    return (
      <nav className="w-full">
        <ul className="flex flex-col gap-4 list-none m-0 p-0">
          {navItems.map(({ key, route }) => (
            <li key={key}>
              <Link
                to={route.path}
                className={`
                  relative px-1 py-2 text-sm font-medium transition-colors duration-200
                  ${
                    isActive(route)
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  }
                `}
              >
                {route.label}
                {isActive(route) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <Navbar fluid rounded className="border-none bg-transparent">
      <NavbarBrand>
        <Link to={ROUTES.home.path} className="flex items-center">
          <img src="/logo.svg" alt="LTS Commerce" className="h-12 w-auto" />
        </Link>
      </NavbarBrand>
      {/* Only render the hamburger toggle on mobile -- hidden on desktop */}
      {!isDesktop && <NavbarToggle />}
      <NavbarCollapse>
        {navItems.map(({ key, route }) => (
          <Link
            key={key}
            to={route.path}
            className={`
              block py-2 px-3 md:p-0 rounded
              ${
                isActive(route)
                  ? 'text-primary font-medium bg-primary-50 md:bg-transparent'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100 md:hover:bg-transparent'
              }
              transition-colors duration-200
            `}
          >
            {route.label}
          </Link>
        ))}
      </NavbarCollapse>
    </Navbar>
  );
}

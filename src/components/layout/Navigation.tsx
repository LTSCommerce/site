/**
 * Navigation Component
 *
 * Professional navigation using Flowbite React Navbar.
 * Type-safe navigation using ROUTES object and React Router.
 */

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes';
import type { RouteEntry } from '@/types/routing';

interface NavigationProps {
  variant?: 'horizontal' | 'vertical';
}

export function Navigation({ variant = 'horizontal' }: NavigationProps) {
  const location = useLocation();

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
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }
                `}
              >
                {route.label}
                {isActive(route) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
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
          <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900">
            LTS Commerce
          </span>
        </Link>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        {navItems.map(({ key, route }) => (
          <NavbarLink key={key} href={route.path} active={isActive(route)}>
            {route.label}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  );
}

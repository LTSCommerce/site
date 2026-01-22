/**
 * Navigation Component
 *
 * Professional navigation with Flowbite styling.
 * Type-safe navigation using ROUTES object and React Router.
 */

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

  return (
    <nav className={variant === 'vertical' ? 'w-full' : ''}>
      <ul
        className={`
          flex list-none m-0 p-0
          ${variant === 'horizontal' ? 'flex-row gap-8' : 'flex-col gap-4'}
        `}
      >
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

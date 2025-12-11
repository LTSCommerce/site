/**
 * Navigation Component
 *
 * Type-safe navigation using ROUTES object and React Router.
 * Automatically highlights active route.
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
    // Exact match for home
    if (route.path === '/') {
      return location.pathname === '/';
    }
    // Prefix match for other routes
    return location.pathname.startsWith(route.path);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: variant === 'horizontal' ? ('row' as const) : ('column' as const),
    gap: variant === 'horizontal' ? '2rem' : '1rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const linkStyle = (active: boolean) => ({
    textDecoration: 'none',
    color: active ? '#8B5CF6' : '#333',
    fontWeight: active ? '600' : '400',
    padding: '0.5rem',
    borderBottom: active ? '2px solid #8B5CF6' : '2px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <nav>
      <ul style={containerStyle}>
        {navItems.map(({ key, route }) => (
          <li key={key}>
            <Link to={route.path} style={linkStyle(isActive(route))}>
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

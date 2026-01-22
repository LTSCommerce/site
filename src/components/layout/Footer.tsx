/**
 * Footer Component
 *
 * Minimal, clean footer with Tailwind CSS.
 * Type-safe routes and external links.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import type { ExternalLink } from '@/types/routing';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks: Array<{ label: string; url: ExternalLink }> = [
    { label: 'GitHub', url: 'https://github.com/LongTermSupport' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/joseph-edmonds' },
  ];

  return (
    <footer
      className={`
        bg-gray-50 border-t border-gray-200 mt-16 py-12
        ${className || ''}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Quick Navigation */}
          <nav>
            <ul className="flex gap-8 list-none m-0 p-0">
              <li>
                <Link
                  to={ROUTES.home.path}
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {ROUTES.home.label}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.articles.path}
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {ROUTES.articles.label}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.about.path}
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {ROUTES.about.label}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.contact.path}
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {ROUTES.contact.label}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Links */}
          <div className="flex gap-6">
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {currentYear} LTS Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

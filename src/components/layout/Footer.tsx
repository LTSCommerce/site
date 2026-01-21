/**
 * Footer Component
 *
 * Site footer with copyright, social links, and navigation.
 * Uses type-safe routes and external links.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import type { ExternalLink } from '@/types/routing';

interface FooterProps {
  /** Optional additional CSS class */
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Type-safe external links
  const socialLinks: Array<{ label: string; url: ExternalLink }> = [
    { label: 'GitHub', url: 'https://github.com/LongTermSupport' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/joseph-edmonds' },
  ];

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '2rem 0',
    marginTop: '4rem',
    borderTop: '1px solid #e0e0e0',
  };

  const innerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
  };

  const navStyle = {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#666',
    fontSize: '0.9rem',
  };

  const socialStyle = {
    display: 'flex',
    gap: '1.5rem',
  };

  const copyrightStyle = {
    color: '#888',
    fontSize: '0.875rem',
  };

  return (
    <footer style={containerStyle} className={className}>
      <div style={innerStyle}>
        {/* Quick Navigation */}
        <nav>
          <ul style={navStyle}>
            <li>
              <Link to={ROUTES.home.path} style={linkStyle}>
                {ROUTES.home.label}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.articles.path} style={linkStyle}>
                {ROUTES.articles.label}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.about.path} style={linkStyle}>
                {ROUTES.about.label}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.contact.path} style={linkStyle}>
                {ROUTES.contact.label}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social Links */}
        <div style={socialStyle}>
          {socialLinks.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p style={copyrightStyle}>
          © {currentYear} LTS Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

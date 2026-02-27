/**
 * Page Component
 *
 * Minimal, clean page wrapper with Tailwind CSS.
 * Handles document title, meta description, and basic page structure.
 */

import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface PageProps {
  title: string;
  description?: string;
  children: ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

export function Page({
  title,
  description,
  children,
  showNavigation = true,
  showFooter = true,
}: PageProps) {
  // Update document title and meta (browser only — no-op during SSG prerender)
  if (typeof document !== 'undefined') {
    if (title) {
      document.title = title;
    }
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Navigation />}

      <main className="flex-1">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
}

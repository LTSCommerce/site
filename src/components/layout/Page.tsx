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
  // Update document title
  if (title) {
    document.title = title;
  }

  // Update meta description
  if (description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navigation />
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
}

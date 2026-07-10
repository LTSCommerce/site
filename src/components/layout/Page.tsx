/**
 * Page Component
 *
 * Minimal, clean page wrapper with Tailwind CSS.
 * Handles document title, meta description, and basic page structure.
 */

import { useEffect, type ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export interface PageProps {
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
  // Client-side title/meta update for SPA route changes (the SSG prerender already
  // bakes the correct <title>/<meta> per-route into the static HTML - this only
  // matters for in-app navigation after hydration). Moved into an effect: reading/
  // mutating `document` directly in the render body ran on every client render
  // (StrictMode double-invokes it, concurrent rendering can re-run it), which is a
  // side effect during render, not just an SSR/hydration mismatch risk.
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Navigation />}

      <main className="flex-1">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
}

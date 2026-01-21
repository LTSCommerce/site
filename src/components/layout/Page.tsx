import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface PageProps {
  /**
   * Page title (used in <title> tag)
   */
  title: string;

  /**
   * Optional meta description for SEO
   */
  description?: string;

  /**
   * Page content
   */
  children: ReactNode;

  /**
   * Show navigation? Default: true
   */
  showNavigation?: boolean;

  /**
   * Show footer? Default: true
   */
  showFooter?: boolean;
}

/**
 * Page Component
 *
 * Generic page wrapper that handles:
 * - Document title
 * - Meta description
 * - Basic page structure
 *
 * Example:
 * ```tsx
 * <Page title="Home" description="Welcome to our site">
 *   <h1>Content here</h1>
 * </Page>
 * ```
 */
export function Page({
  title,
  description,
  children,
  showNavigation = true,
  showFooter = true,
}: PageProps) {
  // In a real app, you'd use react-helmet or similar for head management
  // For skeleton, we keep it simple
  if (title) {
    document.title = title;
  }

  if (description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }

  return (
    <>
      {showNavigation && (
        <header
          style={{
            borderBottom: '1px solid #e5e7eb',
            padding: '1rem 2rem',
            backgroundColor: '#fff',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>LTS Commerce</div>
            <Navigation />
          </div>
        </header>
      )}
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}

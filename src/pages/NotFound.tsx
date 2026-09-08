import { Home, Search } from 'lucide-react';

import { Page } from '../components/layout/Page';
import { AppLink } from '../components/ui/AppLink';
import { Icon } from '../components/ui/Icon';
import { ROUTES } from '../routes';

export function NotFound() {
  return (
    <Page
      title="404 Error - Page Not Found | LTS Commerce"
      description="The page you are looking for does not exist or has been moved. Explore PHP, TypeScript, and infrastructure engineering articles, or return to the homepage."
    >
      <section className="bg-[#0A0A0A] text-white">
        <div className="max-w-3xl mx-auto px-6 py-28 md:py-36 text-center">
          <p className="text-[#0f4c81] font-mono text-sm uppercase tracking-widest mb-6">
            Error 404
          </p>

          <h1 className="text-7xl md:text-9xl font-bold text-white mb-4 tracking-tight">404</h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">Page Not Found</h2>

          <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <AppLink to={ROUTES.home.path} variant="ctaWithIcon">
              <Icon icon={Home} size="sm" aria-hidden />
              Return Home
            </AppLink>
            <AppLink to={ROUTES.articles.path} variant="outlineWithIcon">
              <Icon icon={Search} size="sm" aria-hidden />
              Browse Articles
            </AppLink>
          </div>

          <p className="text-gray-400 text-sm mt-10">
            If you believe this is an error, please{' '}
            <AppLink to={ROUTES.contact.path} variant="inlineHover">
              get in touch
            </AppLink>
            .
          </p>
        </div>
      </section>
    </Page>
  );
}

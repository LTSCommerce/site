import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { ROUTES } from '../routes';

export function NotFound() {
  return (
    <Page
      title="Page Not Found | LTS Commerce"
      description="The page you are looking for does not exist or has been moved."
    >
      <section className="bg-[#0A0A0A] text-white">
        <div className="max-w-3xl mx-auto px-6 py-28 md:py-36 text-center">
          <p className="text-[#0f4c81] font-mono text-sm uppercase tracking-widest mb-6">
            Error 404
          </p>

          <h1 className="text-7xl md:text-9xl font-bold text-white mb-4 tracking-tight">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={ROUTES.home.path}
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium rounded-md transition-colors text-sm"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Return Home
            </Link>
            <Link
              to={ROUTES.articles.path}
              className="inline-flex items-center gap-2 px-7 py-3 border border-[#2a2a2a] hover:border-[#444] text-gray-300 hover:text-white font-medium rounded-md transition-colors text-sm"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Browse Articles
            </Link>
          </div>
        </div>
      </section>

      <Container>
        <div className="py-16 text-center">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{' '}
            <Link
              to={ROUTES.contact.path}
              className="text-[#0f4c81] hover:underline"
            >
              get in touch
            </Link>
            .
          </p>
        </div>
      </Container>
    </Page>
  );
}

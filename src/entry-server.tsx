import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
import { getAllArticles, getArticleById } from './data/articles';

export interface RenderResult {
  html: string;
  title: string;
  description: string;
}

const SITE_NAME = 'LTS Commerce';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: `${SITE_NAME} - Bespoke PHP Development & Infrastructure`,
    description: 'Expert PHP development, infrastructure automation, and AI-enhanced workflows. 18+ years of production experience.',
  },
  '/about': {
    title: `About - ${SITE_NAME}`,
    description: 'Joseph Edmonds - Senior PHP engineer with 18+ years experience in complex backend systems, infrastructure automation, and AI-driven development.',
  },
  '/contact': {
    title: `Contact - ${SITE_NAME}`,
    description: 'Get in touch for PHP development, infrastructure automation, or technical consultancy.',
  },
  '/articles': {
    title: `Technical Articles - PHP, Infrastructure & AI | ${SITE_NAME}`,
    description: 'In-depth technical articles on PHP development, infrastructure automation, database optimisation, and AI integration.',
  },
  '/errors/404': {
    title: `Page Not Found | ${SITE_NAME}`,
    description: 'The page you are looking for does not exist or has been moved.',
  },
};

function getMetaForRoute(url: string): { title: string; description: string } {
  // Check static routes first
  if (PAGE_META[url]) {
    return PAGE_META[url];
  }

  // Check article routes
  const articleMatch = url.match(/^\/articles\/(.+)$/);
  if (articleMatch && articleMatch[1]) {
    const article = getArticleById(articleMatch[1]);
    if (article) {
      return {
        title: `${article.title} - ${SITE_NAME}`,
        description: article.description,
      };
    }
  }

  return { title: SITE_NAME, description: '' };
}

export function render(url: string): RenderResult {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );

  const meta = getMetaForRoute(url);

  return { html, ...meta };
}

export function getRoutes(): string[] {
  const staticRoutes = ['/', '/about', '/contact', '/articles', '/errors/404'];
  const articleRoutes = getAllArticles().map(a => `/articles/${a.id}`);
  return [...staticRoutes, ...articleRoutes];
}

export { getAllArticles } from './data/articles';

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
import { getAllArticles, getArticleById } from './data/articles';
import { getAllProjects, getProjectById } from './data/projects';
import { getAllCategories, getCategoryById, isCategoryId } from './data/categories';

export interface RenderResult {
  html: string;
  title: string;
  description: string;
}

const SITE_NAME = 'LTS Commerce';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: `${SITE_NAME} - Agentic Delivery Governance & PHP Engineering`,
    description:
      'Containment, policy, and quality-gate infrastructure for AI-assisted delivery, built on 20+ years of PHP and backend engineering. No bullshit, just results.',
  },
  '/about': {
    title: `About - ${SITE_NAME}`,
    description:
      "Joseph Edmonds - technical leader with 20+ years' experience in PHP engineering, infrastructure automation, and agentic delivery governance.",
  },
  '/contact': {
    title: `Contact - ${SITE_NAME}`,
    description:
      'Get in touch for PHP development, infrastructure automation, or technical consultancy.',
  },
  '/privacy': {
    title: `Privacy Policy - ${SITE_NAME} Ltd`,
    description:
      "How LTS Commerce Ltd collects, uses, and protects personal data submitted through this site's contact form — what's collected, why, and your rights under UK GDPR.",
  },
  '/articles': {
    title: `Technical Articles - PHP, Infrastructure & AI | ${SITE_NAME}`,
    description:
      'In-depth technical articles on PHP development, infrastructure automation, database optimisation, and AI integration.',
  },
  '/open-source': {
    title: `Open Source Projects - ${SITE_NAME}`,
    description:
      'Public repositories published by Joseph Edmonds — agentic-delivery guardrail tooling plus eleven years of PHP, TypeScript, and test-infrastructure packages.',
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

  // Check open source project routes
  const projectMatch = url.match(/^\/open-source\/(.+)$/);
  if (projectMatch && projectMatch[1]) {
    const project = getProjectById(projectMatch[1]);
    if (project) {
      return {
        title: `${project.name} - ${SITE_NAME}`,
        description: project.tagline,
      };
    }
  }

  // Check article category landing pages
  const categoryMatch = url.match(/^\/articles\/category\/(.+)$/);
  if (categoryMatch && categoryMatch[1] && isCategoryId(categoryMatch[1])) {
    const category = getCategoryById(categoryMatch[1]);
    return {
      title: `${category.label} Articles - ${SITE_NAME}`,
      description: `Everything written on ${category.label}: ${category.description}`,
    };
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
  const staticRoutes = [
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/articles',
    '/open-source',
    '/errors/404',
  ];
  const articleRoutes = getAllArticles().map(a => `/articles/${a.id}`);
  const projectRoutes = getAllProjects().map(p => `/open-source/${p.id}`);
  const categoryRoutes = getAllCategories().map(c => `/articles/category/${c.id}`);
  return [...staticRoutes, ...articleRoutes, ...projectRoutes, ...categoryRoutes];
}

export { getAllArticles } from './data/articles';
export { getAllProjects } from './data/projects';

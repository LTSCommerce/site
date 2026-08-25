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
  url: string;
  type: 'website' | 'article';
  jsonLd?: string;
}

const SITE_NAME = 'LTS Commerce';
const SITE_URL = 'https://ltscommerce.dev';
const OG_IMAGE = `${SITE_URL}/apple-touch-icon.png`;

interface PersonJsonLd {
  '@context': string;
  '@type': 'Person';
  name: string;
  url: string;
  jobTitle: string;
  worksFor: { '@type': 'Organization'; name: string };
  sameAs: string[];
}

interface ProfessionalServiceJsonLd {
  '@context': string;
  '@type': 'ProfessionalService';
  name: string;
  url: string;
  description: string;
  founder: { '@type': 'Person'; name: string };
}

interface OpenSourceWebPageJsonLd {
  '@context': string;
  '@type': 'WebPage';
  name: string;
  url: string;
  author: { '@type': 'Person'; name: string };
  mainEntity: {
    '@type': 'DefinedTerm';
    name: string;
    description: string;
  };
}

const PERSON_JSON_LD: PersonJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joseph Edmonds',
  url: SITE_URL,
  jobTitle: 'PHP Engineer & Fractional CTO',
  worksFor: { '@type': 'Organization', name: 'LTS Commerce Ltd' },
  sameAs: ['https://github.com/LongTermSupport', 'https://linkedin.com/in/edmondscommerce'],
};

const PROFESSIONAL_SERVICE_JSON_LD: ProfessionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'LTS Commerce Ltd',
  url: SITE_URL,
  description:
    'Long Term Support from Joseph Edmonds: retained engineering and fractional CTO expertise — agentic delivery governance and PHP engineering as an ongoing relationship, not a one-off bill.',
  founder: { '@type': 'Person', name: 'Joseph Edmonds' },
};

const OPEN_SOURCE_JSON_LD: OpenSourceWebPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Open Source',
  url: `${SITE_URL}/open-source`,
  author: { '@type': 'Person', name: 'Joseph Edmonds' },
  mainEntity: {
    '@type': 'DefinedTerm',
    name: 'Defence Before Fix',
    description:
      "A static-analysis-first bug-fixing method: write the rule that catches a bug's whole class before treating the individual instance, then use that rule to find and fix every other occurrence.",
  },
};

const JSON_LD_BY_ROUTE: Record<string, unknown> = {
  '/': PROFESSIONAL_SERVICE_JSON_LD,
  '/about': PERSON_JSON_LD,
  '/contact': PROFESSIONAL_SERVICE_JSON_LD,
  '/open-source': OPEN_SOURCE_JSON_LD,
};

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: `Joseph Edmonds — Engineer & Fractional CTO | ${SITE_NAME}`,
    description:
      'Joseph Edmonds: engineer and fractional CTO from West Yorkshire, UK. Decades of hands-on delivery; guardrails that make AI code safe to ship.',
  },
  '/about': {
    title: `About Me — Joseph Edmonds | ${SITE_NAME}`,
    description:
      "Joseph Edmonds - technical leader with 25 years' experience in PHP engineering, infrastructure automation, and agentic delivery governance.",
  },
  '/contact': {
    title: `Hire Me — Joseph Edmonds | ${SITE_NAME}`,
    description:
      'Hire Joseph Edmonds for PHP development, infrastructure automation, fractional CTO work, or AI delivery governance. Long-term support, not one-off billing.',
  },
  '/privacy': {
    title: `Privacy Policy - ${SITE_NAME} Ltd`,
    description:
      "How LTS Commerce Ltd collects, uses, and protects personal data submitted through this site's contact form: what's collected, why, and your rights under UK GDPR.",
  },
  '/articles': {
    title: `Technical Articles - PHP, Infrastructure & AI | ${SITE_NAME}`,
    description:
      'In-depth technical articles on PHP development, infrastructure automation, database optimisation, and AI integration.',
  },
  '/open-source': {
    title: `Open Source Projects - ${SITE_NAME}`,
    description:
      'Public repositories published by Joseph Edmonds: agentic-delivery guardrail tooling plus eleven years of PHP, TypeScript, and test-infrastructure packages.',
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

function getTypeForRoute(url: string): 'website' | 'article' {
  const articleMatch = url.match(/^\/articles\/(.+)$/);
  if (articleMatch && articleMatch[1] && getArticleById(articleMatch[1])) {
    return 'article';
  }
  return 'website';
}

export function render(url: string): RenderResult {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );

  const meta = getMetaForRoute(url);
  const canonicalUrl = `${SITE_URL}${url === '/' ? '' : url}`;
  const jsonLdData = JSON_LD_BY_ROUTE[url];

  return {
    html,
    ...meta,
    url: canonicalUrl,
    type: getTypeForRoute(url),
    ...(jsonLdData ? { jsonLd: JSON.stringify(jsonLdData) } : {}),
  };
}

export { SITE_URL, OG_IMAGE, SITE_NAME };

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

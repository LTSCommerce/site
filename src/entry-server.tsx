import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
import { getAllArticles } from './data/articles';

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );
}

export function getRoutes(): string[] {
  const staticRoutes = ['/', '/about', '/contact', '/articles'];
  const articleRoutes = getAllArticles().map(a => `/articles/${a.id}`);
  return [...staticRoutes, ...articleRoutes];
}

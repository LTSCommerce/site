import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ArticleList } from './pages/ArticleList';
import { ArticleDetail } from './pages/ArticleDetail';
import { ROUTES } from './routes';
import { useBodyLoaded } from './hooks/useBodyLoaded';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * Main Application Component
 *
 * Pure, minimal design with mathematical precision.
 * Type-safe routing with React Router.
 */
export function App() {
  // Simple fade-in on load
  useBodyLoaded();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.home.path} element={<Home />} />
        <Route path={ROUTES.about.path} element={<About />} />
        <Route path={ROUTES.contact.path} element={<Contact />} />
        <Route path={ROUTES.articles.path} element={<ArticleList />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

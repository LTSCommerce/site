import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ArticleList } from './pages/ArticleList';
import { ArticleDetail } from './pages/ArticleDetail';
import { ROUTES } from './routes';

/**
 * Main Application Component
 *
 * Sets up React Router with type-safe routes.
 * All route paths use ROUTES object to ensure compile-time safety.
 */
export function App() {
  return (
    <BrowserRouter>
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

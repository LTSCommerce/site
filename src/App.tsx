import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ArticleList } from './pages/ArticleList';
import { ArticleDetail } from './pages/ArticleDetail';
import { ROUTES } from './routes';
import { useMouseResponsiveEffects } from './hooks/useMouseResponsiveEffects';
import { useBodyLoaded } from './hooks/useBodyLoaded';
import { useScrollAnimations } from './hooks/useScrollAnimations';

/**
 * Main Application Component
 *
 * Sets up React Router with type-safe routes and enables global effects:
 * - Mouse-responsive gradients and shadows
 * - Smooth body fade-in on load
 * - Scroll-based animations for elements
 */
export function App() {
  // Enable global visual effects
  useMouseResponsiveEffects();
  useBodyLoaded();
  useScrollAnimations();

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

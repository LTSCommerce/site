import { describe, it, expect } from 'vitest';
import { screen, render as testingLibraryRender } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ArticleDetail } from './ArticleDetail';

// ArticleDetail reads its slug via useParams, which only resolves inside a matching
// <Route> - the shared test-utils render() only wraps in a bare MemoryRouter, so this
// file wraps in Routes/Route directly instead.
function renderAtSlug(slug: string) {
  return testingLibraryRender(
    <MemoryRouter initialEntries={[`/articles/${slug}`]}>
      <Routes>
        <Route path="/articles/:slug" element={<ArticleDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ArticleDetail', () => {
  it('renders a real article without crashing', () => {
    renderAtSlug('component-driven-design-react-typescript-storybook');
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders a not-found state for an unknown slug', () => {
    renderAtSlug('this-slug-does-not-exist');
    expect(
      screen.getByRole('heading', { level: 1, name: /article not found/i })
    ).toBeInTheDocument();
  });
});

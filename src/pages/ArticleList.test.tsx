import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { ArticleList } from './ArticleList';

describe('ArticleList', () => {
  it('renders without crashing and lists at least one article', () => {
    render(<ArticleList />);
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });
});

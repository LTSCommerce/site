import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders without crashing', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
  });
});

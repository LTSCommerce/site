import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { Services } from './Services';

describe('Services', () => {
  it('renders without crashing', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { level: 1, name: /services/i })).toBeInTheDocument();
  });

  it('shows the specific services with estimates', () => {
    render(<Services />);
    expect(screen.getByText(/move to infrastructure as code/i)).toBeInTheDocument();
    expect(screen.getAllByText(/£950\/day/).length).toBeGreaterThan(0);
  });
});

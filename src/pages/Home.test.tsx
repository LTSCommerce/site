import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { Home } from './Home';

describe('Home', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { level: 1, name: /long term support for your technology/i })
    ).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { About } from './About';

describe('About', () => {
  it('renders without crashing', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 1, name: /about me/i })).toBeInTheDocument();
  });
});

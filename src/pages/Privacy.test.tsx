import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { Privacy } from './Privacy';

describe('Privacy', () => {
  it('renders without crashing', () => {
    render(<Privacy />);
    expect(screen.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeInTheDocument();
  });
});

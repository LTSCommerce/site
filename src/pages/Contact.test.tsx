import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { Contact } from './Contact';

describe('Contact', () => {
  it('renders without crashing', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { level: 1, name: /hire me/i })).toBeInTheDocument();
  });

  it('renders the contact form', () => {
    render(<Contact />);
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});

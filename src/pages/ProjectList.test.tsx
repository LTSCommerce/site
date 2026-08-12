import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { ProjectList } from './ProjectList';

describe('ProjectList', () => {
  it('renders without crashing and lists at least one project', () => {
    render(<ProjectList />);
    expect(screen.getByRole('heading', { level: 1, name: /open source/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });
});

/**
 * ArticleCard Component
 *
 * Displays article preview in a card format with category badge,
 * title, description, date, and reading time.
 */

import { Link } from 'react-router-dom';
import { CategoryBadge } from '@/components/content/CategoryBadge';
import { getCategoryById } from '@/data/categories';
import { getArticleRoute } from '@/routes';
import type { ArticlePreview } from '@/types/article';

interface ArticleCardProps {
  /** Article preview data */
  article: ArticlePreview;

  /** Optional additional CSS class */
  className?: string;
}

/**
 * Format date for display
 * @param isoDate - Date in ISO 8601 format (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "21 January 2026")
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const articleRoute = getArticleRoute(article.id);

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#fff',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 0.75rem 0',
    color: '#333',
  };

  const descriptionStyle = {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#666',
    margin: '0 0 1rem 0',
  };

  const metaStyle = {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#888',
  };

  return (
    <Link
      to={articleRoute.path}
      style={cardStyle}
      className={className}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={headerStyle}>
        <CategoryBadge category={getCategoryById(article.category)} />
      </div>

      <h3 style={titleStyle}>{article.title}</h3>

      <p style={descriptionStyle}>{article.description}</p>

      <div style={metaStyle}>
        <span>{formatDate(article.date)}</span>
        <span>•</span>
        <span>{article.readingTime} min read</span>
      </div>
    </Link>
  );
}

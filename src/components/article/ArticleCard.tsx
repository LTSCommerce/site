/**
 * ArticleCard Component
 *
 * Displays article preview in a card format with category badge,
 * title, description, date, and reading time.
 */

import { Link } from 'react-router-dom';
import { Card } from 'flowbite-react';
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

  return (
    <Link to={articleRoute.path} className={`block ${className || ''}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={getCategoryById(article.category)} />
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900">{article.title}</h3>

        <p className="text-base leading-relaxed text-gray-600 mb-4">{article.description}</p>

        <div className="flex gap-4 text-sm text-gray-500">
          <span>{formatDate(article.date)}</span>
          <span>•</span>
          <span>{article.readingTime} min read</span>
        </div>
      </Card>
    </Link>
  );
}

/**
 * ArticleCard Component
 *
 * Displays article preview in a card format with category badge,
 * title, description, date, and reading time.
 */

import { AppLink } from '@/components/ui/AppLink';
import { CategoryBadge } from '@/components/content/CategoryBadge';
import { getCategoryById } from '@/data/categories';
import { getArticleRoute } from '@/routes';
import type { ArticlePreview } from '@/types/article';

export interface ArticleCardProps {
  article: ArticlePreview;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function ArticleCard({ article }: ArticleCardProps) {
  const articleRoute = getArticleRoute(article.id);

  return (
    <AppLink to={articleRoute.path} variant="card">
      <div className="mb-4">
        <CategoryBadge category={getCategoryById(article.category)} />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#0f4c81] transition-colors leading-snug">
        {article.title}
      </h3>

      <p className="text-sm leading-relaxed text-gray-500 mb-4 flex-grow">{article.description}</p>

      <div className="flex gap-3 text-xs text-gray-400 mt-auto">
        <span>{formatDate(article.date)}</span>
        <span>·</span>
        <span>{article.readingTime} min read</span>
      </div>
    </AppLink>
  );
}

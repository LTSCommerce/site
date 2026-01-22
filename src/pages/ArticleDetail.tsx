/**
 * ArticleDetail Page
 *
 * Displays individual article with full content and social sharing.
 */

import { useParams } from 'react-router-dom';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { CategoryBadge } from '@/components/content/CategoryBadge';
import { ArticleContent } from '@/components/article/ArticleContent';
import { getCategoryById } from '@/data/categories';
import { getArticleById } from '@/data/articles';

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

/**
 * Get share URL for current page
 */
function getShareUrl(): string {
  return typeof window !== 'undefined' ? window.location.href : '';
}

/**
 * Get page title for sharing
 */
function getPageTitle(): string {
  return typeof document !== 'undefined' ? document.title : '';
}

/**
 * Create Reddit share link
 */
function getRedditShareUrl(subreddit: string): string {
  return `https://reddit.com/r/${subreddit}/submit?url=${encodeURIComponent(getShareUrl())}&title=${encodeURIComponent(getPageTitle())}`;
}

/**
 * Create Hacker News share link
 */
function getHNShareUrl(): string {
  return `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(getShareUrl())}&t=${encodeURIComponent(getPageTitle())}`;
}

/**
 * Create Lobsters share link
 */
function getLobstersShareUrl(): string {
  return `https://lobste.rs/stories/new?url=${encodeURIComponent(getShareUrl())}&title=${encodeURIComponent(getPageTitle())}`;
}

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleById(slug) : undefined;

  if (!article) {
    return (
      <Page title="Article Not Found" description="The requested article could not be found">
        <Container>
          <Section>
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600">Sorry, the article you're looking for doesn't exist.</p>
          </Section>
        </Container>
      </Page>
    );
  }

  const subreddit = article.subreddit || 'programming';

  return (
    <Page title={`${article.title} - LTS Commerce`} description={article.description}>
      <Container>
        <Section>
          <article className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              <CategoryBadge category={getCategoryById(article.category)} />
              <h1 className="text-4xl font-bold mt-4 mb-4">{article.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span>•</span>
                <span>{article.readingTime} min read</span>
                {article.author && (
                  <>
                    <span>•</span>
                    <span>By {article.author}</span>
                  </>
                )}
              </div>
            </header>

            {/* Social Sharing */}
            <div className="flex gap-4 mb-8 pb-8 border-b border-gray-200">
              <a
                href={getRedditShareUrl(subreddit)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4.5 9.5c0 1.4-1.1 2.5-2.5 2.5H6c-1.4 0-2.5-1.1-2.5-2.5V6c0-1.4 1.1-2.5 2.5-2.5h4c1.4 0 2.5 1.1 2.5 2.5v3.5z"/>
                  <circle cx="6" cy="7" r="0.8"/>
                  <circle cx="10" cy="7" r="0.8"/>
                </svg>
                Submit to r/{subreddit}
              </a>

              <a
                href={getHNShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M0 0v16h16V0H0zm8.5 9.5v3.6H7.4V9.5L4.3 3.7h1.4l2.2 4.3 2.2-4.3h1.3L8.5 9.5z"/>
                </svg>
                Submit to HN
              </a>

              <a
                href={getLobstersShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm2 12H6V6h4v6zm0-8H6V2h4v2z"/>
                </svg>
                Submit to Lobsters
              </a>
            </div>

            {/* Article Content */}
            {article.content && typeof article.content === 'string' ? (
              <ArticleContent content={article.content} />
            ) : article.content ? (
              <div className="prose prose-lg max-w-none">{article.content}</div>
            ) : (
              <div className="p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center text-gray-600">
                <p className="m-0">
                  Article content will be added in Phase 6 (Article System Migration)
                </p>
              </div>
            )}
          </article>
        </Section>
      </Container>
    </Page>
  );
}

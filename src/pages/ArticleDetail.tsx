/**
 * ArticleDetail Page
 *
 * Displays individual article with full content.
 */

import { useParams } from 'react-router-dom';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { CategoryBadge } from '@/components/content/CategoryBadge';
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

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleById(slug) : undefined;

  if (!article) {
    return (
      <Page title="Article Not Found" description="The requested article could not be found">
        <Container>
          <Section>
            <h1>Article Not Found</h1>
            <p>Sorry, the article you're looking for doesn't exist.</p>
          </Section>
        </Container>
      </Page>
    );
  }

  const headerStyle = {
    marginBottom: '2rem',
  };

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#666',
  };

  const contentStyle = {
    marginTop: '2rem',
    lineHeight: '1.8',
    fontSize: '1.125rem',
  };

  const placeholderStyle = {
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px dashed #ccc',
    textAlign: 'center' as const,
    color: '#666',
  };

  return (
    <Page title={`${article.title} - LTS Commerce`} description={article.description}>
      <Container>
        <Section>
          <article>
            <header style={headerStyle}>
              <CategoryBadge category={getCategoryById(article.category)} />
              <h1 style={{ marginTop: '1rem' }}>{article.title}</h1>
              <div style={metaStyle}>
                <span>{formatDate(article.date)}</span>
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

            {article.content ? (
              <div style={contentStyle}>
                {typeof article.content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  article.content
                )}
              </div>
            ) : (
              <div style={placeholderStyle}>
                <p style={{ margin: 0 }}>
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

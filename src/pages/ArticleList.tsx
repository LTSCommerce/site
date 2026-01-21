/**
 * ArticleList Page
 *
 * Displays all articles in a grid layout with filtering by category.
 */

import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArticleCard } from '@/components/article/ArticleCard';
import { getAllArticles } from '@/data/articles';

export function ArticleList() {
  const articles = getAllArticles();

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  const headerStyle = {
    marginBottom: '1rem',
  };

  const countStyle = {
    color: '#666',
    fontSize: '1rem',
    marginTop: '0.5rem',
  };

  return (
    <Page title="Articles - LTS Commerce" description="Technical articles on PHP, infrastructure, databases, AI, and TypeScript development">
      <Container>
        <Section>
          <div style={headerStyle}>
            <h1>Technical Articles</h1>
            <p style={countStyle}>
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          <div style={gridStyle}>
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {articles.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
              No articles found.
            </p>
          )}
        </Section>
      </Container>
    </Page>
  );
}

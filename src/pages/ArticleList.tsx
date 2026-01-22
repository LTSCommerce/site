/**
 * ArticleList Page
 *
 * Displays all articles in a grid layout with filtering by category and search.
 */

import { useState, useMemo } from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArticleCard } from '@/components/article/ArticleCard';
import { getAllArticles } from '@/data/articles';
import { getAllCategories, type CategoryId } from '@/data/categories';

export function ArticleList() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allArticles = getAllArticles();
  const categories = getAllCategories();

  // Filter articles by category and search query
  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      // Category filter
      const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;

      // Search filter (case-insensitive, matches title or description)
      const searchMatch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  // Styles
  const headerStyle = {
    marginBottom: '2rem',
  };

  const filtersContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const categoryFiltersStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.75rem',
  };

  const filterButtonStyle = (isActive: boolean) => ({
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: isActive ? '#1f2937' : '#ffffff',
    color: isActive ? '#ffffff' : '#374151',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  });

  const searchInputStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '0.625rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  };

  const countStyle = {
    color: '#666',
    fontSize: '1rem',
    marginTop: '0.5rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  return (
    <Page
      title="Articles - LTS Commerce"
      description="Technical articles on PHP, infrastructure, databases, AI, and TypeScript development"
    >
      <Container>
        <Section>
          <div style={headerStyle}>
            <h1>Technical Articles</h1>
            <p style={countStyle}>
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
              {selectedCategory !== 'all' || searchQuery.trim() !== '' ? ' found' : ''}
            </p>
          </div>

          {/* Filters */}
          <div style={filtersContainerStyle}>
            {/* Category Filters */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                }}
              >
                Filter by Category
              </label>
              <div style={categoryFiltersStyle}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={filterButtonStyle(selectedCategory === 'all')}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={filterButtonStyle(selectedCategory === category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <label
                htmlFor="article-search"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                }}
              >
                Search Articles
              </label>
              <input
                id="article-search"
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
            </div>
          </div>

          {/* Article Grid */}
          <div style={gridStyle}>
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
              <p style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>
                No articles found
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </Section>
      </Container>
    </Page>
  );
}

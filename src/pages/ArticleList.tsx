/**
 * ArticleList Page
 *
 * Displays all articles in a grid layout with filtering by category and search.
 */

import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { ArticleCard } from '@/components/article/ArticleCard';
import { getAllArticles } from '@/data/articles';
import { getAllCategories, type CategoryId, isCategoryId } from '@/data/categories';

export function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const selectedCategory: CategoryId | 'all' = (categoryParam as CategoryId | null) ?? 'all';
  const searchQuery = searchParams.get('search') ?? '';

  const allArticles = getAllArticles();
  const categories = getAllCategories();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== 'all' && !isCategoryId(categoryParam)) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('category');
        return newParams;
      });
    }
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = (category: CategoryId | 'all') => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (category === 'all') {
        newParams.delete('category');
      } else {
        newParams.set('category', category);
      }
      return newParams;
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (query.trim() === '') {
        newParams.delete('search');
      } else {
        newParams.set('search', query);
      }
      return newParams;
    });
  };

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;
      const searchMatch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '';

  return (
    <Page
      title="Technical Articles - PHP, Infrastructure & AI | LTSCommerce"
      description="In-depth technical articles on PHP, infrastructure, databases, AI, and TypeScript. Expert insights from 20+ years of hands-on backend development."
    >
      {/* Controls bar — title, search, category filters in one compact block */}
      <div className="border-b border-gray-200 bg-white">
        <Container>
          <div className="py-8">
            {/* Title row + search */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Technical Articles</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredArticles.length}{' '}
                  {filteredArticles.length === 1 ? 'article' : 'articles'}
                  {isFiltered ? ' found' : ''}
                </p>
              </div>
              <div>
                <label htmlFor="article-search" className="sr-only">
                  Search articles
                </label>
                <input
                  id="article-search"
                  type="search"
                  placeholder="Search by title or description…"
                  value={searchQuery}
                  onChange={e => {
                    handleSearchChange(e.target.value);
                  }}
                  className="w-full sm:w-80 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleCategoryChange('all');
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    handleCategoryChange(category.id);
                  }}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Article grid */}
      <div className="bg-gray-50 py-10">
        <Container>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-semibold mb-1">No articles found</p>
              <p className="text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </Container>
      </div>
    </Page>
  );
}

/**
 * ArticleList Page
 *
 * Displays all articles in a grid layout with filtering by category and search.
 */

import { useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { ArticleCard } from '@/components/article/ArticleCard';
import { getAllArticles } from '@/data/articles';
import { getCategoryRoute } from '@/routes';
import {
  getAllCategories,
  getCategoryById,
  type CategoryId,
  isCategoryId,
} from '@/data/categories';

export function ArticleList() {
  const { categoryId: routeCategoryId } = useParams<{ categoryId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const routeCategory: CategoryId | null =
    routeCategoryId && isCategoryId(routeCategoryId) ? routeCategoryId : null;
  const categoryParam = searchParams.get('category');
  const selectedCategory: CategoryId | 'all' =
    (categoryParam as CategoryId | null) ?? routeCategory ?? 'all';
  const searchQuery = searchParams.get('search') ?? '';

  // A dedicated /articles/category/:id landing page — used for its title/intro
  // and for SEO (a real prerendered path with its own meta), independent of
  // whatever the interactive pill filter currently shows.
  const landingCategory = routeCategory ? getCategoryById(routeCategory) : null;

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
      title={
        landingCategory
          ? `${landingCategory.label} Articles - LTSCommerce`
          : 'Technical Articles - PHP, Infrastructure & AI | LTSCommerce'
      }
      description={
        landingCategory
          ? `Everything written on ${landingCategory.label}: ${landingCategory.description}`
          : 'In-depth technical articles on PHP, infrastructure, databases, AI, and TypeScript. Expert insights from 20+ years of hands-on backend development.'
      }
    >
      {/* Controls bar — title, search, category filters in one compact block */}
      <div className="border-b border-gray-200 bg-white">
        <Container>
          <div className="py-8">
            {/* Title row + search */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {landingCategory ? `${landingCategory.label} Articles` : 'Technical Articles'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
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

            {/* Crawlable links to the dedicated category landing pages — the
                pills above filter client-side via a search param, so these
                real routes need their own entry point for search engines. */}
            <p className="text-xs text-gray-400 mt-3">
              Browse by topic:{' '}
              {categories.map((category, index) => (
                <span key={category.id}>
                  <Link
                    to={getCategoryRoute(category.id).path}
                    className="text-gray-500 hover:text-[#0f4c81] underline"
                  >
                    {category.label}
                  </Link>
                  {index < categories.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
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

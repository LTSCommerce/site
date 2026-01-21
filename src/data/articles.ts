/**
 * Sample Article Data
 *
 * Placeholder articles for development.
 * In production, this will be replaced with actual article content.
 */

import type { Article } from '@/types/article';
import { CATEGORIES } from './categories';

/**
 * Sample articles for development and testing
 */
export const SAMPLE_ARTICLES: readonly Article[] = [
  {
    id: 'modern-php-patterns',
    title: 'Modern PHP Development Patterns',
    description:
      'Explore contemporary PHP design patterns and best practices for building maintainable, scalable applications in 2026.',
    date: '2026-01-15',
    category: CATEGORIES.php.id,
    readingTime: 8,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'Design Patterns', 'Best Practices'],
  },
  {
    id: 'kubernetes-deployment-strategies',
    title: 'Kubernetes Deployment Strategies',
    description:
      'A comprehensive guide to deploying PHP applications on Kubernetes with rolling updates, blue-green deployments, and canary releases.',
    date: '2026-01-10',
    category: CATEGORIES.infrastructure.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['Kubernetes', 'DevOps', 'Deployment'],
  },
  {
    id: 'database-query-optimization',
    title: 'Advanced Database Query Optimization',
    description:
      'Learn practical techniques for optimizing complex database queries, including indexing strategies, query plan analysis, and performance monitoring.',
    date: '2026-01-05',
    category: CATEGORIES.database.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: ['Database', 'Performance', 'SQL'],
  },
  {
    id: 'llm-integration-patterns',
    title: 'LLM Integration Patterns for Web Applications',
    description:
      'Practical patterns and best practices for integrating Large Language Models into production web applications with type safety and error handling.',
    date: '2025-12-28',
    category: CATEGORIES.ai.id,
    readingTime: 15,
    author: 'Joseph Edmonds',
    tags: ['AI', 'LLM', 'Integration'],
  },
  {
    id: 'typescript-type-safety',
    title: 'Type Safety in TypeScript: Beyond the Basics',
    description:
      'Deep dive into advanced TypeScript features: discriminated unions, branded types, and compile-time validation patterns.',
    date: '2025-12-20',
    category: CATEGORIES.typescript.id,
    readingTime: 11,
    author: 'Joseph Edmonds',
    tags: ['TypeScript', 'Type Safety', 'Advanced'],
  },
] as const;

/**
 * Get all articles sorted by date (newest first)
 */
export function getAllArticles(): readonly Article[] {
  return [...SAMPLE_ARTICLES].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): Article | undefined {
  return SAMPLE_ARTICLES.find(article => article.id === id);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(categoryId: string): readonly Article[] {
  return SAMPLE_ARTICLES.filter(article => article.category === categoryId);
}

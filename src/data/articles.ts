/**
 * Article Data
 *
 * Real article metadata from LTS Commerce.
 * Articles are organized by date (newest first).
 */

import type { Article } from '@/types/article';
import { CATEGORIES } from './categories';

/**
 * LTS Commerce Articles
 *
 * Curated selection of technical articles covering PHP, Infrastructure,
 * Database, AI, and TypeScript topics.
 */
export const SAMPLE_ARTICLES: readonly Article[] = [
  {
    id: 'ansible-fact-caching-problems',
    title: 'Ansible Fact Caching: The --limit Problem and Environment Separation Pain Points',
    description:
      'Deep dive into Ansible fact caching limitations with --limit operations and the lack of dynamic cache location configuration for multi-environment deployments.',
    date: '2025-01-29',
    category: CATEGORIES.infrastructure.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: ['Ansible', 'Infrastructure', 'DevOps'],
  },
  {
    id: 'legacy-php-modernization',
    title: 'Managing Legacy PHP: From Technical Debt to Modern Architecture',
    description:
      'Strategies for modernizing legacy PHP codebases and managing technical debt effectively',
    date: '2025-01-15',
    category: CATEGORIES.php.id,
    readingTime: 14,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'Legacy Code', 'Modernization'],
  },
  {
    id: 'ansible-php-infrastructure',
    title: 'Ansible Automation for PHP Infrastructure',
    description:
      'Complete guide to automating PHP infrastructure deployment and management using Ansible',
    date: '2025-01-10',
    category: CATEGORIES.infrastructure.id,
    readingTime: 15,
    author: 'Joseph Edmonds',
    tags: ['Ansible', 'PHP', 'Automation'],
  },
  {
    id: 'proxmox-vs-cloud',
    title: 'Proxmox vs Cloud: Why Private Infrastructure Wins',
    description:
      'Comparative analysis of Proxmox private cloud vs public cloud solutions for enterprise infrastructure',
    date: '2025-01-05',
    category: CATEGORIES.infrastructure.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: ['Proxmox', 'Cloud', 'Infrastructure'],
  },
  {
    id: 'mysql-performance-php',
    title: 'MySQL Performance Tuning for Complex PHP Applications',
    description:
      'Database optimization strategies specifically tailored for bespoke PHP systems with complex queries',
    date: '2024-12-20',
    category: CATEGORIES.database.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['MySQL', 'Performance', 'PHP'],
  },
  {
    id: 'high-performance-php',
    title: 'High-Performance PHP: Optimization Strategies',
    description:
      'Advanced PHP optimization techniques for high-performance applications and systems',
    date: '2024-12-28',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'Performance', 'Optimization'],
  },
  {
    id: 'scalable-php-apis',
    title: 'Building Scalable Backend APIs with Modern PHP',
    description:
      'Comprehensive guide to building scalable, maintainable PHP APIs using modern architecture patterns',
    date: '2024-12-15',
    category: CATEGORIES.php.id,
    readingTime: 16,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'API', 'Architecture'],
  },
  {
    id: 'ai-enhanced-php-development',
    title: 'AI-Enhanced PHP Development: Tools and Workflows',
    description:
      'Modern PHP development enhanced with AI tools and workflows for increased productivity and code quality',
    date: '2024-12-10',
    category: CATEGORIES.ai.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: ['AI', 'PHP', 'Development'],
  },
  {
    id: 'typescript-honesty-system',
    title: "TypeScript's Honesty System: Why Type Safety is Optional and How to Enforce It",
    description:
      'TypeScript provides zero runtime safety and can be bypassed 25+ different ways. The definitive guide to every bypass mechanism - from any to eval to recursive type limits - and how to defend against them with ESLint.',
    date: '2025-11-18',
    category: CATEGORIES.typescript.id,
    readingTime: 18,
    author: 'Joseph Edmonds',
    tags: ['TypeScript', 'Type Safety', 'ESLint'],
  },
  {
    id: 'ai-software-development-paradigm-shift',
    title: 'The AI Development Paradigm Shift: Managing the Firehose',
    description:
      'AI coding assistants are fundamentally transforming software development productivity and economics. Understanding when to use AI versus deterministic code is now a critical strategic skill.',
    date: '2025-11-19',
    category: CATEGORIES.ai.id,
    readingTime: 14,
    author: 'Joseph Edmonds',
    tags: ['AI', 'Development', 'Productivity'],
  },
  {
    id: 'phpstan-project-level-rules',
    title: 'Using PHPStan to Enforce Project-Level Rules',
    description:
      'Learn how to write custom PHPStan rules to enforce performance, architectural, and testing standards across your entire codebase. Includes real-world examples and multi-language comparisons.',
    date: '2025-11-10',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['PHPStan', 'PHP', 'Quality Assurance'],
  },
  {
    id: 'claude-code-latest-features',
    title: "Claude Code Latest Features: What's New in Autumn 2025",
    description:
      'Explore the groundbreaking features added to Claude Code in the last three months, including checkpoints for fearless refactoring, autonomous subagents, plugin marketplace, web interface, and more.',
    date: '2025-11-05',
    category: CATEGORIES.ai.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['Claude Code', 'AI', 'Tools'],
  },
  {
    id: 'claude-code-hooks-subagent-control',
    title: 'Advanced Claude Code Hooks: Controlling Sub-Agent Behavior',
    description:
      'Learn how to use Claude Code hooks to enforce execution rules for parallel sub-agents, preventing resource conflicts in test suites and other shared-resource scenarios.',
    date: '2025-10-24',
    category: CATEGORIES.ai.id,
    readingTime: 8,
    author: 'Joseph Edmonds',
    tags: ['Claude Code', 'Hooks', 'AI'],
  },
  {
    id: 'advanced-php-database-patterns',
    title:
      'Advanced PHP Database Patterns: Beyond ORMs for High-Performance Applications',
    description:
      'Discover advanced database patterns for PHP including retry mechanisms, bulk updates, statement caching, query classes, generators for memory efficiency, and PHPStan rules for test correctness. Learn when to use PDO directly over ORMs.',
    date: '2025-10-08',
    category: CATEGORIES.database.id,
    readingTime: 18,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'Database', 'Performance'],
  },
  {
    id: 'caching-vs-memoization',
    title: 'Caching vs Memoization: Choosing the Right Optimization Strategy',
    description:
      'Deep dive into caching and memoization strategies, their differences, use cases, anti-patterns, and practical implementation tips across programming languages.',
    date: '2025-10-06',
    category: CATEGORIES.php.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: ['Caching', 'Memoization', 'Performance'],
  },
  {
    id: 'claude-code-planning-execution-workflows',
    title:
      'Claude Code Planning and Execution Workflows: From Built-in Modes to Parallel Agents',
    description:
      "A comprehensive guide to Claude Code's planning features, from built-in Plan Mode to formal planning workflows with parallel agent execution for complex development tasks",
    date: '2025-10-01',
    category: CATEGORIES.ai.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['Claude Code', 'Planning', 'Workflows'],
  },
  {
    id: 'reusable-openapi-classes-php-symfony',
    title:
      'Reusable OpenAPI Classes: Eliminating Boilerplate in PHP API Documentation',
    description:
      'Learn how to create custom PHP classes that encapsulate OpenAPI specifications, dramatically reducing repetitive attribute definitions while improving maintainability and consistency across your Symfony API.',
    date: '2025-09-30',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'OpenAPI', 'Symfony'],
  },
  {
    id: 'php-stream-wrappers',
    title: 'PHP Stream Wrappers: Mastering I/O Abstraction and Custom Protocols',
    description:
      'Comprehensive guide to PHP stream wrappers, from built-in protocols like file://, http://, and data:// to implementing custom stream handlers for advanced I/O operations',
    date: '2025-09-26',
    category: CATEGORIES.php.id,
    readingTime: 9,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'Streams', 'I/O'],
  },
  {
    id: 'regex-strictness-code-paths',
    title: 'How Lenient Regex Patterns Explode Your Code Paths',
    description:
      'Why optional regex patterns create exponential complexity and how strict validation reduces maintenance burden through fail-fast principles.',
    date: '2025-09-26',
    category: CATEGORIES.php.id,
    readingTime: 7,
    author: 'Joseph Edmonds',
    tags: ['Regex', 'Validation', 'Best Practices'],
  },
  {
    id: 'fedora-desktop-automation-ansible',
    title:
      'Automating Fedora 42 Desktop Development: Open Source Infrastructure as Code',
    description:
      'Comprehensive guide to transforming a fresh Fedora 42 installation into a fully configured development environment using Ansible automation, exploring the LongTermSupport/fedora-desktop repository and the philosophy of infrastructure-as-code for personal workstations.',
    date: '2025-09-03',
    category: CATEGORIES.infrastructure.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['Fedora', 'Ansible', 'Automation'],
  },
  {
    id: 'llm-overfitting-trap',
    title:
      'The Overfitting Trap: When LLM Agents Fix One Thing and Break Everything Else',
    description:
      'Explore how LLM agents can over-specialize solutions to handle specific edge cases while destroying generic functionality. Learn to spot and prevent overfitting in AI-generated code.',
    date: '2025-08-26',
    category: CATEGORIES.ai.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['AI', 'LLM', 'Code Quality'],
  },
  {
    id: 'understanding-llm-context-management',
    title: 'Understanding LLM Context: The Hidden Challenge of AI Development',
    description:
      'A comprehensive guide to understanding and managing context when working with Large Language Models, especially in tools like Claude Code. Learn how context works, why it matters, and strategies to optimize your AI interactions.',
    date: '2025-08-20',
    category: CATEGORIES.ai.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['LLM', 'Context', 'AI'],
  },
  {
    id: 'mysql-legacy-to-modern-upgrade',
    title: 'Upgrading Legacy MySQL: From MyISAM to Modern MySQL 8.4',
    description:
      'Technical guide to upgrading legacy MySQL databases from MyISAM with implied foreign keys to modern MySQL 8.4 with InnoDB, proper constraints, and modern features for enhanced security, performance, and data integrity.',
    date: '2025-08-18',
    category: CATEGORIES.database.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: ['MySQL', 'Upgrade', 'Database'],
  },
  {
    id: 'unix-philosophy-strategic-guide',
    title: 'The Unix Philosophy: A Strategic Guide for Technology Leadership',
    description:
      'How the 50-year-old Unix philosophy drives modern infrastructure success, reduces vendor lock-in, and delivers superior business outcomes through modular, composable systems.',
    date: '2025-08-13',
    category: CATEGORIES.infrastructure.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: ['Unix', 'Philosophy', 'Leadership'],
  },
  {
    id: 'dependency-inversion-final-classes-pragmatic-testing',
    title:
      'Dependency Inversion, Final Classes, and Pragmatic Testing in PHP 8.4',
    description:
      'Master dependency inversion with final classes in PHP 8.4, learn when to use real objects vs mocks, and discover the pragmatic testing approach that combines Detroit and London schools for maintainable, testable code.',
    date: '2025-08-11',
    category: CATEGORIES.php.id,
    readingTime: 18,
    author: 'Joseph Edmonds',
    tags: ['PHP', 'Testing', 'Architecture'],
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

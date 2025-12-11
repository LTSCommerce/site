/**
 * CategoryBadge Component
 *
 * Type-safe category badge for article classification.
 * Demonstrates proper usage of CATEGORIES data object instead of magic strings.
 *
 * Example:
 *   <CategoryBadge category={CATEGORIES.php} />
 *   <CategoryBadge category={CATEGORIES.infrastructure} size="large" />
 */

import type { Category } from '@/data/categories';

interface CategoryBadgeProps {
  category: Category;
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined';
}

export function CategoryBadge({
  category,
  size = 'medium',
  variant = 'filled',
}: CategoryBadgeProps) {
  const sizeStyles = {
    small: { fontSize: '0.75rem', padding: '0.25rem 0.5rem' },
    medium: { fontSize: '0.875rem', padding: '0.375rem 0.75rem' },
    large: { fontSize: '1rem', padding: '0.5rem 1rem' },
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '0.375rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ...sizeStyles[size],
  };

  const filledStyle = {
    ...baseStyle,
    backgroundColor: category.color,
    color: '#ffffff',
  };

  const outlinedStyle = {
    ...baseStyle,
    backgroundColor: 'transparent',
    color: category.color,
    border: `2px solid ${category.color}`,
  };

  const style = variant === 'filled' ? filledStyle : outlinedStyle;

  return (
    <span style={style} title={category.description}>
      {category.label}
    </span>
  );
}

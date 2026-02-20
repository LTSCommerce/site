/**
 * CategoryBadge Component
 *
 * Type-safe category badge for article classification.
 */

import type { Category } from '@/data/categories';

interface CategoryBadgeProps {
  category: Category;
  size?: 'xs' | 'sm';
  variant?: 'filled' | 'outlined';
}

export function CategoryBadge({
  category,
  size = 'sm',
  variant = 'filled',
}: CategoryBadgeProps) {
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded ${sizeClass}`}
      style={{
        backgroundColor: variant === 'filled' ? category.color : 'transparent',
        borderColor: variant === 'outlined' ? category.color : undefined,
        color: variant === 'outlined' ? category.color : '#ffffff',
        borderWidth: variant === 'outlined' ? '1px' : undefined,
        borderStyle: variant === 'outlined' ? 'solid' : undefined,
      }}
      title={category.description}
    >
      {category.label}
    </span>
  );
}

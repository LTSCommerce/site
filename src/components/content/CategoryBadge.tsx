/**
 * CategoryBadge Component
 *
 * Type-safe category badge for article classification.
 * Minimal, clean design with Tailwind CSS.
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
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
  };

  const baseClasses = 'inline-flex items-center rounded-md font-semibold transition-all duration-200';

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${
        variant === 'filled'
          ? 'text-white'
          : 'bg-transparent border-2'
      }`}
      style={{
        backgroundColor: variant === 'filled' ? category.color : 'transparent',
        borderColor: variant === 'outlined' ? category.color : undefined,
        color: variant === 'outlined' ? category.color : undefined,
      }}
      title={category.description}
    >
      {category.label}
    </span>
  );
}

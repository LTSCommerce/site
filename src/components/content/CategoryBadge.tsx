/**
 * CategoryBadge Component
 *
 * Type-safe category badge for article classification.
 * Uses Flowbite React Badge component.
 */

import { Badge } from 'flowbite-react';
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
  return (
    <Badge
      size={size}
      style={{
        backgroundColor: variant === 'filled' ? category.color : 'transparent',
        borderColor: variant === 'outlined' ? category.color : undefined,
        color: variant === 'outlined' ? category.color : '#ffffff',
        borderWidth: variant === 'outlined' ? '2px' : undefined,
      }}
      title={category.description}
    >
      {category.label}
    </Badge>
  );
}

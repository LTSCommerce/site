/**
 * AppLink - Closed-styling wrapper for react-router-dom's <Link>.
 *
 * Every distinct Tailwind treatment `<Link className="...">` needed across the
 * site is captured here as a named `variant` (plus `size`/`active` for the two
 * variants that have a small, genuinely-finite second axis). Uses createElement
 * rather than JSX to render <Link> so the underlying component never appears as
 * a JSX tag receiving className directly — see the closed-styling doctrine:
 * https://github.com/LongTermSupport/ts-qa-ci/blob/main/docs/closed-styling-doctrine.md
 */
import { createElement } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type AppLinkVariant =
  // Whole-card link (ArticleCard, ProjectCard)
  | 'card'
  // Solid blue buttons, three sizes
  | 'ctaSmall'
  | 'ctaMedium'
  | 'ctaLarge'
  // Solid blue button with a leading icon + gap (NotFound "Return Home")
  | 'ctaWithIcon'
  // Outlined button for use on a dark background
  | 'heroSecondary'
  | 'outlineDark'
  // Outlined button with a leading icon + gap (NotFound "Browse Articles")
  | 'outlineWithIcon'
  // Inline text links
  | 'inline'
  | 'inlineSubtle'
  | 'inlineHover'
  | 'plain'
  // Navigation-specific
  | 'navLogo'
  | 'navItem'
  | 'navItemMobile'
  | 'navCta'
  | 'navCtaMobile'
  // Footer-specific
  | 'footerBrand'
  | 'footerLink';

export type AppLinkProps = Omit<LinkProps, 'className'> & {
  variant: AppLinkVariant;
  /** Only meaningful for `ctaMedium`: toggles the trailing `text-sm`. Default 'sm'. */
  size?: 'sm' | 'base';
  /** Only meaningful for `navItem` / `navItemMobile`: highlights the current route. */
  active?: boolean;
};

const STATIC_CLASSES: Record<
  Exclude<AppLinkVariant, 'ctaMedium' | 'navItem' | 'navItemMobile'>,
  string
> = {
  card: 'group block h-full bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col',
  ctaSmall:
    'shrink-0 inline-block px-5 py-2 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md text-sm',
  ctaLarge:
    'inline-block px-8 py-4 bg-[#0f4c81] text-white rounded-lg hover:bg-[#1e6ba5] transition-colors font-semibold',
  ctaWithIcon:
    'inline-flex items-center gap-2 px-7 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium rounded-md transition-colors text-sm',
  heroSecondary:
    'px-7 py-3 border border-[#2a2a2a] hover:border-[#444] text-gray-300 hover:text-white font-medium rounded-md transition-colors text-sm',
  outlineDark:
    'inline-block px-8 py-3 border border-gray-700 hover:border-gray-500 text-white font-medium transition-colors rounded-md text-sm',
  outlineWithIcon:
    'inline-flex items-center gap-2 px-7 py-3 border border-[#2a2a2a] hover:border-[#444] text-gray-300 hover:text-white font-medium rounded-md transition-colors text-sm',
  inline: 'text-[#0f4c81] underline',
  inlineSubtle: 'text-gray-500 hover:text-[#0f4c81] underline',
  inlineHover: 'text-[#0f4c81] hover:underline',
  plain: 'text-[#0f4c81]',
  navLogo: 'flex items-center gap-3 shrink-0 bg-white/95 rounded-lg pl-2 pr-3 py-1.5 -ml-2',
  navCta:
    'ml-3 px-4 py-2 text-sm font-medium bg-[#0f4c81] hover:bg-[#1e6ba5] text-white rounded-md transition-colors',
  navCtaMobile:
    'mt-2 px-3 py-2.5 text-sm font-medium bg-[#0f4c81] text-white rounded-md text-center',
  footerBrand: 'flex items-center mb-4',
  footerLink: 'text-sm text-gray-400 hover:text-white transition-colors',
};

const NAV_ITEM_ACTIVE_CLASSES = 'text-gray-900 bg-gray-100';

function resolveClassName(variant: AppLinkVariant, size: 'sm' | 'base', active: boolean): string {
  if (variant === 'ctaMedium') {
    const base =
      'inline-block px-8 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md';
    return size === 'sm' ? `${base} text-sm` : base;
  }
  if (variant === 'navItem') {
    return `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? NAV_ITEM_ACTIVE_CLASSES : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`;
  }
  if (variant === 'navItemMobile') {
    return `px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
      active ? NAV_ITEM_ACTIVE_CLASSES : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;
  }
  return STATIC_CLASSES[variant];
}

export function AppLink({
  variant,
  size = 'sm',
  active = false,
  children,
  ...linkProps
}: AppLinkProps) {
  const className = resolveClassName(variant, size, active);
  return createElement(Link, { ...linkProps, className }, children);
}

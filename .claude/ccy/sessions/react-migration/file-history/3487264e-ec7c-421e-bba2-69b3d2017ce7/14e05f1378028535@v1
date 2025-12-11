/**
 * Type-Safe Routing System
 *
 * This module provides a type-safe routing system that prevents hardcoded
 * route strings and ensures compile-time safety for navigation.
 */

/**
 * Route entry with path and optional label
 */
export interface RouteEntry {
  readonly path: string;
  readonly label?: string;
}

/**
 * Hash link for on-page anchors
 * @example "#features" | "#contact"
 */
export type HashLink = `#${string}`;

/**
 * External link (http or https)
 * @example "https://example.com"
 */
export type ExternalLink = `http${'s' | ''}://${string}`;

/**
 * Contact link (tel or mailto)
 * @example "tel:+1234567890" | "mailto:hello@example.com"
 */
export type ContactLink = `tel:${string}` | `mailto:${string}`;

/**
 * Union of all possible link destinations
 */
export type LinkDestination = RouteEntry | HashLink | ExternalLink | ContactLink;

/**
 * Extract string path from any LinkDestination
 */
export function getLinkPath(link: LinkDestination): string {
  if (typeof link === 'string') {
    return link;
  }
  return link.path;
}

/**
 * Type guard: Check if link is a hash link
 */
export function isHashLink(link: LinkDestination): link is HashLink {
  return typeof link === 'string' && link.startsWith('#');
}

/**
 * Type guard: Check if link is an external link
 */
export function isExternalLink(link: LinkDestination): link is ExternalLink {
  return typeof link === 'string' && (link.startsWith('http://') || link.startsWith('https://'));
}

/**
 * Type guard: Check if link is a contact link
 */
export function isContactLink(link: LinkDestination): link is ContactLink {
  return typeof link === 'string' && (link.startsWith('tel:') || link.startsWith('mailto:'));
}

/**
 * Type guard: Check if link is a RouteEntry
 */
export function isRouteEntry(link: LinkDestination): link is RouteEntry {
  return typeof link === 'object' && 'path' in link;
}

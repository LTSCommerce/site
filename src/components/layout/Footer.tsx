/**
 * Footer Component
 *
 * Professional footer using Flowbite React Footer.
 * Type-safe routes and external links.
 */

import {
  Footer as FlowbiteFooter,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from 'flowbite-react';
import { ROUTES } from '@/routes';
import type { ExternalLink } from '@/types/routing';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks: Array<{ label: string; url: ExternalLink }> = [
    { label: 'GitHub', url: 'https://github.com/LongTermSupport' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/joseph-edmonds' },
  ];

  return (
    <FlowbiteFooter container className={`mt-16 ${className || ''}`}>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <a
              href={ROUTES.home.path}
              className="flex items-center text-2xl font-semibold text-gray-900"
            >
              LTS Commerce
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="Navigation" />
              <FooterLinkGroup col>
                <FooterLink href={ROUTES.home.path}>{ROUTES.home.label}</FooterLink>
                <FooterLink href={ROUTES.articles.path}>{ROUTES.articles.label}</FooterLink>
                <FooterLink href={ROUTES.about.path}>{ROUTES.about.label}</FooterLink>
                <FooterLink href={ROUTES.contact.path}>{ROUTES.contact.label}</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Connect" />
              <FooterLinkGroup col>
                {socialLinks.map(link => (
                  <FooterLink
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </FooterLink>
                ))}
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright
            by="LTS Commerce. All rights reserved."
            year={currentYear}
          />
        </div>
      </div>
    </FlowbiteFooter>
  );
}

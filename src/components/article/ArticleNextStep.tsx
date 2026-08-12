/**
 * ArticleNextStep Component
 *
 * A single "what to read/do next" CTA shown at the end of every article,
 * keyed off the article's category — links to whichever service/project
 * page is actually relevant to that topic, rather than a generic sign-off.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { getLinkPath, type RouteEntry } from '@/types/routing';
import type { CategoryId } from '@/data/categories';

interface NextStep {
  readonly text: string;
  readonly linkText: string;
  readonly to: RouteEntry;
}

const NEXT_STEPS: Record<CategoryId, NextStep> = {
  php: {
    text: 'Got a PHP system that needs this kind of attention?',
    linkText: 'Get in touch',
    to: ROUTES.contact,
  },
  infrastructure: {
    text: "Need infrastructure that's actually run this way?",
    linkText: 'Get in touch',
    to: ROUTES.contact,
  },
  database: {
    text: 'Got a database that needs sorting out?',
    linkText: 'Get in touch',
    to: ROUTES.contact,
  },
  ai: {
    text: 'This is exactly the kind of problem the guardrail tooling below is built for.',
    linkText: 'See the open-source work',
    to: ROUTES.openSource,
  },
  typescript: {
    text: 'Curious how this fits together in a real pipeline?',
    linkText: 'See the open-source tooling',
    to: ROUTES.openSource,
  },
  qa: {
    text: 'This is what the QA-gates tooling automates.',
    linkText: 'See php-qa-ci and ts-qa-ci',
    to: ROUTES.openSource,
  },
};

export interface ArticleNextStepProps {
  category: CategoryId;
}

export function ArticleNextStep({ category }: ArticleNextStepProps) {
  const step = NEXT_STEPS[category];

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 rounded-lg p-6">
      <p className="text-gray-700 text-sm m-0">{step.text}</p>
      <Link
        to={getLinkPath(step.to)}
        className="shrink-0 inline-block px-5 py-2 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md text-sm"
      >
        {step.linkText}
      </Link>
    </div>
  );
}

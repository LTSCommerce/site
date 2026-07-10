/**
 * ProjectCard Component
 *
 * Displays an open source project preview in a card format with
 * language/status badges, name, tagline, and a link to the detail page.
 */

import { Link } from 'react-router-dom';
import { getProjectRoute } from '@/routes';
import type { OpenSourceProject } from '@/types/project';

export interface ProjectCardProps {
  project: OpenSourceProject;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const projectRoute = getProjectRoute(project.id);

  return (
    <Link
      to={projectRoute.path}
      className={`group block h-full bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col ${className || ''}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center text-xs font-medium rounded bg-gray-900 text-white px-2.5 py-1">
          {project.language}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#0f4c81] transition-colors leading-snug font-mono">
        {project.name}
      </h3>

      <p className="text-sm leading-relaxed text-gray-500 flex-grow">{project.tagline}</p>
    </Link>
  );
}

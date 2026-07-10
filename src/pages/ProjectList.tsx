/**
 * ProjectList Page
 *
 * Index page for the open source project catalogue — public repos
 * published under the LongTermSupport GitHub org.
 */

import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/project/ProjectCard';
import { getAllProjects } from '@/data/projects';

export function ProjectList() {
  const projects = getAllProjects();

  return (
    <Page
      title="Open Source Projects - LTS Commerce"
      description="Public repositories published by LTS Commerce — QA/CI tooling and other open source packages for PHP and TypeScript projects."
    >
      <div className="border-b border-gray-200 bg-white">
        <Container>
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">Open Source</h1>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} published under the
              LongTermSupport GitHub org
            </p>
          </div>
        </Container>
      </div>

      <div className="bg-gray-50 py-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </div>
    </Page>
  );
}

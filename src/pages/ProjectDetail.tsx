/**
 * ProjectDetail Page
 *
 * Displays an individual open source project — description, install
 * instructions, pipeline/feature highlights, and links to GitHub/Packagist/npm.
 */

import { useParams } from 'react-router-dom';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getProjectById } from '@/data/projects';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <Page
        title="Project Not Found - LTS Commerce"
        description="The open source project you requested could not be found. Browse the full catalogue of LTS Commerce's published repositories."
      >
        <Container>
          <Section>
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="text-gray-600">Sorry, the project you're looking for doesn't exist.</p>
          </Section>
        </Container>
      </Page>
    );
  }

  return (
    <Page title={`${project.name} - LTS Commerce`} description={project.tagline}>
      <Container>
        <Section>
          <article className="max-w-4xl mx-auto">
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center text-xs font-medium rounded bg-gray-900 text-white px-2.5 py-1">
                  {project.language}
                </span>
                <span className="text-xs text-gray-500">{project.status}</span>
              </div>
              <h1 className="mb-3 font-mono">{project.name}</h1>
              <p className="text-lg text-gray-600">{project.tagline}</p>
            </header>

            <div className="flex flex-wrap gap-3 mb-12 pb-12 border-b border-gray-200">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View on GitHub
              </a>
              {project.packagistPackage && (
                <a
                  href={`https://packagist.org/packages/${project.packagistPackage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  View on Packagist
                </a>
              )}
              {project.npmPackage && (
                <a
                  href={`https://www.npmjs.com/package/${project.npmPackage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  View on npm
                </a>
              )}
            </div>

            {project.installCommand && (
              <div className="mb-12">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  Install
                </h2>
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                  <code>{project.installCommand}</code>
                </pre>
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-12">
              {project.description.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                Pipeline
              </h2>
              <dl className="space-y-4">
                {project.highlights.map(highlight => (
                  <div key={highlight.title} className="border-l-2 border-gray-200 pl-4">
                    <dt className="font-semibold text-gray-900">{highlight.title}</dt>
                    <dd className="text-sm text-gray-600 mt-1">{highlight.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </Section>
      </Container>
    </Page>
  );
}

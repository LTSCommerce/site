/**
 * ProjectList Page
 *
 * Index page for the open source project catalogue — public repos
 * published by Joseph Edmonds, grouped into the site's three-layer thesis
 * (containment / policy / gates) plus a supporting-libraries tier and a
 * dated archive of historical test/CI infrastructure work.
 */

import { Link } from 'react-router-dom';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/project/ProjectCard';
import { getAllProjects, getProjectsByLayer, getArchiveProjects } from '@/data/projects';
import { getArticleRoute } from '@/routes';

interface LayerSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  layer: 'containment' | 'policy' | 'gates';
}

function LayerSection({ eyebrow, title, description, layer }: LayerSectionProps) {
  const projects = getProjectsByLayer(layer);
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mb-14">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
          {eyebrow}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 max-w-2xl">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export function ProjectList() {
  const projects = getAllProjects();
  const supportingProjects = getProjectsByLayer('supporting');
  const archiveProjects = getArchiveProjects();

  return (
    <Page
      title="Open Source Projects - LTS Commerce"
      description="Public repositories published by Joseph Edmonds: agentic-delivery guardrail tooling plus eleven years of PHP, TypeScript, and test-infrastructure packages."
    >
      <div className="border-b border-gray-200 bg-white">
        <Container>
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">Open Source</h1>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} published {projects.length === 1 ? 'project' : 'projects'}, plus{' '}
              {archiveProjects.length} archived repositories below
            </p>
            <p className="text-gray-700 mt-4 max-w-2xl">
              <strong>Automate the enforcement, keep humans for the judgement.</strong> Plenty of
              people have one of the three layers below. Almost nobody has all three integrated, and
              that integration is the differentiation. The gates layer implements{' '}
              <Link
                to={getArticleRoute('defence-before-fix-static-analysis').path}
                className="text-[#0f4c81] underline"
              >
                Defence Before Fix
              </Link>
              : every bug class gets a static analysis rule, not just a one-time patch.
            </p>
          </div>
        </Container>
      </div>

      <div className="bg-gray-50 py-10">
        <Container>
          <LayerSection
            eyebrow="Containment"
            title="What an agent can reach"
            description="Blast-radius control: sandboxing that bounds the damage before anything else applies."
            layer="containment"
          />
          <LayerSection
            eyebrow="Policy"
            title="What an agent may do"
            description="Deterministic guardrails enforced inside the sandbox: what actually stops an agent doing something stupid."
            layer="policy"
          />
          <LayerSection
            eyebrow="Gates"
            title="What is allowed to leave"
            description="QA/CI pipelines that block a shipped change on lint, type, static-analysis, and test failures."
            layer="gates"
          />

          {supportingProjects.length > 0 && (
            <div className="mb-4">
              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                  Supporting Libraries
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  The rest of the published work
                </h2>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Utility packages and tooling outside the core thesis. Some actively maintained,
                  one honestly marked archived rather than pretended-active.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportingProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>

      {archiveProjects.length > 0 && (
        <div className="bg-white py-10 border-t border-gray-200">
          <Container>
            <div className="mb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                Archive
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Eleven years of test &amp; CI infrastructure
              </h2>
              <p className="text-sm text-gray-500 max-w-2xl">
                Published continuously since February 2015 (<code>selenium-server</code>, the
                earliest repo in this lineage). Not headline material individually, but the lineage
                is the evidence for the claim.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 list-none p-0 m-0">
              {archiveProjects.map(project => (
                <li key={project.url} className="text-sm py-1.5 border-b border-gray-100">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-gray-800 hover:text-[#0f4c81] transition-colors"
                  >
                    {project.name}
                  </a>
                  <span className="text-gray-400">: {project.note}</span>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      )}
    </Page>
  );
}

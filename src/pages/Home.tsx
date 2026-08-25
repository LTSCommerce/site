import { Link } from 'react-router-dom';
import { Code2, Server, Brain, Terminal, Shield } from 'lucide-react';

import { Hero } from '../components/content/Hero';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { ArticleCard } from '../components/article/ArticleCard';
import { ThreeColumnFeatures } from '../components/ui/ThreeColumnFeatures';
import type { ThreeColumnFeature } from '../components/ui/ThreeColumnFeatures';
import { ROUTES } from '../routes';
import { SAMPLE_ARTICLES } from '../data/articles';
import { useInView } from '../hooks/useInView';

function inViewStyle(isInView: boolean): React.CSSProperties {
  return {
    opacity: isInView ? 1 : 0,
    transform: isInView ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  };
}

const expertiseRow1: [ThreeColumnFeature, ThreeColumnFeature, ThreeColumnFeature] = [
  {
    title: 'Agentic Delivery Governance',
    description:
      'Containment, policy enforcement, and automated quality gates for AI-assisted development. This is the infrastructure that catches a problem before it ships.',
    icon: Shield,
    items: ['Guardrail & policy design', 'Sandboxed agent environments', 'Automated QA/CI gates'],
  },
  {
    title: 'Fractional CTO & Technical Leadership',
    description:
      "Senior technical ownership without a full-time hire. I've run the technology side of real businesses since 2007 — architecture, roadmap and infrastructure. External agencies work to standards I set.",
    icon: Brain,
    items: [
      'Technical strategy & roadmapping',
      'Architecture & code review',
      'Hiring & team standards',
    ],
  },
  {
    title: 'Infrastructure & Automation',
    description:
      'Ansible automation, Proxmox virtualisation, and bare metal server management. Private cloud preferred.',
    icon: Server,
    items: [
      'Ansible playbooks and roles',
      'Proxmox virtualisation',
      'Bare metal server management',
    ],
  },
];

const secondaryExpertise: [ThreeColumnFeature, ThreeColumnFeature] = [
  {
    title: 'Backend & PHP Engineering',
    description:
      'Complex, modern PHP systems built to last — legacy transformation, scalable API design, high-throughput backends. Complex ecommerce is the speciality: large catalogues and bespoke capability that puts you ahead of the competition.',
    icon: Code2,
    items: ['Custom PHP 8.x architecture', 'Legacy system modernisation', 'Database optimisation'],
  },
  {
    title: 'TypeScript & Modern JS',
    description:
      'Full-stack TypeScript including Node.js backend services, CLI tools, and modern JS architecture.',
    icon: Terminal,
    items: ['Node.js backend services', 'CLI tooling', 'TypeScript architecture'],
  },
];

export function Home() {
  const latestArticles = [...SAMPLE_ARTICLES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const { ref: articlesRef, isInView: articlesInView } = useInView({ threshold: 0.1 });
  const { ref: authorRef, isInView: authorInView } = useInView({ threshold: 0.2 });

  return (
    <Page
      title="Joseph Edmonds — Engineer & Fractional CTO | LTS Commerce"
      description="Joseph Edmonds: engineer and fractional CTO from West Yorkshire, UK. Decades of hands-on delivery; guardrails that make AI code safe to ship."
    >
      <Hero
        identity="Hey — I'm Joseph Edmonds."
        title="Long Term Support for Your Technology"
        subtitle="Back end/full stack engineer and fractional CTO from West Yorkshire, UK. 25 years as the technology lead behind serious UK ecommerce businesses, on platforms I build and run — and today, the guardrails that make AI-written code safe to ship. Currently taking new clients."
        cta={{
          text: 'Hire Me',
          link: ROUTES.contact,
        }}
      />

      {/* Accountability — one person, not an agency */}
      <Section spacing="lg" className="bg-white">
        <Container size="md">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">
              LTS Commerce is not an agency. It's me.
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              When you hire me, the person you talk to is the person who does the work. If it
              doesn't ship, that's on me. There's no account manager between you and the work.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              The LTS in LTS Commerce stands for <strong>Long Term Support</strong>, and that's what
              I offer: expertise on hand, retained to support you as and when you need it. Some of
              my client relationships have run continuously for more than fifteen years. I don't
              name them publicly — if you want to know more, get in touch and we can discuss
              directly.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              And you'll get it straight. I offer clear, frank guidance — I won't sugar-coat things
              or tell you what you want to hear. Sometimes that will annoy you, and that's probably
              good: I may be the only person in the conversation telling you the truth about your
              business, at exactly the moments when the wrong decision costs the most.
            </p>
          </div>
        </Container>
      </Section>

      {/* Core Expertise — dark section, cards designed for dark bg */}
      <Section spacing="xl" className="bg-[#0A0A0A]">
        <Container>
          <div className="mb-16 text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
              What I do
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Core Expertise
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              The current specialism: ship agent-written code you can actually trust — built on the
              25-year engineering foundation below.
            </p>
          </div>

          <div className="mb-6">
            <ThreeColumnFeatures
              features={expertiseRow1}
              animationDelay={200}
              stagger={150}
              showHoverEffect={true}
            />
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {secondaryExpertise.map(feature => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group flex h-full flex-col rounded-sm border border-gray-700 bg-gray-800/50 p-6 md:p-8 transition-all hover:border-[#0f4c81]"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-sm bg-[#0f4c81]/10 text-[#0f4c81]">
                    <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                  </div>
                  <h3 className="mb-3 text-base font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm font-light text-gray-400 mb-6">{feature.description}</p>
                  {feature.items && (
                    <ul className="space-y-2">
                      {feature.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm font-light">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0f4c81]" />
                          <span className="text-gray-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.openSource.path}
              className="inline-block px-8 py-3 border border-gray-700 hover:border-gray-500 text-white font-medium transition-colors rounded-md text-sm"
            >
              See the Actual Tooling
            </Link>
          </div>
        </Container>
      </Section>

      {/* Latest Articles — light section */}
      <Section spacing="xl" className="bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
              Writing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Latest Articles
            </h2>
          </div>
          <div ref={articlesRef} style={inViewStyle(articlesInView)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {latestArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to={ROUTES.articles.path}
                className="inline-block px-8 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md text-sm"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Published Author — dark section */}
      <Section spacing="xl" className="bg-[#0A0A0A]">
        <Container size="md">
          <div ref={authorRef} style={inViewStyle(authorInView)} className="text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
              Published
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
              The Art of Modern PHP&nbsp;8
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Written by Joseph Edmonds, published by Packt Publishing. Helps developers worldwide
              upgrade legacy PHP applications to modern standards.
            </p>
            <a
              href="https://www.packtpub.com/en-us/product/the-art-of-modern-php-8-9781800566156"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md text-sm"
            >
              View on Packt
            </a>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

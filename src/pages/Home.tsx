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
      'Sole technical lead for a mid-market e-commerce operation — I own the architecture, run the infrastructure it trades on, and direct the external agencies that deliver.',
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
      'Complex, modern PHP systems built to last — legacy transformation, scalable API design, and high-throughput backend architecture.',
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
      title="LTSCommerce - Agentic Delivery Governance & PHP Engineering"
      description="Containment, policy, and quality-gate infrastructure for AI-assisted delivery, built on 20+ years of PHP and backend engineering. No bullshit, just results."
    >
      <Hero
        title="Ship Agent-Written Code You Can Actually Trust"
        subtitle="AI-assisted delivery breaks in production because nobody built the guardrails first, so that's what I build — sandboxing, policy enforcement, quality gates — and then I help your team actually run it. 20+ years of backend engineering underneath, e-commerce and PHP included."
        cta={{
          text: 'Get In Touch',
          link: ROUTES.contact,
        }}
      />

      <p className="text-center text-sm text-gray-500 italic px-4 -mt-2 mb-2">
        If your problem is managing thirty in-house engineers, I&apos;m the wrong person.
      </p>

      {/* Core Expertise — dark section, cards designed for dark bg */}
      <Section spacing="xl" className="bg-[#0A0A0A]">
        <Container>
          <div className="mb-16 text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
              What I do
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Core Expertise
            </h2>
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
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
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

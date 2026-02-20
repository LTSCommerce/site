import { Link } from 'react-router-dom';
import { Code2, Server, Database, Brain, Cpu, Terminal } from 'lucide-react';

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
    title: 'Bespoke PHP Development',
    description:
      'Complex, modern PHP systems built to last. Legacy code transformation and high-pressure delivery.',
    icon: Code2,
    items: [
      'Custom PHP 8.x architecture',
      'Legacy system modernisation',
      'High-throughput backend systems',
    ],
  },
  {
    title: 'Infrastructure & Automation',
    description:
      'Ansible automation, Proxmox virtualisation, and bare metal server management. Private cloud preferred.',
    icon: Server,
    items: ['Ansible playbooks and roles', 'Proxmox virtualisation', 'Bare metal server management'],
  },
  {
    title: 'Backend Systems',
    description:
      'Pure backend development focused on scalable, maintainable PHP architecture. No design work.',
    icon: Database,
    items: ['Scalable API design', 'Database optimisation', 'Microservices architecture'],
  },
];

const expertiseRow2: [ThreeColumnFeature, ThreeColumnFeature, ThreeColumnFeature] = [
  {
    title: 'CTO-Level Services',
    description:
      'Strategic guidance, hiring support, and team training. Technical leadership for complex projects.',
    icon: Brain,
    items: ['Technical strategy', 'Team hiring and training', 'Architecture review'],
  },
  {
    title: 'AI-Enhanced Development',
    description:
      'AI tools for faster development and business AI integration. Modern workflows with traditional reliability.',
    icon: Cpu,
    items: ['AI-assisted development', 'Business AI integration', 'Workflow automation'],
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
      title="LTSCommerce - Bespoke PHP Development"
      description="LTSCommerce delivers bespoke PHP development and infrastructure solutions for high-complexity, large-scale systems. AI-enhanced workflows. No bullshit, just results."
    >
      <Hero
        title="Bespoke PHP Development for Complex Systems"
        subtitle="Large-scale, high-throughput backend systems. AI-enhanced workflows. 18+ years of serious PHP engineering."
        cta={{
          text: 'Work With Me',
          link: ROUTES.contact,
        }}
      />

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

          <ThreeColumnFeatures
            features={expertiseRow2}
            animationDelay={600}
            stagger={150}
            showHoverEffect={true}
          />
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
          <div
            ref={authorRef}
            style={inViewStyle(authorInView)}
            className="text-center"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
              Published
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
              The Art of Modern PHP&nbsp;8
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Co-authored and published by Packt Publishing. Helps developers worldwide upgrade
              legacy PHP applications to modern standards.
            </p>
            <a
              href="https://www.packtpub.com/product/the-art-of-modern-php-8/9781800566156"
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

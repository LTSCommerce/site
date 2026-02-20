import { Link } from 'react-router-dom';
import { Code2, Server, Database, Brain, Cpu, Terminal } from 'lucide-react';

import { Hero } from '../components/content/Hero';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { ArticleCard } from '../components/article/ArticleCard';
import { BlurText } from '../components/ui/BlurText';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ThreeColumnFeatures } from '../components/ui/ThreeColumnFeatures';
import type { ThreeColumnFeature } from '../components/ui/ThreeColumnFeatures';
import { ROUTES } from '../routes';
import { SAMPLE_ARTICLES } from '../data/articles';

// First row of expertise: core technical skills
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

// Second row of expertise: strategy and emerging tech
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
    title: 'TypeScript & Modern JavaScript',
    description:
      'Full-stack TypeScript applications including backend Node.js services, CLI tools, and modern JS architecture.',
    icon: Terminal,
    items: ['Node.js backend services', 'CLI tooling', 'TypeScript architecture'],
  },
];

export function Home() {
  // Get latest 3 articles sorted by date
  const latestArticles = [...SAMPLE_ARTICLES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Page
      title="LTSCommerce - Bespoke PHP Development"
      description="LTSCommerce delivers bespoke PHP development and infrastructure solutions for high-complexity, large-scale systems"
    >
      <Hero
        title="LTSCommerce: Bespoke PHP Development for Complex Systems"
        subtitle="Large-scale, high-turnover, high-complexity backend systems. AI-enhanced development workflows. No bullshit, just results."
        cta={{
          text: 'Explore Services',
          link: ROUTES.about,
        }}
      />

      {/* Core Expertise Section */}
      <Section spacing="xl">
        <Container>
          <div className="mb-16 text-center">
            <StatusBadge text="Core Expertise" variant="primary" pulsing={true} />
            <BlurText as="div" className="mt-2">
              <h2>Core Expertise</h2>
            </BlurText>
          </div>

          {/* Row 1 */}
          <div className="mb-6">
            <ThreeColumnFeatures
              features={expertiseRow1}
              animationDelay={200}
              stagger={150}
              showHoverEffect={true}
            />
          </div>

          {/* Row 2 */}
          <ThreeColumnFeatures
            features={expertiseRow2}
            animationDelay={600}
            stagger={150}
            showHoverEffect={true}
          />
        </Container>
      </Section>

      {/* Latest Articles Section */}
      <Section spacing="xl" className="bg-gray-50">
        <Container>
          <h2 className="text-center mb-16">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to={ROUTES.articles.path}
              className="inline-block px-8 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md"
            >
              View All Articles
            </Link>
          </div>
        </Container>
      </Section>

      {/* Published Author Section */}
      <Section spacing="xl">
        <Container size="md">
          <h2 className="text-center mb-12">Published Author</h2>
          <div className="border border-black p-12 text-center">
            <p className="text-lg mb-8">
              I co-authored <strong>"The Art of Modern PHP 8"</strong> published by Packt
              Publishing. The book helps developers worldwide upgrade legacy PHP applications to
              modern standards.
            </p>
            <a
              href="https://www.packtpub.com/product/the-art-of-modern-php-8/9781800566156"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md"
            >
              Learn More
            </a>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

import { Link } from 'react-router-dom';
import { Hero } from '../components/content/Hero';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { ArticleCard } from '../components/article/ArticleCard';
import { ROUTES } from '../routes';
import { SAMPLE_ARTICLES } from '../data/articles';

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
          <h2 className="text-center mb-16">Core Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
            <article className="p-8 bg-white">
              <h3 className="mb-4">Bespoke PHP Development</h3>
              <p>
                I build complex, modern PHP systems. I transform legacy code and thrive in
                high-pressure environments.
              </p>
            </article>

            <article className="p-8 bg-white">
              <h3 className="mb-4">Infrastructure & Automation</h3>
              <p>
                I automate with Ansible, run Proxmox virtualization, and manage bare metal servers.
                I prefer private cloud over public cloud every time.
              </p>
            </article>

            <article className="p-8 bg-white">
              <h3 className="mb-4">Backend Systems</h3>
              <p>
                I do pure backend development. No design work. I focus entirely on scalable,
                maintainable PHP architecture.
              </p>
            </article>

            <article className="p-8 bg-white">
              <h3 className="mb-4">CTO-Level Services</h3>
              <p>
                I provide strategic guidance, help with hiring, and train teams. I offer technical
                leadership when projects get complex.
              </p>
            </article>

            <article className="p-8 bg-white">
              <h3 className="mb-4">AI-Enhanced Development</h3>
              <p>
                I use AI tools to speed up development and help businesses integrate AI into their
                processes. Modern workflows with traditional reliability.
              </p>
            </article>

            <article className="p-8 bg-white">
              <h3 className="mb-4">TypeScript & Modern JavaScript</h3>
              <p>
                I build full-stack TypeScript applications. This includes backend Node.js services,
                CLI tools, and modern JavaScript architecture.
              </p>
            </article>
          </div>
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
              className="inline-block px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
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
              className="inline-block px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
            >
              Learn More
            </a>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

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
          <h2 className="text-3xl font-bold text-center mb-12">Core Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 text-blue-600">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3h18v18H3zM12 8v8m-4-4h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Bespoke PHP Development</h3>
              <p className="text-gray-700">
                I build complex, modern PHP systems. I transform legacy code and thrive in
                high-pressure environments.
              </p>
            </article>

            <article className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 text-green-600">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M5 12l4-4m-4 4l4 4m10-4l-4-4m4 4l-4 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Infrastructure & Automation</h3>
              <p className="text-gray-700">
                I automate with Ansible, run Proxmox virtualization, and manage bare metal servers.
                I prefer private cloud over public cloud every time.
              </p>
            </article>

            <article className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 text-purple-600">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M9 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Backend Systems</h3>
              <p className="text-gray-700">
                I do pure backend development. No design work. I focus entirely on scalable,
                maintainable PHP architecture.
              </p>
            </article>

            <article className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 text-indigo-600">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">CTO-Level Services</h3>
              <p className="text-gray-700">
                I provide strategic guidance, help with hiring, and train teams. I offer technical
                leadership when projects get complex.
              </p>
            </article>

            <article className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 text-orange-600">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Enhanced Development</h3>
              <p className="text-gray-700">
                I use AI tools to speed up development and help businesses integrate AI into their
                processes. Modern workflows with traditional reliability.
              </p>
            </article>

            <article className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 text-cyan-600">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 19h20L12 2zm0 5l5.5 9h-11L12 7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">TypeScript & Modern JavaScript</h3>
              <p className="text-gray-700">
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
          <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to={ROUTES.articles.path}
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </Container>
      </Section>

      {/* Published Author Section */}
      <Section spacing="xl">
        <Container size="md">
          <h2 className="text-3xl font-bold text-center mb-8">Published Author</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-lg text-gray-700 mb-6">
              I co-authored <strong>"The Art of Modern PHP 8"</strong> published by Packt
              Publishing. The book helps developers worldwide upgrade legacy PHP applications to
              modern standards.
            </p>
            <a
              href="https://www.packtpub.com/product/the-art-of-modern-php-8/9781800566156"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn More
            </a>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

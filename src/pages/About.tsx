import { Link } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { ROUTES, getArticleRoute } from '../routes';

export function About() {
  return (
    <Page
      title="About Me — Joseph Edmonds | LTS Commerce"
      description="20+ years building complex, high-performance PHP systems. Specialising in legacy modernisation, infrastructure automation, and large-scale backend architecture."
    >
      {/* Hero Section */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">About Me</h1>
            <p className="text-xl text-gray-700 leading-relaxed mx-auto">
              I'm Joseph Edmonds. I build systems that actually work, from PHP platforms to the
              guardrails that keep AI-assisted delivery honest. 25 years turning messy legacy
              codebases, and now messy agent output, into clean, high-performance systems. I work
              remotely from West Yorkshire, UK. No bullshit, just results.
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Content Section */}
      <Section spacing="xl" className="bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">What This Looks Like in Practice</h2>
                <p className="text-gray-700 mb-4">
                  I can't publish client case studies. The work is confidential, and staying that
                  way is part of the deal. What I can say, checkably:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Sole technical lead for a mid-market e-commerce operation. I own the
                    architecture, run the infrastructure it trades on, and I'm the one who delivers
                    what actually ships, agent-driven work gated by my own tooling. External
                    agencies come in alongside me, working to standards I set.
                  </li>
                  <li>4-node high-availability Proxmox cluster, managed entirely as code.</li>
                  <li>
                    Automated error detection, deduplication, and first-pass triage through the
                    GitHub API.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">My Journey</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    I started at an online musical instrument startup in the early 2000s, back when
                    ecommerce was still new. I ran everything operational — buying, warehousing,
                    customer service, marketing, the website — and when we couldn't hire a
                    developer to automate the warehouse, I taught myself PHP and built it. That
                    automation transformed peak season, and the SEO work I did alongside it took us
                    to around a million indexed pages.
                  </p>
                  <p>
                    What started as necessity became the career. In 2007 I went out on my own and
                    founded Edmonds Commerce, a specialist ecommerce development agency that I grew
                    to a fifteen-person team serving payment processors, fintechs, startups and
                    B2C/B2B retailers. These days I trade as LTS Commerce Ltd — but the company is
                    just the wrapper. What you're hiring is me.
                  </p>
                  <p>
                    I've put in thousands of hours of hands-on development work. I can confidently
                    say I'm at expert level now. Writing <strong>"The Art of Modern PHP 8"</strong>{' '}
                    helped solidify that. The best way to learn is to teach, they say.
                  </p>
                  <p>
                    Today, I help businesses with large-scale PHP applications that handle serious
                    volume. I clean up legacy codebases, tackle massive tech debt, and work in
                    high-pressure environments where performance and reliability can't fail.
                  </p>
                  <p>
                    Somewhere in that stretch I got serious about how code actually gets tested and
                    shipped. I've been building and operating CI infrastructure since 2014, first
                    self-hosted Jenkins, then Travis, then my own <code>phpqa</code> tooling, then
                    GitHub Actions. I've published continuously since 2015, eleven years of test
                    infrastructure out in the open. The current guardrail and quality-gate work is
                    the same problem, just applied to agents instead of humans.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Philosophy</h2>
                <p className="text-gray-700">
                  I write clean, maintainable code that lasts. Every solution should be scalable,
                  secure, and simple to understand. Technology should serve the business, not
                  complicate it. When I fix a bug I write the rule that catches its whole class
                  first, then use it to find every other instance,{' '}
                  <Link
                    to={getArticleRoute('defence-before-fix-static-analysis').path}
                    className="text-[#0f4c81] underline"
                  >
                    Defence Before Fix
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Expertise Areas</h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">Agentic Delivery Governance</h3>
                    <p className="text-gray-700">
                      Containment, policy enforcement, and automated quality gates for AI-assisted
                      development: sandboxed agent environments, guardrail design, and the QA/CI
                      infrastructure that catches problems before they ship.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">PHP & Backend Engineering</h3>
                    <p className="text-gray-700">
                      Complex, modern PHP systems that handle real business demands. Legacy
                      modernisation, tech debt cleanup, scalable API design, and high-performance
                      backend architecture. No design work.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">Infrastructure & Automation</h3>
                    <p className="text-gray-700">
                      Ansible automation, Proxmox virtualisation, bare metal servers. Private cloud
                      infrastructure preferred over public cloud.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">
                      Fractional CTO & Technical Leadership
                    </h3>
                    <p className="text-gray-700">
                      Architecture ownership, technical roadmapping, code review culture and
                      engineering standards, for teams that need a senior technical lead without a
                      full-time hire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-bold mb-4">Technical Skills</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2">Core Technologies</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>PHP (Modern & Legacy)</li>
                      <li>TypeScript</li>
                      <li>SQL (MySQL preferred)</li>
                      <li>Bash</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">Infrastructure</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Ansible</li>
                      <li>Proxmox</li>
                      <li>Linux Administration</li>
                      <li>Bare Metal Servers</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">Systems</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>High-Performance PHP</li>
                      <li>Database Optimisation</li>
                      <li>Legacy Modernisation</li>
                      <li>System Architecture</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">Leadership</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>CTO-Level Strategy</li>
                      <li>Team Training</li>
                      <li>Hiring Assistance</li>
                      <li>Technical Audits</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">AI Integration</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>AI-Powered Development</li>
                      <li>Process Automation</li>
                      <li>OpenAI APIs</li>
                      <li>Business AI Solutions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-bold mb-4">Credentials & Recognition</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Published author - "The Art of Modern PHP 8"</li>
                  <li>Zend Certified Engineer</li>
                  <li>20+ years PHP development</li>
                  <li>Large-scale system architecture</li>
                  <li>High-pressure environments</li>
                  <li>Tech debt management expert</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-bold mb-4">Connect</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://linkedin.com/in/edmondscommerce"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f4c81] hover:text-[#1e6ba5] transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/LongTermSupport"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f4c81] hover:text-[#1e6ba5] transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="xl">
        <Container size="md">
          <div className="text-center bg-gray-50 p-12 rounded-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-700 mb-6">
              Got a project, a mess that needs cleaning up, or a team that could use an extra senior
              pair of hands? Get in touch.
            </p>
            <Link
              to={ROUTES.contact.path}
              className="inline-block px-8 py-4 bg-[#0f4c81] text-white rounded-lg hover:bg-[#1e6ba5] transition-colors font-semibold"
            >
              Get In Touch
            </Link>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

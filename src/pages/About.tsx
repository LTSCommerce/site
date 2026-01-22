import { Link } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { ROUTES } from '../routes';

export function About() {
  return (
    <Page
      title="About - LTSCommerce"
      description="About Joseph - Bespoke PHP developer specializing in complex systems and infrastructure"
    >
      {/* Hero Section */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">About Joseph</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              I build complex PHP systems that actually work. I've spent over a decade turning messy
              legacy codebases into clean, high-performance systems. No bullshit, just results.
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
                <h2 className="text-3xl font-bold mb-4">My Journey</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    I started my career at an ecommerce company back when ecommerce was still new.
                    There weren't any ready-made solutions that could handle what we needed. So I
                    learned to program out of necessity. We had to build the systems ourselves to
                    handle our sales volume.
                  </p>
                  <p>
                    What started as necessity became a passion. I actually enjoyed the development
                    work. So I decided to really learn it properly. After getting solid with the
                    fundamentals and building up experience, I went freelance. That was a long time
                    ago now.
                  </p>
                  <p>
                    I've put in thousands of hours of hands-on development work. I can confidently
                    say I'm at expert level now. Writing{' '}
                    <strong>"The Art of Modern PHP 8"</strong> helped solidify that. The best way to
                    learn is to teach, they say.
                  </p>
                  <p>
                    Today, I help businesses with large-scale PHP applications that handle serious
                    volume. I clean up legacy codebases, tackle massive tech debt, and work in
                    high-pressure environments where performance and reliability can't fail.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Philosophy</h2>
                <p className="text-gray-700">
                  I write clean, maintainable code that lasts. Every solution should be scalable,
                  secure, and simple to understand. Technology should serve the business, not
                  complicate it.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Expertise Areas</h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">Bespoke PHP Development</h3>
                    <p className="text-gray-700">
                      Complex, modern PHP systems that handle real business demands. Legacy
                      modernization, tech debt cleanup, and high-performance backend development.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">Infrastructure & Automation</h3>
                    <p className="text-gray-700">
                      Ansible automation, Proxmox virtualization, bare metal servers. Private cloud
                      infrastructure preferred over public cloud solutions.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">Backend Systems</h3>
                    <p className="text-gray-700">
                      Pure backend development focus. No design work. Scalable, maintainable PHP
                      architecture for complex business requirements.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">CTO-Level Services</h3>
                    <p className="text-gray-700">
                      Strategic guidance, hiring assistance, team training, and technical leadership
                      for organizations building complex PHP systems.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-2">AI-Enhanced Development</h3>
                    <p className="text-gray-700">
                      Actively embracing AI tools for development efficiency and implementing AI into
                      business processes. Modern workflows with traditional reliability.
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
                      <li>Database Optimization</li>
                      <li>Legacy Modernization</li>
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
            </aside>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="xl">
        <Container size="md">
          <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-lg border border-blue-200">
            <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-lg text-gray-700 mb-6">
              Ready to bring your project to life? I'd love to hear about your challenges and goals.
            </p>
            <Link
              to={ROUTES.contact.path}
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start a Conversation
            </Link>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

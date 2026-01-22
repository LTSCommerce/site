import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';

export function Contact() {
  const handleSendEmail = () => {
    const form = document.getElementById('contactForm') as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const projectType = formData.get('projectType') as string;
    const budget = formData.get('budget') as string;
    const timeline = formData.get('timeline') as string;
    const message = formData.get('message') as string;

    const emailBody = `
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Project Type: ${projectType}
Budget Range: ${budget || 'N/A'}
Timeline: ${timeline || 'N/A'}

Project Details:
${message}
    `.trim();

    const mailtoLink = `mailto:hello@ltscommerce.dev?subject=Project Inquiry from ${name}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Page
      title="Contact - LTSCommerce"
      description="Contact LTSCommerce - Get in touch for bespoke PHP development projects"
    >
      {/* Hero Section */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Let's Work Together</h1>
            <p className="text-xl text-gray-700">Have a project in mind? I'd love to hear about it.</p>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section spacing="xl" className="bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form id="contactForm" className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type *
                    </label>
                    {/* eslint-disable custom/use-types-not-strings */}
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a project type</option>
                      <option value="bespoke-php">Bespoke PHP Development</option>
                      <option value="legacy-php">Legacy PHP Modernization</option>
                      <option value="infrastructure">Infrastructure & Automation</option>
                      <option value="cto-services">CTO-Level Services</option>
                      <option value="ai-development">AI-Enhanced Development</option>
                      <option value="other">Other</option>
                    </select>
                    {/* eslint-enable custom/use-types-not-strings */}
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="5k-10k">£5,000 - £10,000</option>
                      <option value="10k-25k">£10,000 - £25,000</option>
                      <option value="25k-50k">£25,000 - £50,000</option>
                      <option value="50k+">£50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1month">Within 1 month</option>
                      <option value="3months">Within 3 months</option>
                      <option value="6months">Within 6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      placeholder="Tell me about your project, goals, and any specific requirements..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Open Email Client to Send
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <aside className="space-y-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-700 mb-6">
                  I'm always interested in hearing about new projects and opportunities. Whether you
                  need a complete solution built from scratch or help with an existing system, I'm
                  here to help.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Response Time</h3>
                <p className="text-gray-700">
                  I typically respond within 24 hours during business days.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Project Process</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Initial consultation to understand your needs</li>
                  <li>Detailed project proposal and timeline</li>
                  <li>Agile development with regular updates</li>
                  <li>Thorough testing and quality assurance</li>
                  <li>Deployment and ongoing support</li>
                </ol>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Other Ways to Connect</h3>
                <div className="space-y-3">
                  <a
                    href="https://linkedin.com/in/josephltshq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/josephltshq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

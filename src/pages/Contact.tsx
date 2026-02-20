import { Button, Card, Label, Select, Textarea, TextInput } from 'flowbite-react';
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
    // Open email client via anchor element - avoids window.location for SPA compliance
    const anchor = document.createElement('a');
    anchor.href = mailtoLink;
    anchor.click();
  };

  return (
    <Page
      title="Contact Joseph - Hire a PHP Expert | LTSCommerce"
      description="Get in touch to discuss your PHP development project. Complex systems, legacy modernisation, infrastructure automation. Typically respond within 24 hours."
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
              <Card>
                <form id="contactForm" className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="name">Name *</Label>
                      </div>
                      <TextInput
                        id="name"
                        name="name"
                        type="text"
                        required
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="email">Email *</Label>
                      </div>
                      <TextInput
                        id="email"
                        name="email"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="company">Company</Label>
                      </div>
                      <TextInput
                        id="company"
                        name="company"
                        type="text"
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="projectType">Project Type *</Label>
                      </div>
                      <Select id="projectType" name="projectType" required>
                        <option value="">Select a project type</option>
                        <option value="bespoke-php">Bespoke PHP Development</option>
                        <option value="legacy-php">Legacy PHP Modernization</option>
                        <option value="infrastructure">Infrastructure & Automation</option>
                        <option value="cto-services">CTO-Level Services</option>
                        <option value="ai-development">AI-Enhanced Development</option>
                        <option value="other">Other</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="budget">Budget Range</Label>
                      </div>
                      <Select id="budget" name="budget">
                        <option value="">Select budget range</option>
                        <option value="5k-10k">£5,000 - £10,000</option>
                        <option value="10k-25k">£10,000 - £25,000</option>
                        <option value="25k-50k">£25,000 - £50,000</option>
                        <option value="50k+">£50,000+</option>
                      </Select>
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="timeline">Project Timeline</Label>
                      </div>
                      <Select id="timeline" name="timeline">
                        <option value="">Select timeline</option>
                        <option value="asap">ASAP</option>
                        <option value="1month">Within 1 month</option>
                        <option value="3months">Within 3 months</option>
                        <option value="6months">Within 6 months</option>
                        <option value="flexible">Flexible</option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="message">Project Details *</Label>
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      placeholder="Tell me about your project, goals, and any specific requirements..."
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleSendEmail}
                    color="blue"
                    size="lg"
                    className="w-full"
                  >
                    Open Email Client to Send
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <aside className="space-y-6">
              <Card>
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-700">
                  I'm always interested in hearing about new projects and opportunities. Whether you
                  need a complete solution built from scratch or help with an existing system, I'm
                  here to help.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-3">Response Time</h3>
                <p className="text-gray-700">
                  I typically respond within 24 hours during business days.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-3">Project Process</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Initial consultation to understand your needs</li>
                  <li>Detailed project proposal and timeline</li>
                  <li>Agile development with regular updates</li>
                  <li>Thorough testing and quality assurance</li>
                  <li>Deployment and ongoing support</li>
                </ol>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-3">Other Ways to Connect</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://linkedin.com/in/josephltshq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/josephltshq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

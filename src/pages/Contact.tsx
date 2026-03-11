import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import {
  contactFormSchema,
  type ContactFormData,
  isApiResponse,
  type SubmissionStatus,
} from '@/types/forms';

function getInputClassName(
  hasError: boolean,
  isValid: boolean,
  isTouched: boolean,
): string {
  const base =
    'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
  if (hasError) {
    return `${base} border-red-500 focus:ring-red-300`;
  }
  if (isValid && isTouched) {
    return `${base} border-green-500 focus:ring-green-300`;
  }
  return `${base} border-gray-300 focus:ring-blue-300`;
}

const SERVICE_AREAS = [
  {
    title: 'Development',
    description:
      'PHP, TypeScript, and full-stack web development. Complex backend systems, API design, ecommerce platforms, legacy modernisation, and performance optimisation.',
  },
  {
    title: 'Technical Leadership',
    description:
      'Fractional CTO services, architecture decisions, code review culture, hiring guidance, team standards, and technical roadmapping for growing teams.',
  },
  {
    title: 'Infrastructure & DevOps',
    description:
      'Linux server management, Ansible automation, Proxmox virtualisation, CI/CD pipelines, database administration, and deployment strategy.',
  },
  {
    title: 'Strategy & Training',
    description:
      'Technical audits, tech debt prioritisation, build-vs-buy decisions, team upskilling, and AI-enhanced development workflows with tools like Claude Code.',
  },
];

const TECH_TAGS = [
  'PHP',
  'TypeScript',
  'MySQL',
  'Linux',
  'Ansible',
  'Docker',
  'Ecommerce',
  'REST APIs',
  'Claude Code',
  'AI Integration',
  'Proxmox',
  'Bash',
];

export function Contact() {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [serverError, setServerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid, dirtyFields },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';
  const isDisabled = isSubmitting || isSuccess;

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      // Honeypot check — bots fill this, humans don't see it
      if (data.company_url) {
        // Fake success after a realistic delay
        setStatus('submitting');
        const delay = 1800 + Math.random() * 400;
        await new Promise((resolve) => setTimeout(resolve, delay));
        setStatus('success');
        return;
      }

      const contactFormUrl = import.meta.env['VITE_CONTACT_FORM_URL'] as
        | string
        | undefined;

      if (!contactFormUrl) {
        const mailto = `mailto:hello@ltscommerce.dev?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\n\n${data.message}`)}`;
        const a = document.createElement('a');
        a.href = mailto;
        a.click();
        return;
      }

      setStatus('submitting');
      setServerError('');

      try {
        const payload = {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          origin: window.location.origin,
        };

        const response = await fetch(contactFormUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });

        const json: unknown = await response.json();

        if (!isApiResponse(json)) {
          throw new Error('Unexpected response format from server');
        }

        if (json.success) {
          setStatus('success');
          reset();
        } else {
          setStatus('error');
          setServerError(
            json.error ??
              'Something went wrong. Please try again or email hello@ltscommerce.dev.',
          );
        }
      } catch {
        setStatus('error');
        setServerError(
          'Unable to send your message. Please try again or email hello@ltscommerce.dev directly.',
        );
      }
    },
    [reset],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit],
  );

  const handleSendAnother = useCallback(() => {
    setStatus('idle');
    setServerError('');
    reset();
  }, [reset]);

  return (
    <Page
      title="Hire Joseph Edmonds - Senior Developer & Technical Leader | LTSCommerce"
      description="Available for hire: PHP, TypeScript, DevOps, infrastructure, technical leadership, and AI-enhanced development. 20+ years experience. 150/hr."
    >
      {/* Hero + Services combined */}
      <Section spacing="md">
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Hire Me</h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Senior developer and technical leader with over 20 years of experience.
              I work across the full stack and can operate at both the code level
              and the strategic level depending on what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {SERVICE_AREAS.map((service) => (
              <div
                key={service.title}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                <p className="text-gray-700 text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-0">
            {TECH_TAGS.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* How I Work + Why Hire Me */}
      <Section spacing="sm" className="bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-3">How I Work</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Rate</span>
                  <span>150/hr GBP, 2 hour minimum. Negotiable for longer engagements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Location</span>
                  <span>Remote-first, UK-based. Available for occasional on-site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Engagement</span>
                  <span>Flexible. One-off audits to long-term embedded development.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Response</span>
                  <span>Within 24 hours on business days.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-3">Why Hire Me</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>20+ years hands-on experience across PHP, TypeScript, Linux, and databases.</li>
                <li>Published author of "The Art of Modern PHP 8". Zend Certified Engineer.</li>
                <li>Proven track record with large-scale, high-pressure systems and legacy codebases.</li>
                <li>Comfortable at the keyboard and the whiteboard. I can write the code or lead the team.</li>
                <li>Active AI adopter. I use Claude Code daily and can help your team do the same.</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section spacing="md">
        <Container>
          <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="mb-4 text-green-600">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thanks for reaching out. I'll get back to you within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendAnother}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-5" noValidate>
                    {/* Honeypot field */}
                    <input
                      type="text"
                      {...register('company_url')}
                      tabIndex={-1}
                      autoComplete="url"
                      style={{
                        position: 'absolute',
                        left: '-9999px',
                        width: '1px',
                        height: '1px',
                      }}
                      aria-hidden="true"
                    />

                    {/* Server error */}
                    {status === 'error' && serverError && (
                      <div
                        role="alert"
                        className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700"
                      >
                        {serverError}
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        disabled={isDisabled}
                        {...register('name')}
                        className={getInputClassName(
                          Boolean(errors.name),
                          !errors.name && Boolean(dirtyFields.name),
                          Boolean(touchedFields.name),
                        )}
                      />
                      {errors.name && (
                        <p
                          id="name-error"
                          role="alert"
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        disabled={isDisabled}
                        {...register('email')}
                        className={getInputClassName(
                          Boolean(errors.email),
                          !errors.email && Boolean(dirtyFields.email),
                          Boolean(touchedFields.email),
                        )}
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          role="alert"
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        aria-required="true"
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        disabled={isDisabled}
                        {...register('subject')}
                        className={getInputClassName(
                          Boolean(errors.subject),
                          !errors.subject && Boolean(dirtyFields.subject),
                          Boolean(touchedFields.subject),
                        )}
                      />
                      {errors.subject && (
                        <p
                          id="subject-error"
                          role="alert"
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        aria-required="true"
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        disabled={isDisabled}
                        placeholder="Tell me about your project, your team, and what you're looking for..."
                        {...register('message')}
                        className={getInputClassName(
                          Boolean(errors.message),
                          !errors.message && Boolean(dirtyFields.message),
                          Boolean(touchedFields.message),
                        )}
                      />
                      {errors.message && (
                        <p
                          id="message-error"
                          role="alert"
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isDisabled || !isValid}
                      className="w-full py-3 px-6 bg-[#0f4c81] text-white rounded-md text-sm font-medium hover:bg-[#1e6ba5] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Quick Details</h3>
                <dl className="space-y-3 text-gray-700">
                  <div>
                    <dt className="font-medium text-gray-900">Rate</dt>
                    <dd>150/hr GBP (2hr min)</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">Based</dt>
                    <dd>United Kingdom (remote)</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">Response</dt>
                    <dd>Within 24 hours</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">Availability</dt>
                    <dd>Taking new clients</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Connect</h3>
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
    </Page>
  );
}

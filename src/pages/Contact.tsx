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
        // No backend configured — open mailto as fallback
        const mailto = `mailto:hello@ltscommerce.dev?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\n\n${data.message}`)}`;
        window.location.href = mailto;
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
      title="Contact Joseph - Hire a PHP Expert | LTSCommerce"
      description="Get in touch to discuss your PHP development project. Complex systems, legacy modernisation, infrastructure automation. Typically respond within 24 hours."
    >
      {/* Hero Section */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Let's Work Together</h1>
            <p className="text-xl text-gray-700 mx-auto">Have a project in mind? I'd love to hear about it.</p>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section spacing="xl" className="bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h2>
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
                    {/* Honeypot field — hidden from humans, catches bots */}
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
                        placeholder="Tell me about your project, goals, and any specific requirements..."
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
                      className="w-full py-3 px-6 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            {/* Contact Info Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-700">
                  I'm always interested in hearing about new projects and opportunities. Whether you
                  need a complete solution built from scratch or help with an existing system, I'm
                  here to help.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Response Time</h3>
                <p className="text-gray-700">
                  I typically respond within 24 hours during business days.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Project Process</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Initial consultation to understand your needs</li>
                  <li>Detailed project proposal and timeline</li>
                  <li>Agile development with regular updates</li>
                  <li>Thorough testing and quality assurance</li>
                  <li>Deployment and ongoing support</li>
                </ol>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Other Ways to Connect</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://linkedin.com/in/edmondscommerce"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/LongTermSupport"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
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

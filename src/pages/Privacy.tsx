import { Link } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { ROUTES } from '../routes';

const LAST_UPDATED = '12 August 2026';

export function Privacy() {
  return (
    <Page
      title="Privacy Policy - LTS Commerce Ltd"
      description="How LTS Commerce Ltd collects, uses, and protects personal data submitted through this site's contact form — what's collected, why, and your rights under UK GDPR."
    >
      <Section spacing="xl">
        <Container size="md">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated {LAST_UPDATED}</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Who this is</h2>
              <p className="text-gray-700">
                This site is operated by <strong>LTS Commerce Ltd</strong> (company number 16618262,
                registered in England &amp; Wales, VAT registered). For anything in this policy,
                contact{' '}
                <a href="mailto:hello@ltscommerce.dev" className="text-[#0f4c81]">
                  hello@ltscommerce.dev
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">What data is collected</h2>
              <p className="text-gray-700">
                The only personal data this site collects is what you submit through the{' '}
                <Link to={ROUTES.contact.path} className="text-[#0f4c81]">
                  contact form
                </Link>
                : your name, email address, subject, and message. There is no user account system,
                no newsletter signup, and no analytics or advertising tracking anywhere on the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Why it's collected</h2>
              <p className="text-gray-700">
                Solely to respond to your enquiry. The legal basis is legitimate interest —
                responding to a business enquiry you initiated by filling in the form. It is not
                used for marketing, and it is not sold or shared with third parties for their own
                purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Who processes it</h2>
              <p className="text-gray-700">
                The contact form submits to a Google Apps Script web app, which sends the message on
                as an email via Gmail. Your submission therefore transits Google&apos;s
                infrastructure as part of delivering that email — Google acts as a processor for
                this single purpose. A hidden honeypot field is used to filter automated spam
                submissions; it does not collect any additional data about you.
              </p>
              <p className="text-gray-700">
                Like any website, this one is served through standard hosting infrastructure
                (Cloudflare as a CDN/proxy, GitHub Pages for static hosting), which processes
                routine connection metadata (e.g. IP address, request logs) as part of serving the
                page. This is standard technical operation, not used for profiling or marketing.
                Cloudflare may set strictly-necessary technical cookies as part of protecting the
                site from abuse; this site does not set analytics or advertising cookies itself.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">How long it's kept</h2>
              <p className="text-gray-700">
                Contact form submissions arrive as email and are kept only as long as needed to
                respond to and follow up on the enquiry, then deleted in the ordinary course of
                inbox management.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Your rights</h2>
              <p className="text-gray-700">
                Under UK GDPR, you have the right to access, correct, or request deletion of your
                personal data, to object to or restrict its processing, and to complain to the{' '}
                <a
                  href="https://ico.org.uk/make-a-complaint/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0f4c81]"
                >
                  Information Commissioner&apos;s Office (ICO)
                </a>{' '}
                if you believe your data has been mishandled. To exercise any of these rights, email{' '}
                <a href="mailto:hello@ltscommerce.dev" className="text-[#0f4c81]">
                  hello@ltscommerce.dev
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

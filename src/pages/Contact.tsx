import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Prose } from '../components/content/Prose';

export function Contact() {
  return (
    <Page title="Contact" description="Get in touch with us">
      <Section spacing="large">
        <Container maxWidth="narrow">
          <Prose>
            <h1>Contact</h1>
            <p>
              This is an example contact page. In your actual site, you'd add a contact form or
              contact information here.
            </p>

            <h2>Example Contact Info</h2>
            <p>
              Email: <a href="mailto:hello@example.com">hello@example.com</a>
            </p>

            <h2>Type-Safe Contact Links</h2>
            <p>
              Notice how the email link uses standard <code>href</code> with <code>mailto:</code>.
              Our type system supports ContactLink type (<code>tel:</code> and{' '}
              <code>mailto:</code>) for contact information.
            </p>
          </Prose>
        </Container>
      </Section>
    </Page>
  );
}

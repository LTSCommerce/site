import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Prose } from '../components/content/Prose';

export function About() {
  return (
    <Page title="About" description="About our site">
      <Section spacing="large">
        <Container maxWidth="narrow">
          <Prose>
            <h1>About This Skeleton</h1>
            <p>
              This is a <strong>type-safe React/TypeScript skeleton</strong> for building modern
              static sites with robust ESLint rules and component-driven design.
            </p>

            <h2>Features</h2>
            <ul>
              <li>
                <strong>Total Type Safety</strong> - TypeScript strict mode, no magic strings
              </li>
              <li>
                <strong>Custom ESLint Rules</strong> - Enforce typed patterns, catch errors early
              </li>
              <li>
                <strong>Component-Driven</strong> - Reusable, well-documented components
              </li>
              <li>
                <strong>Minimal & Extensible</strong> - Just the essentials, add what you need
              </li>
            </ul>

            <h2>Type Safety Philosophy</h2>
            <p>
              We believe <strong>strings should only be strings</strong>, not implicit data
              references. Every piece of data (routes, categories, status values) is represented by
              typed objects, not magic strings.
            </p>

            <h3>Why This Matters</h3>
            <p>
              Magic strings like <code>"php"</code> or <code>"/about"</code> compile successfully
              even with typos, leading to runtime errors. Typed objects like{' '}
              <code>CATEGORIES.php.id</code> or <code>ROUTES.about.path</code> catch typos at
              compile time.
            </p>

            <blockquote>
              If it compiles, it works. Runtime errors become compile-time errors.
            </blockquote>
          </Prose>
        </Container>
      </Section>
    </Page>
  );
}

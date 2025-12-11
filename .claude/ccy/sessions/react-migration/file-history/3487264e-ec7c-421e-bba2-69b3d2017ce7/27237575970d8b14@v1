import { Hero } from '../components/content/Hero';
import { CategoryBadge } from '../components/content/CategoryBadge';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { ROUTES } from '../routes';
import { CATEGORIES, getAllCategories } from '../data/categories';

export function Home() {
  return (
    <Page title="LTS Commerce - Professional PHP Engineer">
      <Hero
        title="Joseph Edmonds"
        subtitle="Professional PHP Engineer & Infrastructure Specialist"
        cta={{
          text: 'View Articles',
          link: ROUTES.about,
        }}
      />
      <Section spacing="large" background="gray">
        <Container>
          <h2>Technical Expertise</h2>
          <p>
            Specialized in modern PHP development, database optimization, and infrastructure
            automation. Browse articles by category:
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1.5rem',
            }}
          >
            {getAllCategories().map(category => (
              <CategoryBadge key={category.id} category={category} size="large" />
            ))}
          </div>
        </Container>
      </Section>
      <Section spacing="large">
        <Container maxWidth="narrow">
          <h2>Type-Safe Development</h2>
          <p>
            This site demonstrates the type-safe approach documented in the React Site Skeleton.
            Notice how categories use typed objects:
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <CategoryBadge category={CATEGORIES.php} variant="outlined" />
            <CategoryBadge category={CATEGORIES.typescript} variant="outlined" />
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Using <code>CATEGORIES.php</code> instead of <code>"php"</code> catches typos at
            compile time and enables autocomplete.
          </p>
        </Container>
      </Section>
    </Page>
  );
}

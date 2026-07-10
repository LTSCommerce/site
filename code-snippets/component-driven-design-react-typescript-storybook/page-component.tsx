// Even the top-level layout is a named, testable, documented choice,
// not an ad-hoc CSS class scattered across route files.

type PageLayout = 'default' | 'full-width' | 'landing';

interface PageProps {
  layout: PageLayout;
  children: React.ReactNode;
}

const layoutStyles: Record<PageLayout, string> = {
  default: 'max-w-3xl mx-auto px-6 py-12',
  'full-width': 'w-full px-8 py-8',
  landing: 'max-w-6xl mx-auto px-6',
};

export function Page({ layout, children }: PageProps) {
  return <main className={layoutStyles[layout]}>{children}</main>;
}

// Usage: the layout choice is declared at the route level, not buried in CSS:
//
// function ProductCataloguePage() {
//   return (
//     <Page layout="full-width">
//       <ProductGrid ... />
//     </Page>
//   );
// }
//
// function BlogPostPage() {
//   return (
//     <Page layout="default">
//       <ArticleDetail ... />
//     </Page>
//   );
// }
//
// function HomepagePage() {
//   return (
//     <Page layout="landing">
//       <HeroSection ... />
//       <FeatureGrid ... />
//       <CallToAction ... />
//     </Page>
//   );
// }

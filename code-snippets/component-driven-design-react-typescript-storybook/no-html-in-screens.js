/**
 * ESLint rule: enforce that screen/page components use only named components,
 * never raw HTML elements. Screens must be pure composition.
 *
 * Part of the Defence Before Fix pattern: when a CDD violation was found
 * in a screen component, this rule was created so the entire class of
 * violation becomes a build-time error rather than a convention to remember.
 */

const BANNED_ELEMENTS = [
  'div', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span',
  'ul', 'ol', 'li',
  'form', 'input', 'textarea', 'label', 'select', 'button', 'a',
];

export default {
  meta: {
    type: 'problem',
    messages: {
      noHtmlInScreens:
        '🚫 Raw HTML is banned in screen components: <{{element}}> is not allowed here.\n' +
        'Screens must be composed entirely of named components from src/components/.\n' +
        'Suggested alternatives:\n' +
        '  • <div> / <section>  →  ScreenContainer, PageSection, Card\n' +
        '  • <h1> / <h2>        →  ScreenHeader, SectionHeader\n' +
        '  • <p> / <span>       →  Text, Heading components\n' +
        '  • <button>           →  Button from your component library\n' +
        '  • <form> / <input>   →  FormField, FormSection components\n' +
        'If the right component does not exist yet, create it.',
    },
  },

  create(context) {
    return {
      JSXElement(node) {
        const filename = context.filename ?? context.getFilename();
        const isScreen = filename.includes('/src/screens/') && filename.endsWith('.tsx');

        // Storybook story files are exempt — they need wrappers for layout demos
        if (!isScreen || filename.endsWith('.stories.tsx')) return;

        const elementName = node.openingElement.name.name;
        if (BANNED_ELEMENTS.includes(elementName)) {
          context.report({
            node: node.openingElement,
            messageId: 'noHtmlInScreens',
            data: { element: elementName },
          });
        }
      },
    };
  },
};

/**
 * ESLint Rule: no-children-on-prop-only-components
 *
 * Prevents usage of components with children when they are designed to accept
 * only props. Components that don't accept children define `children?: never`
 * in their TypeScript interface.
 *
 * This rule is configured with a list of component names that must not receive
 * children. Configure the list in eslint.config.js as the component library
 * grows (Plan 007).
 *
 * GOOD:
 * ```tsx
 * <SkillBadge label="PHP" level="expert" />
 * <StatCard value="20+" label="Years Experience" />
 * ```
 *
 * BAD:
 * ```tsx
 * <SkillBadge>PHP expert</SkillBadge>
 * <StatCard>20+ Years Experience</StatCard>
 * ```
 *
 * Configuration in eslint.config.js:
 * ```js
 * 'custom/no-children-on-prop-only-components': ['error', {
 *   components: ['SkillBadge', 'StatCard', 'TechTag'],
 * }]
 * ```
 *
 * Adapted from EC site no-children-on-prop-only-components for LTS Commerce.
 * Component list is initially empty - populate as components gain `children?: never`
 * in their TypeScript interfaces (Plan 007: Component Library).
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent usage of prop-only components with children (components with children?: never)',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noChildrenAllowed:
        'Component "{{componentName}}" does not accept children.\n' +
        '   Its TypeScript interface defines `children?: never`.\n' +
        '\n' +
        '   Use props instead:\n' +
        '     BAD:  <{{componentName}}>content</{{componentName}}>\n' +
        '     GOOD: <{{componentName}} {{propExample}} />\n' +
        '\n' +
        'See: eslint-rules/no-children-on-prop-only-components.md for guidance',
    },
    schema: [
      {
        type: 'object',
        properties: {
          components: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of component names that must not accept children',
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    // Get configured components from rule options
    const options = context.options[0] || {};
    const noChildrenComponents = options.components || [];

    // If no components configured, nothing to check
    if (noChildrenComponents.length === 0) {
      return {};
    }

    return {
      // Check JSX elements for invalid children usage
      JSXElement(node) {
        const openingElement = node.openingElement;

        // Only check JSXIdentifier (simple component names), not JSXMemberExpression
        if (!openingElement.name || openingElement.name.type !== 'JSXIdentifier') {
          return;
        }

        const componentName = openingElement.name.name;

        // Only check components in the configured no-children list
        if (!noChildrenComponents.includes(componentName)) {
          return;
        }

        // Self-closing element: <Component /> - no children, fine
        if (node.children.length === 0) {
          return;
        }

        // Check if element has non-whitespace children
        const hasNonWhitespaceChildren = node.children.some((child) => {
          if (child.type === 'JSXText') {
            return child.value.trim().length > 0;
          }
          // Any JSXElement, JSXExpressionContainer, JSXFragment, JSXSpreadChild
          // are always considered content
          return true;
        });

        if (hasNonWhitespaceChildren) {
          const firstChild = node.children.find((child) => {
            if (child.type === 'JSXText') {
              return child.value.trim().length > 0;
            }
            return true;
          });

          context.report({
            node: firstChild || node,
            messageId: 'noChildrenAllowed',
            data: {
              componentName,
              propExample: 'prop1="value1" prop2="value2"',
            },
          });
        }
      },
    };
  },
};

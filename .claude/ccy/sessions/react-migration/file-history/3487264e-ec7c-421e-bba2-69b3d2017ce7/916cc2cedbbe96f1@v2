/**
 * ESLint Rule: no-string-link-props
 *
 * Prevents using `string` type for link/route props in component interfaces.
 * Requires RouteEntry or LinkDestination types instead.
 *
 * ❌ Bad:  interface Props { link: string; }
 * ✅ Good: interface Props { link: RouteEntry; }
 *
 * Why: String types for links lose type safety. Using RouteEntry:
 * - Enforces typed route references
 * - Prevents magic string routes
 * - Enables compile-time validation
 * - Documents that prop expects a route, not arbitrary string
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow string type for link/route props, require RouteEntry type',
      category: 'Type Safety',
      recommended: true,
    },
    messages: {
      stringLinkProp:
        'Prop "{{propName}}" uses type "string". Use RouteEntry or LinkDestination instead for type-safe routing.',
    },
    schema: [],
  },

  create(context) {
    // Prop names that likely represent links/routes
    const linkPropNames = ['link', 'href', 'to', 'route', 'url', 'destination'];

    return {
      // Check TypeScript interface property signatures
      TSPropertySignature(node) {
        if (node.key && node.typeAnnotation) {
          const propName = node.key.name || node.key.value;

          // Skip if in src/types/ directory (these are base type definitions)
          const filename = context.getFilename();
          if (filename.includes('/types/') || filename.includes('\\types\\')) {
            return;
          }

          // Skip if parent interface is RouteEntry or LinkDestination (these are the base types)
          let parent = node.parent;
          while (parent) {
            if (parent.type === 'TSInterfaceDeclaration' || parent.type === 'TSTypeAliasDeclaration') {
              const interfaceName = parent.id?.name;
              if (interfaceName === 'RouteEntry' || interfaceName === 'LinkDestination') {
                return;
              }
            }
            parent = parent.parent;
          }

          // Check if prop name suggests it's a link/route
          if (linkPropNames.includes(propName?.toLowerCase())) {
            // Check if type annotation is string
            const typeAnnotation = node.typeAnnotation.typeAnnotation;

            if (typeAnnotation.type === 'TSStringKeyword') {
              context.report({
                node: typeAnnotation,
                messageId: 'stringLinkProp',
                data: { propName },
              });
            }
          }
        }
      },

      // Check function parameters with TypeScript type annotations
      'FunctionDeclaration > Identifier[typeAnnotation]'(node) {
        const paramName = node.name;
        if (linkPropNames.includes(paramName.toLowerCase())) {
          const typeAnnotation = node.typeAnnotation?.typeAnnotation;
          if (typeAnnotation?.type === 'TSStringKeyword') {
            context.report({
              node: typeAnnotation,
              messageId: 'stringLinkProp',
              data: { propName: paramName },
            });
          }
        }
      },
    };
  },
};

/**
 * ESLint Rule: no-hardcoded-routes
 *
 * Prevents hardcoded route strings in JSX and enforces use of ROUTES object.
 *
 * ❌ Bad:  <Link to="/about" />
 * ✅ Good: <Link to={ROUTES.about.path} />
 *
 * Why: Route strings are data references, not real strings. Using ROUTES object:
 * - Catches typos at compile time
 * - Enables safe refactoring
 * - Provides autocomplete
 * - Single source of truth
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded route strings, require ROUTES object usage',
      category: 'Type Safety',
      recommended: true,
    },
    messages: {
      hardcodedRoute:
        'Hardcoded route string "{{value}}". Use ROUTES object instead (e.g., ROUTES.about.path)',
    },
    schema: [],
  },

  create(context) {
    // Route pattern: starts with / and contains path-like structure
    const routePattern = /^\/[a-z0-9\-\/]*$/i;

    return {
      JSXAttribute(node) {
        // Check attributes named 'to' or 'href' in JSX
        if (node.name && (node.name.name === 'to' || node.name.name === 'href')) {
          // Check if value is a Literal (string)
          if (node.value && node.value.type === 'Literal') {
            const value = node.value.value;

            // Check if it looks like a route (starts with / and path-like)
            if (typeof value === 'string' && routePattern.test(value)) {
              // Allow only "/" (home) as literal for brevity
              if (value !== '/') {
                context.report({
                  node: node.value,
                  messageId: 'hardcodedRoute',
                  data: { value },
                });
              }
            }
          }
        }
      },

      // Also check Link component from react-router-dom
      CallExpression(node) {
        // navigate("/about") or router.push("/about")
        if (
          (node.callee.name === 'navigate' || node.callee.property?.name === 'push') &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal'
        ) {
          const value = node.arguments[0].value;
          if (typeof value === 'string' && routePattern.test(value) && value !== '/') {
            context.report({
              node: node.arguments[0],
              messageId: 'hardcodedRoute',
              data: { value },
            });
          }
        }
      },
    };
  },
};

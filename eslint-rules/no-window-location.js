/**
 * ESLint Rule: no-window-location
 *
 * Prevents usage of window.location.href, window.location.assign(), and
 * window.location.replace() which cause full page reloads instead of SPA navigation.
 *
 * Also enforces proper attributes on external <a> links:
 * - External links must have target="_blank"
 * - External links with target="_blank" must have rel="noopener noreferrer"
 *
 * For internal navigation use React Router:
 * - import { useNavigate } from 'react-router-dom';
 * - const navigate = useNavigate();
 * - navigate(ROUTES.about.path);
 *
 * Exception: window.location.href is allowed for mailto: and tel: links
 * since these are not navigation events - they open the user's email/phone app.
 * The no-window-location rule only catches HTTP/HTTPS navigation.
 *
 * BAD:
 * window.location.href = '/about';         // Full page reload
 * window.location.assign('/about');         // Full page reload
 * window.location.replace('/about');        // Full page reload
 * <a href="https://example.com">Link</a>   // Missing target/rel
 *
 * GOOD:
 * navigate(ROUTES.about.path);             // SPA navigation
 * <Link to={ROUTES.about.path}>Link</Link> // SPA navigation
 * <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>
 * window.location.href = 'mailto:hello@example.com'; // Allowed (not navigation)
 *
 * Adapted from EC site rule for LTS Commerce.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent window.location usage that causes page reloads in SPA',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noWindowLocationHref:
        'Never use window.location.href for navigation - causes full page reload.\n' +
        '   For internal navigation: import { useNavigate } from "react-router-dom";\n' +
        '     const navigate = useNavigate(); navigate(ROUTES.page.path);\n' +
        '   For external links: <a href="..." target="_blank" rel="noopener noreferrer">\n' +
        '   Exception: window.location.href is allowed for mailto: and tel: URIs.\n' +
        '\n' +
        'See: eslint-rules/no-window-location.md for guidance',
      noWindowLocationAssign:
        'Never use window.location.assign() - causes full page reload.\n' +
        '   For internal navigation: import { useNavigate } from "react-router-dom";\n' +
        '     const navigate = useNavigate(); navigate(ROUTES.page.path);\n' +
        '   For external links: <a href="..." target="_blank" rel="noopener noreferrer">\n' +
        '\n' +
        'See: eslint-rules/no-window-location.md for guidance',
      noWindowLocationReplace:
        'Never use window.location.replace() - causes full page reload.\n' +
        '   For internal navigation: import { useNavigate } from "react-router-dom";\n' +
        '     const navigate = useNavigate(); navigate(ROUTES.page.path, { replace: true });\n' +
        '\n' +
        'See: eslint-rules/no-window-location.md for guidance',
      externalLinkMissingTarget:
        'External link missing target="_blank".\n' +
        '   External links should open in a new tab.\n' +
        '   Add: target="_blank" rel="noopener noreferrer"\n' +
        '\n' +
        'See: eslint-rules/no-window-location.md for guidance',
      externalLinkMissingRel:
        'External link with target="_blank" is missing rel="noopener noreferrer".\n' +
        '   This is a security issue (tabnabbing) and a performance concern.\n' +
        '   Add: rel="noopener noreferrer"\n' +
        '\n' +
        'See: eslint-rules/no-window-location.md for guidance',
    },
    schema: [],
  },

  create(context) {
    /**
     * Check if a string value is a mailto: or tel: URI (not a navigation event).
     * These are allowed with window.location.href since they open external apps.
     */
    function isContactUri(value) {
      if (typeof value !== 'string') return false;
      return value.startsWith('mailto:') || value.startsWith('tel:');
    }

    /**
     * Extract a string value from an assignment right-hand side node.
     * Returns null if the value is not a static string we can inspect.
     */
    function getStaticStringValue(node) {
      if (node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
      }
      if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
        return node.quasis[0].value.cooked;
      }
      return null;
    }

    return {
      // Detect: window.location.href = ...
      AssignmentExpression(node) {
        if (
          node.left.type === 'MemberExpression' &&
          node.left.object.type === 'MemberExpression' &&
          node.left.object.object.name === 'window' &&
          node.left.object.property.name === 'location' &&
          node.left.property.name === 'href'
        ) {
          // Allow mailto: and tel: URIs (not navigation)
          const assignedValue = getStaticStringValue(node.right);
          if (assignedValue !== null && isContactUri(assignedValue)) {
            return;
          }

          // For dynamic values (variables), we still flag it since we can't verify
          // the value isn't a route. Exception: if the variable clearly holds a
          // mailto/tel link by naming convention, we can't detect that statically.
          // Developers must use <a href="mailto:..."> instead.
          context.report({
            node,
            messageId: 'noWindowLocationHref',
          });
        }
      },

      // Detect: window.location.assign() / window.location.replace()
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'MemberExpression' &&
          node.callee.object.object.name === 'window' &&
          node.callee.object.property.name === 'location'
        ) {
          if (node.callee.property.name === 'assign') {
            context.report({
              node,
              messageId: 'noWindowLocationAssign',
            });
          } else if (node.callee.property.name === 'replace') {
            context.report({
              node,
              messageId: 'noWindowLocationReplace',
            });
          }
        }
      },

      // Detect: <a href="https://..."> without proper attributes
      JSXOpeningElement(node) {
        if (node.name.name !== 'a') return;

        const hrefAttr = node.attributes.find(
          (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'href'
        );
        if (!hrefAttr || !hrefAttr.value) return;

        // Extract href value (handle both static strings and JSX expressions)
        let hrefValue = null;
        if (hrefAttr.value.type === 'Literal') {
          hrefValue = hrefAttr.value.value;
        } else if (
          hrefAttr.value.type === 'JSXExpressionContainer' &&
          hrefAttr.value.expression.type === 'Literal'
        ) {
          hrefValue = hrefAttr.value.expression.value;
        }

        if (!hrefValue || typeof hrefValue !== 'string') return;

        // Check if external link (http/https)
        const isExternal =
          hrefValue.startsWith('http://') || hrefValue.startsWith('https://');

        if (isExternal) {
          const targetAttr = node.attributes.find(
            (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'target'
          );
          const relAttr = node.attributes.find(
            (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'rel'
          );

          // Check for target="_blank"
          if (
            !targetAttr ||
            !targetAttr.value ||
            targetAttr.value.value !== '_blank'
          ) {
            context.report({
              node,
              messageId: 'externalLinkMissingTarget',
            });
            return;
          }

          // Check for rel="noopener noreferrer" when target="_blank" is present
          if (targetAttr && targetAttr.value?.value === '_blank') {
            if (
              !relAttr ||
              !relAttr.value ||
              !relAttr.value.value.includes('noopener') ||
              !relAttr.value.value.includes('noreferrer')
            ) {
              context.report({
                node,
                messageId: 'externalLinkMissingRel',
              });
            }
          }
        }
      },
    };
  },
};

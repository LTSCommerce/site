const fs = require('fs');
const path = require('path');

// Load the valid routes from the route registry at lint time
const routeSource = fs.readFileSync(path.resolve('src/routes.ts'), 'utf8');
const validRoutes = parseRoutesFromSource(routeSource);

module.exports = {
    create(context) {
        return {
            Property(node) {
                if (isLinkProp(node) && node.value.type === 'Literal') {
                    const href = node.value.value;
                    if (typeof href === 'string' && href.startsWith('/') && !validRoutes.has(href)) {
                        context.report({
                            node,
                            message: 'Link "' + href + '" points to a route that does not exist.',
                        });
                    }
                }
            },
        };
    },
};

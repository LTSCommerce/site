/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow null coalescing to empty string (?? "")',
            url: 'https://example.com/docs/rules/no-empty-string-fallback',
        },
        messages: {
            noEmptyStringFallback:
                'Null coalescing to empty string hides missing data. '
                + 'See no-empty-string-fallback for the correct construction.',
        },
        schema: [],
    },
    create(context) {
        return {
            LogicalExpression(node) {
                if (
                    node.operator === '??' &&
                    node.right.type === 'Literal' &&
                    node.right.value === ''
                ) {
                    context.report({ node, messageId: 'noEmptyStringFallback' });
                }
            },
        };
    },
};

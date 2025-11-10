/**
 * ESLint custom rule: no-queries-in-loops
 *
 * Detects database query execution inside loops, similar to the PHPStan rule.
 * This is a common performance anti-pattern in Node.js/TypeScript applications.
 */

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow database queries inside loops',
            category: 'Performance',
            recommended: true,
            url: 'https://your-docs.example.com/rules/no-queries-in-loops'
        },
        messages: {
            queryInLoop: 'Database query detected inside a loop ({{loopType}}). This creates N+1 query problems. Refactor to batch queries outside the loop.',
        },
        schema: []
    },

    create(context) {
        // Track loop nesting
        let loopDepth = 0;
        const loopStack = [];

        // Query method patterns to detect
        const queryMethods = new Set([
            'query',
            'execute',
            'find',
            'findOne',
            'findMany',
            'create',
            'update',
            'delete'
        ]);

        return {
            // Track entering loops
            'ForStatement, ForInStatement, ForOfStatement, WhileStatement, DoWhileStatement': (node) => {
                loopDepth++;
                loopStack.push(node.type);
            },

            // Track exiting loops
            'ForStatement:exit, ForInStatement:exit, ForOfStatement:exit, WhileStatement:exit, DoWhileStatement:exit': () => {
                loopDepth--;
                loopStack.pop();
            },

            // Check for query method calls
            CallExpression(node) {
                // Only check if we're inside a loop
                if (loopDepth === 0) {
                    return;
                }

                // Check for await db.query(), db.execute(), etc.
                if (node.callee.type === 'MemberExpression' &&
                    node.callee.property.type === 'Identifier' &&
                    queryMethods.has(node.callee.property.name)) {

                    // Check if the object is likely a database connection
                    const objectName = getObjectName(node.callee.object);
                    if (isDatabaseObject(objectName)) {
                        context.report({
                            node,
                            messageId: 'queryInLoop',
                            data: {
                                loopType: loopStack[loopStack.length - 1]
                            }
                        });
                    }
                }
            }
        };

        function getObjectName(node) {
            if (node.type === 'Identifier') {
                return node.name;
            }
            if (node.type === 'MemberExpression' && node.property.type === 'Identifier') {
                return node.property.name;
            }
            return null;
        }

        function isDatabaseObject(name) {
            if (!name) return false;
            const dbPatterns = ['db', 'database', 'connection', 'conn', 'client'];
            const lowerName = name.toLowerCase();
            return dbPatterns.some(pattern => lowerName.includes(pattern));
        }
    }
};

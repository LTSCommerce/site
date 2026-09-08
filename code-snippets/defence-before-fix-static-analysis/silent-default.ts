// Anti-pattern: the same problem in TypeScript
const customerName = order.customer?.name ?? '';
const emailBody = 'Dear ' + customerName + ', your order has shipped.';

// When name is undefined because of a data mapping bug:
// "Dear , your order has shipped."
// TypeScript is satisfied, the test passes, and the customer gets a broken email.

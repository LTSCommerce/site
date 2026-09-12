// This example demonstrates the @ts-expect-error directive (safer than @ts-ignore, but still a bypass):

// The directive below requires an error to exist on the following line
// @ts-expect-error
const invalid: number = 'string'; // Valid usage - error expected

// But it's still a bypass mechanism
interface StrictAPI {
  endpoint: string;
  port: number;
  auth: { token: string };
}

// Use @ts-expect-error to bypass incomplete types
// @ts-expect-error - TODO: add auth later
const api: StrictAPI = {
  endpoint: 'https://api.example.com',
  port: 443,
}; // Missing 'auth' but no error

// If the underlying error goes away, TypeScript flags the suppression as unused
// @ts-expect-error - this used to be wrong but now it's fixed
const nowValid: string = 'string'; // Error TS2578: Unused '@ts-expect-error' directive

// COMBINED with any for double bypass - the 'as any' already suppresses everything,
// so an @ts-expect-error directive here would itself be flagged as unused (TS2578)
const doubleBypass: number = 'string' as any;

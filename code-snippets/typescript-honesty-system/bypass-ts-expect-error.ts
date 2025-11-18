// @ts-expect-error - "safer" than @ts-ignore but still a bypass

// @ts-expect-error requires an error to exist
// @ts-expect-error
const invalid: number = "string"; // Valid usage - error expected

// But it's still a bypass mechanism
interface StrictAPI {
  endpoint: string;
  port: number;
  auth: { token: string };
}

// Use @ts-expect-error to bypass incomplete types
// @ts-expect-error - TODO: add auth later
const api: StrictAPI = {
  endpoint: "https://api.example.com",
  port: 443
}; // Missing 'auth' but no error

// DANGER: If code changes and error goes away, @ts-expect-error still suppresses
// @ts-expect-error - this used to be wrong but now it's fixed
const nowValid: string = "string"; // TypeScript won't warn this is unnecessary

// COMBINED with any for double bypass
// @ts-expect-error
const doubleBypass: number = ("string" as any);

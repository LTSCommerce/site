// The satisfies operator (TypeScript 4.9+)
// Unlike 'as', satisfies is actually SAFER - it validates without overriding type
// However, it can still be misused in combination with other bypasses

interface Config {
  endpoint: string;
  port: number;
}

// CORRECT use - satisfies validates and preserves literal types
const config = {
  endpoint: "https://api.example.com",
  port: 3000
} satisfies Config;

// SNEAKY bypass - using satisfies with type assertions
const dodgyConfig = {
  endpoint: "not-a-url",
  port: "not-a-number" as unknown as number
} satisfies Config; // satisfies passes because we lied with 'as'

// COMBINED bypass - satisfies + any
const anySatisfies = {
  endpoint: "anything",
  random: "extra properties"
} as any satisfies Config; // Completely defeats the purpose

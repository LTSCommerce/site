// Sneaky bypasses - double assertion tricks

// The classic double assertion
const numAsString = 42 as unknown as string;

// or using 'any' as intermediate
const dateAsNumber = new Date() as any as number;

// Type assertions that "narrow" but lie
interface User {
  name: string;
  email: string;
}

const maybeUser = { name: "Alice" } as User; // Missing email!

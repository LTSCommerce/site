// Type predicates - custom type guards can lie
// TypeScript trusts your type predicate logic without verification

interface User {
  id: number;
  name: string;
}

// LYING type guard - returns true but doesn't actually check
function isUser(value: unknown): value is User {
  // Should check: typeof value === 'object' && 'id' in value && 'name' in value
  // But we're lazy...
  return true; // LIES! Accepts anything as a User
}

// BROKEN type guard - incorrect logic
function isValidNumber(value: unknown): value is number {
  return typeof value === "string"; // Wrong check - returns strings as numbers!
}

// ONE-SIDED type guard - false case is unsafe
function isBigNumber(value: string | number): value is number {
  return typeof value === "number" && value > 1000;
  // Problem: false means value could be string OR number <= 1000
  // TypeScript assumes false = definitely string (incorrect!)
}

// Runtime disaster waiting to happen
const maybeUser = { random: "data" };
if (isUser(maybeUser)) {
  console.log(maybeUser.name.toUpperCase()); // Runtime error!
}

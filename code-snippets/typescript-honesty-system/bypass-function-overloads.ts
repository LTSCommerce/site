// Function overloads - implementation signature can hide unsafe casts

// Public overload signatures look safe
function processValue(input: string): string;
function processValue(input: number): number;

// Implementation signature can cheat
function processValue(input: any): any {
  // We told TypeScript we'd return string|number
  // But implementation can return ANYTHING
  return { surprise: "object" }; // No error!
}

// This LOOKS safe but can explode at runtime
const result = processValue("test");
const upper = result.toUpperCase(); // Runtime error if result is object

// SNEAKY overload bypass
function transform(input: string, safe: true): string;
function transform(input: unknown, safe: false): unknown;
function transform(input: any, safe: boolean): any {
  if (!safe) {
    // Can do ANYTHING here, including unsafe casts
    return input as string; // Lie about the type
  }
  return String(input);
}
